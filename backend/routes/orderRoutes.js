const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  sendOrderConfirmationToCustomer,
  sendNewOrderNotificationToAdmin,
  sendOrderStatusUpdateToCustomer,
} = require('../utils/sendEmail');

// @desc   Place a new order
// @route  POST /api/orders
// @access Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Validate stock and build items
    const populatedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
      }
      populatedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // Calculate prices
    const itemsPrice = populatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems: populatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Decrement stock
    for (const item of populatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Send emails
    try {
      await sendOrderConfirmationToCustomer(order, order.shippingAddress.email, order.shippingAddress.name);
      await sendNewOrderNotificationToAdmin(order, order.shippingAddress.name, order.shippingAddress.email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Don't fail the order if email fails
    }

    res.status(201).json(order);
  })
);

// @desc   Get logged-in user's orders
// @route  GET /api/orders/myorders
// @access Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name image price');
    res.json(orders);
  })
);

// @desc   Get all orders (admin)
// @route  GET /api/orders
// @access Admin
router.get(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.limit) || 20;
    const statusFilter = req.query.status ? { status: req.query.status } : {};

    const total = await Order.countDocuments(statusFilter);
    const orders = await Order.find(statusFilter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, total, page, pages: Math.ceil(total / pageSize) });
  })
);

// @desc   Get order stats for admin dashboard
// @route  GET /api/orders/stats
// @access Admin
router.get(
  '/stats',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const totalUsers = await User.countDocuments({ isAdmin: false });
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select(
      'name stock category'
    );
    const totalProducts = await Product.countDocuments();

    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      lowStockProducts,
    });
  })
);

// @desc   Get single order
// @route  GET /api/orders/:id
// @access Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Only owner or admin can see
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(403);
      throw new Error('Not authorized');
    }

    res.json(order);
  })
);

// @desc   Update order status (admin)
// @route  PUT /api/orders/:id/status
// @access Admin
router.put(
  '/:id/status',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // If cancelling - restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.isPaid = true;
      order.paidAt = new Date();
    }
    await order.save();

    // Notify customer of status change
    try {
      await sendOrderStatusUpdateToCustomer(order, order.shippingAddress.email, order.shippingAddress.name);
    } catch (e) {
      console.error('Status email failed:', e.message);
    }

    res.json(order);
  })
);

module.exports = router;
