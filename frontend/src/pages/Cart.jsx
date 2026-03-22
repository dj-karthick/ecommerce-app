import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 500 ? 0 : cartItems.length > 0 ? 50 : 0;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 64, marginBottom: 16 }}>🛒</p>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Add some products to get started!</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div className="flex-between mb-6">
        <h1 className="page-title">Shopping Cart</h1>
        <button className="btn btn-danger btn-sm" onClick={clearCart}>Clear All</button>
      </div>

      <div className="cart-page">
        {/* Items */}
        <div className="card">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img className="cart-item-img" src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹{item.price.toFixed(2)} each</p>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span className="qty-display">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, color: 'var(--purple-light)', marginBottom: 10 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 700, marginBottom: 18 }}>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span>
          </div>
          {cartTotal < 500 && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Add ₹{(500 - cartTotal).toFixed(2)} more for free shipping
            </p>
          )}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary w-full"
            style={{ marginTop: 20 }}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
          </button>
          <Link to="/products" className="btn btn-secondary w-full" style={{ marginTop: 10 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
