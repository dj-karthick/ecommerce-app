import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    api.get('/products', { params })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, page]);

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div className="page-header">
        <h1 className="page-title">All Products</h1>
        <p className="page-subtitle">{total} products found</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap" style={{ maxWidth: 340 }}>
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSearchParams({}); }}
          />
        </div>
        <select
          className="form-input form-select"
          style={{ maxWidth: 200 }}
          value={category}
          onChange={(e) => setSearchParams(e.target.value ? { category: e.target.value } : {})}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || category) && (
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setSearchParams({}); }}>
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="text-center" style={{ padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 48 }}>😕</p>
          <p style={{ marginTop: 12 }}>No products found.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
