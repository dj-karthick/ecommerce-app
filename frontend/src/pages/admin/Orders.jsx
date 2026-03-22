import { useState, useEffect } from 'react';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  Pending: 'badge-yellow', Processing: 'badge-blue',
  Shipped: 'badge-purple', Delivered: 'badge-green', Cancelled: 'badge-red',
};
const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter, limit: 50 } : { limit: 50 };
    api.get('/orders', { params })
      .then((r) => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: data.status } : o)));
      toast.success(`Order updated to ${newStatus} · Customer notified via email`);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex-between page-header">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-subtitle">{orders.length} orders</p>
          </div>
          <select
            className="form-input form-select"
            style={{ maxWidth: 200 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 40 }}>📭</p>
            <p style={{ marginTop: 12 }}>No orders found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--purple-light)' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.shippingAddress.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.shippingAddress.email}</p>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {order.orderItems.map((it) => (
                          <span key={it._id} style={{ fontSize: 12 }}>{it.name} × {it.quantity}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--purple-light)' }}>₹{order.totalPrice.toFixed(2)}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </td>
                    <td>
                      <select
                        className="form-input form-select btn-sm"
                        style={{ fontSize: 12, padding: '6px 28px 6px 10px', minWidth: 130 }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
