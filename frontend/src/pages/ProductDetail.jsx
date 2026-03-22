import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!product) return null;

  const stockPct = Math.min((product.stock / 50) * 100, 100);
  const stockColor = product.stock === 0 ? 'var(--red)' : product.stock <= 5 ? 'var(--yellow)' : 'var(--green)';

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <button className="btn btn-secondary btn-sm mb-6" onClick={() => navigate(-1)}>← Back</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: 440, objectFit: 'cover' }} />
        </div>

        {/* Info */}
        <div>
          <span className="badge badge-purple" style={{ marginBottom: 14 }}>{product.category}</span>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>{product.name}</h1>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--purple-light)', marginBottom: 20 }}>₹{product.price.toFixed(2)}</p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          {/* Stock */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 24 }}>
            <div className="flex-between mb-2">
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Stock Available</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: stockColor }}>{product.stock} units</span>
            </div>
            <div className="stock-bar">
              <div className="stock-bar-fill" style={{ width: `${stockPct}%`, background: stockColor }} />
            </div>
          </div>

          {/* Qty + Add to Cart */}
          {product.stock > 0 ? (
            <>
              <div className="flex gap-3 mb-4" style={{ alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>QTY:</label>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <span className="qty-display">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
                </div>
              </div>
              <button className="btn btn-primary btn-lg w-full" onClick={() => { addToCart(product, qty); }}>
                🛒 Add {qty} to Cart
              </button>
            </>
          ) : (
            <div className="badge badge-red" style={{ padding: '12px 20px', fontSize: 14, width: '100%', justifyContent: 'center' }}>
              ❌ Out of Stock
            </div>
          )}

          <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
            🚚 Free shipping on orders above ₹500 · 📧 Email confirmation on order
          </div>
        </div>
      </div>
    </div>
  );
}
