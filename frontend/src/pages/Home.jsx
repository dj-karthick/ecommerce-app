import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/categories'),
        ]);
        setFeatured(featRes.data);
        setCategories(catRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      {/* <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">✨ Premium Shopping Experience</div>
          <h1 className="hero-title">
            Discover<br /><span>Amazing Products</span>
          </h1>
          <p className="hero-subtitle">
            Shop the latest trends with real-time inventory tracking, secure checkout, and fast delivery right to your doorstep.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Create Account</Link>
          </div>
        </div>
      </section> */}

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '48px 0' }}>
          <div className="container">
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Browse Categories</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  className="badge badge-purple"
                  style={{ padding: '10px 20px', fontSize: 13, cursor: 'pointer' }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section style={{ padding: '0 0 64px' }}>
        <div className="container">
          <div className="flex-between mb-6">
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>⭐ Featured Products</h2>
            <Link to="/products" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>🏪</p>
              <p>No featured products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      {/* <section style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 24 }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹500' },
              { icon: '🔒', title: 'Secure Checkout', desc: 'Your data is always safe' },
              // { icon: '📦', title: 'Live Inventory', desc: 'Real-time stock tracking' },
              { icon: '📧', title: 'Order Updates', desc: 'Email notifications instantly' },
            ].map((f) => (
              <div key={f.title} className="card" style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 24,
          }}>
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹500' },
              { icon: '🔒', title: 'Secure Checkout', desc: 'Your data is always safe' },
              { icon: '📧', title: 'Order Updates', desc: 'Email notifications instantly' },
            ].map((f) => (
              <div key={f.title} className="card" style={{
                padding: 24,
                textAlign: 'center',
                width: 220,        // fixed width per card
                flexShrink: 0,
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
