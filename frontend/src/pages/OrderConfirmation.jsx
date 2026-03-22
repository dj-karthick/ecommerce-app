import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!order) return null;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 768 }}>
      {/* Success banner */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6, color: 'var(--green)' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
          A confirmation email has been sent to <strong style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.email}</strong>
        </p>
      </div>

      {/* Order ID */}
      <div className="card" style={{ padding: 20, marginBottom: 20, background: 'var(--bg-elevated)' }}>
        <div className="flex-between">
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Order ID</p>
            <p style={{ fontFamily: 'monospace', color: 'var(--purple-light)', fontSize: 14, marginTop: 4 }}>{order._id}</p>
          </div>
          <span className="badge badge-green">{order.status}</span>
        </div>
      </div>

      {/* Status Steps */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Order Status</h3>
        <div className="status-steps">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="status-step">
              <div className={`step-dot ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Items Ordered</h3>
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)', gap: 12 }}>
            <div className="flex gap-3" style={{ alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
              <div>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>{item.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
              </div>
            </div>
            <p style={{ fontWeight: 700, color: 'var(--purple-light)' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="flex-between" style={{ marginTop: 16 }}>
          <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
          <span>{order.shippingPrice === 0 ? '🎉 Free' : `₹${order.shippingPrice}`}</span>
        </div>
        <div className="flex-between" style={{ marginTop: 8, fontWeight: 800, fontSize: 18 }}>
          <span>Total</span>
          <span style={{ color: 'var(--purple-light)' }}>₹{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/myorders" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>View All Orders</Link>
        <Link to="/products" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Continue Shopping</Link>
      </div>
    </div>
  );
}
