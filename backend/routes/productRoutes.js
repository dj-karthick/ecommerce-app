const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc   Get all products (with search/filter/pagination)
// @route  GET /api/products
// @access Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const filter = { ...keyword, ...categoryFilter };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  })
);

// @desc   Get featured products
// @route  GET /api/products/featured
// @access Public
router.get(
  '/featured',
  asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  })
);

// @desc   Get all categories
// @route  GET /api/products/categories
// @access Public
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.json(categories);
  })
);

// @desc   Get single product
// @route  GET /api/products/:id
// @access Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc   Create product
// @route  POST /api/products
// @access Admin
router.post(
  '/',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { name, description, price, category, image, stock, isFeatured } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      isFeatured,
    });
    res.status(201).json(product);
  })
);

// @desc   Update product
// @route  PUT /api/products/:id
// @access Admin
router.put(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { name, description, price, category, image, stock, isFeatured } = req.body;
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.image = image ?? product.image;
    product.stock = stock ?? product.stock;
    product.isFeatured = isFeatured ?? product.isFeatured;

    const updated = await product.save();
    res.json(updated);
  })
);

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Admin
router.delete(
  '/:id',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  })
);

module.exports = router;
