import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal > 500 ? 0 : 50;
  const total = cartTotal + shipping;

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');

    const orderItems = cartItems.map((i) => ({
      product: i._id,
      quantity: i.quantity,
    }));

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        orderItems,
        shippingAddress: form,
        paymentMethod: 'Cash on Delivery',
      });
      clearCart();
      toast.success('Order placed successfully! Check your email.');
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 className="page-title mb-6">Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--purple-light)' }}>📦 Shipping Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Phone</label>
                <input name="phone" className="form-input" value={form.phone} onChange={handleChange} required placeholder="+91 9876543210" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Street Address</label>
                <input name="street" className="form-input" value={form.street} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input name="city" className="form-input" value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input name="state" className="form-input" value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code</label>
                <input name="zip" className="form-input" value={form.zip} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input name="country" className="form-input" value={form.country} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ marginTop: 8, padding: 14, background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>💳 Payment Method</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Cash on Delivery — Pay when your order arrives</p>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            style={{ marginTop: 16 }}
            disabled={loading}
          >
            {loading ? '⏳ Placing Order...' : '✅ Place Order'}
          </button>
        </form>

        {/* Summary */}
        <div className="order-summary">
          <h3 style={{ fontWeight: 700, marginBottom: 18 }}>Order Summary</h3>
          {cartItems.map((i) => (
            <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{i.name} × {i.quantity}</span>
              <span>₹{(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: 12 }}>
            <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span><span>{shipping === 0 ? '🎉 Free' : `₹${shipping}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
            📧 A confirmation email will be sent to {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
