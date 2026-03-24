import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const primaryImage = product.product_images?.find(img => img.is_primary)
    || product.product_images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ height: '100%' }}
    >
      <Link to={`/product/${product.id}`} className="product-card glass-card-hover">
        <div className="product-card-image-wrap">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={product.name}
              className="product-card-image"
              loading="lazy"
            />
          ) : (
            <div className="product-card-placeholder">
              <span>No Image</span>
            </div>
          )}
          {!product.in_stock && (
            <div className="product-card-oos-badge">Out of Stock</div>
          )}
        </div>

        <div className="product-card-body">
          <span className="product-card-brand">{product.brand}</span>
          <h3 className="product-card-name">{product.name}</h3>

          <div className="product-card-specs">
            {product.ram && <span className="product-card-spec">{product.ram}</span>}
            {product.storage && <span className="product-card-spec">{product.storage}</span>}
          </div>

          <div className="product-card-footer">
            <div className="product-card-price-col">
              <span className="product-card-price">₹{product.price?.toLocaleString('en-IN')}</span>
            </div>
            <span className="product-card-btn">View Details</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
