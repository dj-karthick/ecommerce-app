# MERN Ecommerce App

A full-stack, premium e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Live Demo
**[Click here to view the Live Demo]([https://your-live-demo-link.com](http://localhost:5173/))**  
*(Replace the link above with your actual deployed application URL)*

## 🌟 Features
- **Premium UI/UX:** Modern design with dark theme and glassmorphism.
- **Inventory Management:** Admins can easily add, update, and track product stocks.
- **Order Tracking:** Users can track their orders and view order history.
- **Email Notifications:** Automated email updates to customers and admins upon order placement.
- **Role-Based Authentication:** Secure JWT-based user authentication and authorization (User vs. Admin roles).
- **Admin Dashboard:** Centralized panel for managing products, inventory, and reviewing customer orders.

## 🛠️ Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS / Custom CSS
- React Router
- Axios for API requests

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for Authentication
- Nodemailer for email services

## 💻 Running Locally

### 1. Clone the repository
```bash
git clone git@github.com:dj-karthick/ecommerce-app.git
cd ecommerce-app
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### 3. Install Dependencies
You need to install packages for both the backend and frontend.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application
Open two separate terminal windows.

**Terminal 1: Start Backend Server**
```bash
cd backend
npm run dev
```

**Terminal 2: Start Frontend Application**
```bash
cd frontend
npm run dev
```

The frontend will be running at `http://localhost:5173` (or depending on Vite port setup) and the backend API at `http://localhost:5000`.

## 📄 License
This project is licensed under the MIT License.
