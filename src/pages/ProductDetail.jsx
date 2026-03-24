import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useProduct } from '../hooks/useProduct';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { product, images, loading, error } = useProduct(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="detail-page container" style={{ paddingTop: 100 }}>
        <div className="detail-skeleton">
          <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ height: 16, width: '30%' }} />
            <div className="skeleton" style={{ height: 32, width: '70%' }} />
            <div className="skeleton" style={{ height: 16, width: '50%' }} />
            <div className="skeleton" style={{ height: 200 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page container" style={{ paddingTop: 100, textAlign: 'center' }}>
        <h2>Product not found</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>The product you're looking for doesn't exist.</p>
        <Link to="/" className="glass-button" style={{ marginTop: 24, display: 'inline-flex' }}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  const sortedImages = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  const currentImage = sortedImages[selectedImageIndex];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in buying the *${product.name}* (${product.brand}) listed at ₹${product.price?.toLocaleString('en-IN')} on your website. Is it still available?`
  );

  const prevImage = () => setSelectedImageIndex(i => (i > 0 ? i - 1 : sortedImages.length - 1));
  const nextImage = () => setSelectedImageIndex(i => (i < sortedImages.length - 1 ? i + 1 : 0));

  return (
    <div className="detail-page">
      <div className="container" style={{ paddingTop: 96 }}>
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to products
        </Link>

        <div className="detail-layout">
          {/* Image Gallery */}
          <motion.div
            className="detail-gallery"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="detail-main-image-wrap glass-card">
              {sortedImages.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImage?.id}
                      src={currentImage?.image_url}
                      alt={product.name}
                      className="detail-main-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </AnimatePresence>
                  {sortedImages.length > 1 && (
                    <>
                      <button className="gallery-nav gallery-prev" onClick={prevImage}><FiChevronLeft /></button>
                      <button className="gallery-nav gallery-next" onClick={nextImage}><FiChevronRight /></button>
                    </>
                  )}
                </>
              ) : (
                <div className="detail-no-image">No Images Available</div>
              )}
            </div>

            {sortedImages.length > 1 && (
              <div className="detail-thumbnails">
                {sortedImages.map((img, idx) => (
                  <button
                    key={img.id}
                    className={`detail-thumb ${idx === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={img.image_url} alt={`${product.name} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="detail-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="product-card-brand">{product.brand}</span>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-stock-badge">
              {product.in_stock ? (
                <span className="badge badge-success"><FaCheckCircle /> In Stock</span>
              ) : (
                <span className="badge badge-danger"><FaTimesCircle /> Out of Stock</span>
              )}
              {product.condition && (
                <span className="badge badge-accent">{product.condition}</span>
              )}
            </div>

            <div className="detail-price-row">
              <span className="detail-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.original_price && (
                <>
                  <span className="detail-original-price">₹{product.original_price?.toLocaleString('en-IN')}</span>
                  <span className="detail-discount">-{discount}% off</span>
                </>
              )}
            </div>

            {/* Specs Grid */}
            <div className="detail-specs glass-card">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {product.processor && (
                  <div className="spec-item">
                    <span className="spec-label">Processor</span>
                    <span className="spec-value">{product.processor}</span>
                  </div>
                )}
                {product.ram && (
                  <div className="spec-item">
                    <span className="spec-label">RAM</span>
                    <span className="spec-value">{product.ram}</span>
                  </div>
                )}
                {product.storage && (
                  <div className="spec-item">
                    <span className="spec-label">Storage</span>
                    <span className="spec-value">{product.storage}</span>
                  </div>
                )}
                {product.screen_size && (
                  <div className="spec-item">
                    <span className="spec-label">Screen</span>
                    <span className="spec-value">{product.screen_size}</span>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className="detail-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            {/* CTA */}
            <div className="detail-actions">
              <a
                href={`https://wa.me/917082604232?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button whatsapp-btn"
              >
                <FaWhatsapp /> Buy on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
