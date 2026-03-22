import { useState, useEffect } from 'react';
import api from '../api/axios';

const STATUS_COLORS = {
  Pending: 'badge-yellow',
  Processing: 'badge-blue',
  Shipped: 'badge-purple',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <h1 className="page-title mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48 }}>📦</p>
          <p style={{ marginTop: 12, fontSize: 16 }}>No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: 24 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--purple-light)', marginBottom: 4 }}>
                    {order._id}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                {order.orderItems.map((item) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                    <span style={{ fontSize: 13 }}>{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex-between">
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  💳 {order.paymentMethod}
                </p>
                <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--purple-light)' }}>
                  ₹{order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
