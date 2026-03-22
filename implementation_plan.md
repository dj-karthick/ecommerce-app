# MERN Stack Ecommerce Application

A full-featured ecommerce web application built with MongoDB, Express, React, and Node.js. It includes product/inventory management, order placement & tracking, and automated email notifications (customer + admin) via Gmail App Passwords.

## User Review Required

> [!IMPORTANT]
> The following environment variables will be required in a `.env` file before the app works:
> - `MONGO_URI` – MongoDB connection string (Atlas or local)
> - `JWT_SECRET` – any random secret string
> - `GMAIL_USER` – your Gmail address (e.g. you@gmail.com)
> - `GMAIL_APP_PASSWORD` – 16-character App Password from Google Account → Security → App Passwords
> - `ADMIN_EMAIL` – email address to receive admin order notifications
> - `PORT` – default 5000

> [!WARNING]
> Gmail App Password requires 2FA to be enabled on your Google account. You must generate an App Password from [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

---

## Proposed Changes

### Backend (Node/Express/MongoDB)

#### [NEW] backend/package.json
Express server with dependencies: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `nodemailer`, `dotenv`, `cors`, `express-async-handler`.

#### [NEW] backend/server.js
Main entry — sets up Express, connects MongoDB, loads routes.

#### [NEW] backend/.env *(template)*
Environment config file (not committed, user fills in values).

#### [NEW] backend/models/User.js
- Fields: `name`, `email`, `password` (hashed), `isAdmin`

#### [NEW] backend/models/Product.js
- Fields: `name`, `description`, `price`, `category`, `image`, `stock` (quantity), `sold`
- `stock` is decremented when an order is placed

#### [NEW] backend/models/Order.js
- Fields: `user` (ref), `orderItems` (array: product, qty, price), `shippingAddress`, `totalPrice`, `status` (Pending/Processing/Shipped/Delivered), `isPaid`, `paidAt`

#### [NEW] backend/routes/authRoutes.js
- `POST /api/auth/register` – create user, hash password
- `POST /api/auth/login` – returns JWT token

#### [NEW] backend/routes/productRoutes.js
- `GET /api/products` – list all (with filters/search/pagination)
- `GET /api/products/:id` – single product
- `POST /api/products` – admin: create product
- `PUT /api/products/:id` – admin: update (including stock)
- `DELETE /api/products/:id` – admin: delete

#### [NEW] backend/routes/orderRoutes.js
- `POST /api/orders` – place order (decrements stock, sends emails)
- `GET /api/orders/myorders` – customer's order list
- `GET /api/orders` – admin: all orders
- `GET /api/orders/:id` – single order
- `PUT /api/orders/:id/status` – admin: update status

#### [NEW] backend/utils/sendEmail.js
Nodemailer + Gmail App Password transport. Sends:
- **Customer**: order confirmation with items, total, estimated delivery
- **Admin**: new order notification with customer info + items

#### [NEW] backend/middleware/authMiddleware.js
JWT verification middleware (`protect`) and `adminOnly` guard.

---

### Frontend (React + Vite)

#### [NEW] frontend/ (Vite React app)
Modern React app with React Router v6, Axios, Context API (Auth + Cart).

#### [NEW] frontend/src/context/AuthContext.jsx
Global auth state — user info, login/logout, token persistence.

#### [NEW] frontend/src/context/CartContext.jsx
Cart state — add/remove items, quantity, total price.

#### Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero banner, featured products, categories |
| Products | `/products` | Product grid with search & filter |
| Product Detail | `/products/:id` | Images, price, stock badge, Add to Cart |
| Cart | `/cart` | Cart items, quantities, total |
| Checkout | `/checkout` | Shipping address form, place order |
| Order Confirmation | `/order/:id` | Success page with order details |
| Login | `/login` | Auth form |
| Register | `/register` | Auth form |
| My Orders | `/myorders` | Customer's order history |

#### Admin Pages (protected, `isAdmin=true`)

| Page | Route | Description |
|---|---|---|
| Dashboard | `/admin` | Stats: revenue, orders, low stock alerts |
| Inventory | `/admin/inventory` | Product list with stock levels, edit inline |
| Add/Edit Product | `/admin/product/:id` | Product form with stock field |
| Orders | `/admin/orders` | All orders, status update dropdown |

#### [NEW] frontend/src/index.css
Premium dark-themed design system — gradients, glassmorphism cards, Inter font, smooth animations.

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── server.js
│   ├── .env (template)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── OrderConfirmation.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── MyOrders.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Inventory.jsx
    │   │       ├── ProductForm.jsx
    │   │       └── Orders.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── StockBadge.jsx
    │   │   ├── OrderStatusBadge.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

---

## Verification Plan

### Automated API Tests
After the backend is running (`npm run dev` in `/backend`), test with curl:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get products
curl http://localhost:5000/api/products
```

### Email Test
Place an order from the frontend UI → check that:
1. Customer email arrives at the registered email
2. Admin email arrives at `ADMIN_EMAIL`

### Browser Tests (Frontend)
Run frontend dev server (`npm run dev` in `/frontend`), open `http://localhost:5173`:
1. Register a new user → Login
2. Browse products → Add to cart
3. Go to Checkout → Place order
4. Verify Order Confirmation page shows
5. Login as admin → Check Dashboard stats
6. Admin Inventory → Edit a product's stock
7. Admin Orders → Change order status

### Manual Verification
- Check MongoDB for created orders and updated product stock
- Verify stock badge shows "Out of Stock" when stock = 0
- Verify low stock alert in admin dashboard (stock < 5)
