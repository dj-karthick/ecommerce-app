const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Customer Order Confirmation ─────────────────────────────────────────────
const sendOrderConfirmationToCustomer = async (order, userEmail, userName) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #2a2a4a;">${item.name}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #2a2a4a;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #2a2a4a;text-align:right;">₹${item.price.toFixed(2)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #2a2a4a;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#6c63ff,#3d5af1);padding:36px 30px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">🛍️ ShopDesk</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Order Confirmed!</p>
      </div>

      <!-- Body -->
      <div style="padding:32px 30px;">
        <h2 style="color:#a5b4fc;font-size:20px;margin:0 0 8px;">Hello, ${userName}! 👋</h2>
        <p style="color:#94a3b8;margin:0 0 24px;font-size:15px;line-height:1.6;">
          Thank you for your order. We've received it and it's now being processed. Here's your order summary:
        </p>

        <!-- Order ID -->
        <div style="background:#0f0f23;border-radius:10px;padding:14px 20px;margin-bottom:24px;border-left:4px solid #6c63ff;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
          <p style="margin:4px 0 0;color:#e2e8f0;font-size:15px;font-family:monospace;">${order._id}</p>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#0f0f23;">
              <th style="padding:10px 8px;color:#6c63ff;font-size:12px;text-align:left;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
              <th style="padding:10px 8px;color:#6c63ff;font-size:12px;text-align:center;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:10px 8px;color:#6c63ff;font-size:12px;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
              <th style="padding:10px 8px;color:#6c63ff;font-size:12px;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
            </tr>
          </thead>
          <tbody style="color:#e2e8f0;font-size:14px;">
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="background:#0f0f23;border-radius:10px;padding:20px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="color:#94a3b8;">Subtotal</span>
            <span style="color:#e2e8f0;">₹${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="color:#94a3b8;">Shipping</span>
            <span style="color:#e2e8f0;">₹${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div style="border-top:1px solid #2a2a4a;padding-top:12px;display:flex;justify-content:space-between;">
            <span style="color:#a5b4fc;font-weight:700;font-size:16px;">Total</span>
            <span style="color:#6c63ff;font-weight:700;font-size:18px;">₹${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <!-- Shipping Address -->
        <div style="background:#0f0f23;border-radius:10px;padding:20px;margin-bottom:24px;">
          <p style="margin:0 0 10px;color:#6c63ff;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">📦 Shipping To</p>
          <p style="margin:0;color:#e2e8f0;font-size:14px;line-height:1.7;">
            ${order.shippingAddress.name}<br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
            ${order.shippingAddress.country}<br>
            📱 ${order.shippingAddress.phone}
          </p>
        </div>

        <!-- Payment -->
        <div style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.3);border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;color:#a5b4fc;font-size:14px;">
            💳 Payment Method: <strong style="color:#e2e8f0;">${order.paymentMethod}</strong>
          </p>
          <p style="margin:8px 0 0;color:#a5b4fc;font-size:14px;">
            📋 Status: <strong style="color:#34d399;">${order.status}</strong>
          </p>
        </div>

        <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
          We'll notify you when your order is shipped. Thank you for shopping with us! 🎉
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#0a0a1a;padding:20px 30px;text-align:center;border-top:1px solid #1a1a2e;">
        <p style="margin:0;color:#475569;font-size:12px;">© 2024 ShopDesk · All rights reserved</p>
        <p style="margin:4px 0 0;color:#475569;font-size:12px;">${process.env.GMAIL_USER}</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    console.log(`[Email] Attempting to send order confirmation to customer: ${userEmail}`);
    const info = await transporter.sendMail({
      from: `"ShopDesk 🛍️" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Order Confirmed! #${order._id.toString().slice(-8).toUpperCase()}`,
      html,
    });
    console.log(`[Email] ✔ Customer confirmation sent successfully to ${userEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] ❌ Failed to send customer confirmation to ${userEmail}. Error:`, error.message);
  }
};

