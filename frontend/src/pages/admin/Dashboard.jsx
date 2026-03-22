import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/stats').then((r) => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, Admin 👋</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { icon: '💰', label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, color: 'var(--green)' },
            { icon: '🛒', label: 'Total Orders', value: stats.totalOrders },
            { icon: '⏳', label: 'Pending', value: stats.pendingOrders, color: 'var(--yellow)' },
            { icon: '⚙️', label: 'Processing', value: stats.processingOrders, color: 'var(--purple-light)' },
            { icon: '🚚', label: 'Shipped', value: stats.shippedOrders, color: '#7da5f5' },
            { icon: '✅', label: 'Delivered', value: stats.deliveredOrders, color: 'var(--green)' },
            { icon: '❌', label: 'Cancelled', value: stats.cancelledOrders, color: 'var(--red)' },
            { icon: '👥', label: 'Customers', value: stats.totalUsers },
            { icon: '📦', label: 'Products', value: stats.totalProducts },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value" style={s.color ? { color: s.color } : {}}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Low Stock Alerts */}
        {stats.lowStockProducts.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: 'var(--yellow)' }}>
              ⚠️ Low Stock Alerts ({stats.lowStockProducts.length})
            </h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>
                        <span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-yellow'}`}>
                          {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/product/${p._id}`} className="btn btn-sm btn-secondary">Edit Stock</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/inventory" className="btn btn-primary">📦 Manage Inventory</Link>
          <Link to="/admin/orders" className="btn btn-secondary">🛒 View All Orders</Link>
        </div>
      </div>
    </div>
  );
}
