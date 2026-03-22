import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: '',
    image: '', stock: '', isFeatured: false,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      api.get(`/products/${id}`)
        .then((r) => {
          const { name, description, price, category, image, stock, isFeatured } = r.data;
          setForm({ name, description, price, category, image, stock, isFeatured });
        })
        .catch(() => navigate('/admin/inventory'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isNew) {
        await api.post('/products', payload);
        toast.success('Product created!');
      } else {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      }
      navigate('/admin/inventory');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="page-header">
          <h1 className="page-title">{isNew ? '+ Add Product' : 'Edit Product'}</h1>
        </div>

        <div className="card" style={{ maxWidth: 700, padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Product Name</label>
                <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Description</label>
                <textarea name="description" className="form-input" value={form.description}
                  onChange={handleChange} rows={4} required style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input name="price" type="number" min="0" step="0.01" className="form-input" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input name="stock" type="number" min="0" className="form-input" value={form.stock} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input name="category" className="form-input" value={form.category} onChange={handleChange} placeholder="Electronics, Clothing, etc." required />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input name="image" className="form-input" value={form.image} onChange={handleChange} placeholder="https://..." />
              </div>
              {form.image && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <img src={form.image} alt="preview" style={{ height: 160, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }} />
                </div>
              )}
              <div className="form-group" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="featured" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: 'var(--purple)' }} />
                <label htmlFor="featured" className="form-label" style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>
                  Mark as Featured Product
                </label>
              </div>
            </div>

            <div className="flex gap-3" style={{ marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving...' : isNew ? '✅ Create Product' : '✅ Update Product'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/inventory')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