// ─── Admin New Order Notification ────────────────────────────────────────────
const sendNewOrderNotificationToAdmin = async (order, userName, userEmail) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #2a2a4a;color:#e2e8f0;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #2a2a4a;color:#e2e8f0;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #2a2a4a;color:#e2e8f0;text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
      <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:28px 30px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">🔔 New Order Received!</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Admin Notification · ShopDesk</p>
      </div>
      <div style="padding:28px 30px;">
        <div style="background:#0f0f23;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
          <p style="margin:4px 0 0;color:#fbbf24;font-size:14px;font-family:monospace;">${order._id}</p>
        </div>
        <div style="background:#0f0f23;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Customer</p>
          <p style="margin:0;color:#e2e8f0;font-size:15px;font-weight:600;">${order.shippingAddress.name}</p>
          <p style="margin:2px 0 0;color:#94a3b8;font-size:13px;">${order.shippingAddress.email}</p>
          <p style="margin:2px 0 0;color:#94a3b8;font-size:13px;">📱 ${order.shippingAddress.phone}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#0f0f23;">
              <th style="padding:8px;color:#f59e0b;font-size:12px;text-align:left;text-transform:uppercase;">Product</th>
              <th style="padding:8px;color:#f59e0b;font-size:12px;text-align:center;text-transform:uppercase;">Qty</th>
              <th style="padding:8px;color:#f59e0b;font-size:12px;text-align:right;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="background:#0f0f23;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0;color:#94a3b8;font-size:13px;">Subtotal: <span style="color:#e2e8f0;">₹${order.itemsPrice.toFixed(2)}</span></p>
          <p style="margin:4px 0;color:#94a3b8;font-size:13px;">Shipping: <span style="color:#e2e8f0;">₹${order.shippingPrice.toFixed(2)}</span></p>
          <p style="margin:8px 0 0;color:#f59e0b;font-size:16px;font-weight:700;">Total: ₹${order.totalPrice.toFixed(2)}</p>
        </div>
        <div style="background:#0f0f23;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Ship To</p>
          <p style="margin:6px 0 0;color:#e2e8f0;font-size:13px;line-height:1.7;">
            ${order.shippingAddress.street}, ${order.shippingAddress.city},<br>
            ${order.shippingAddress.state} ${order.shippingAddress.zip}, ${order.shippingAddress.country}
          </p>
        </div>
      </div>
      <div style="background:#0a0a1a;padding:16px 30px;text-align:center;border-top:1px solid #1a1a2e;">
        <p style="margin:0;color:#475569;font-size:12px;">ShopDesk Admin · ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    console.log(`[Email] Attempting to send new order notification to admin: ${process.env.ADMIN_EMAIL}`);
    const info = await transporter.sendMail({
      from: `"ShopDesk System" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🆕 New Order #${order._id.toString().slice(-8).toUpperCase()} - ₹${order.totalPrice.toFixed(2)}`,
      html,
    });
    console.log(`[Email] ✔ Admin notification sent successfully. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] ❌ Failed to send admin notification to ${process.env.ADMIN_EMAIL}. Error:`, error.message);
  }
};

// ─── Order Status Update Email to Customer ───────────────────────────────────
const sendOrderStatusUpdateToCustomer = async (order, userEmail, userName) => {
  const statusEmoji = {
    Pending: '⏳',
    Processing: '⚙️',
    Shipped: '🚚',
    Delivered: '✅',
    Cancelled: '❌',
  };

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #2a2a4a;">
      <div style="background:linear-gradient(135deg,#6c63ff,#3d5af1);padding:28px 30px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">${statusEmoji[order.status] || '📦'} Order Update</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">ShopDesk · Order Status Changed</p>
      </div>
      <div style="padding:28px 30px;">
        <h2 style="color:#a5b4fc;font-size:18px;margin:0 0 16px;">Hello, ${userName}!</h2>
        <p style="color:#94a3b8;margin:0 0 20px;font-size:14px;line-height:1.6;">
          Your order status has been updated. Here's the latest:
        </p>
        <div style="background:#0f0f23;border-radius:10px;padding:20px;margin-bottom:20px;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
          <p style="margin:4px 0 12px;color:#e2e8f0;font-size:13px;font-family:monospace;">${order._id}</p>
          <div style="display:inline-block;background:rgba(108,99,255,0.2);border:1px solid rgba(108,99,255,0.5);border-radius:50px;padding:10px 24px;">
            <span style="color:#a5b4fc;font-size:18px;font-weight:700;">${statusEmoji[order.status]} ${order.status}</span>
          </div>
        </div>
        <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
          Thank you for shopping with ShopDesk! 🛍️
        </p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    console.log(`[Email] Attempting to send order status update to customer: ${userEmail}`);
    const info = await transporter.sendMail({
      from: `"ShopDesk 🛍️" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: `${statusEmoji[order.status]} Order Update: ${order.status} · #${order._id.toString().slice(-8).toUpperCase()}`,
      html,
    });
    console.log(`[Email] ✔ Status update sent successfully to ${userEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email] ❌ Failed to send status update to ${userEmail}. Error:`, error.message);
  }
};

module.exports = {
  sendOrderConfirmationToCustomer,
  sendNewOrderNotificationToAdmin,
  sendOrderStatusUpdateToCustomer,
};
