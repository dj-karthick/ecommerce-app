import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const stockStatus = product.stock === 0
    ? { label: 'Out of Stock', cls: 'badge-red' }
    : product.stock <= 5
    ? { label: `Only ${product.stock} left`, cls: 'badge-yellow' }
    : { label: 'In Stock', cls: 'badge-green' };

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.isFeatured && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'linear-gradient(135deg,#6c63ff,#3d5af1)',
            color: '#fff', padding: '4px 10px', borderRadius: '50px',
            fontSize: '11px', fontWeight: 700
          }}>⭐ Featured</span>
        )}
      </div>
      <div className="product-body">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <div className="product-footer" onClick={(e) => e.stopPropagation()}>
          <span className={`badge ${stockStatus.cls}`}>{stockStatus.label}</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
