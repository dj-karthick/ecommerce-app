import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    const params = search ? { search, limit: 50 } : { limit: 50 };
    api.get('/products', { params })
      .then((r) => setProducts(r.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="flex-between page-header">
          <div>
            <h1 className="page-title">Inventory</h1>
            <p className="page-subtitle">{products.length} products</p>
          </div>
          <Link to="/admin/product/new" className="btn btn-primary">+ Add Product</Link>
        </div>

        {/* Search */}
        <div className="filters-bar">
          <div className="search-input-wrap" style={{ maxWidth: 340 }}>
            <span className="search-icon">🔍</span>
            <input
              className="form-input"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img src={p.image} alt={p.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 200 }}>
                      <p>{p.name}</p>
                      {p.isFeatured && <span className="badge badge-purple" style={{ marginTop: 4, fontSize: 10 }}>Featured</span>}
                    </td>
                    <td>{p.category}</td>
                    <td style={{ fontWeight: 700, color: 'var(--purple-light)' }}>₹{p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock <= 5 ? 'badge-yellow' : 'badge-green'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>{p.sold}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link to={`/admin/product/${p._id}`} className="btn btn-secondary btn-sm">Edit</Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deletingId === p._id}
                        >
                          {deletingId === p._id ? '...' : 'Delete'}
                        </button>
                      </div>
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
