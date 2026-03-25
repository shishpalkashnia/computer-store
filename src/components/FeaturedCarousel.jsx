import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import './FeaturedCarousel.css';

export default function FeaturedCarousel() {
  const { featuredProducts, loading } = useFeaturedProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <div className="featured-carousel-section">
        <div className="carousel-label">
          <span className="sparkle">✨</span> Featured Collection
        </div>
        <div className="coverflow-container">
          <div className="coverflow-scene">
            <div className="coverflow-card center">
              <div className="coverflow-card-inner">
                <div className="coverflow-image-wrap">
                  <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <div className="coverflow-info">
                  <div className="skeleton" style={{ height: 12, width: '40%' }} />
                  <div className="skeleton" style={{ height: 18, width: '75%' }} />
                  <div className="skeleton" style={{ height: 12, width: '60%' }} />
                  <div className="skeleton" style={{ height: 20, width: '50%', marginTop: 8 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  // Max 5 or actual length
  const items = featuredProducts.slice(0, 5);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleCardClick = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    if (offset.x < -40 || velocity.x < -400) {
      handleNext();
    } else if (offset.x > 40 || velocity.x > 400) {
      handlePrev();
    }
  };

  const getPositionStyles = (index) => {
    // Relative distance calculation handling wrap-around
    let diff = index - currentIndex;
    
    // For wrap-around logic:
    if (diff > Math.floor(items.length / 2)) diff -= items.length;
    if (diff < -Math.floor(items.length / 2)) diff += items.length;

    // Center
    if (diff === 0) {
      return { 
        x: '0%', 
        scale: 1, 
        rotateY: 0, 
        zIndex: 5, 
        opacity: 1,
        pointerEvents: 'auto'
      };
    }
    
    // Immediate neighbors (Left = -1, Right = 1)
    if (diff === -1 || (diff === items.length - 1)) {
      return { 
        x: '-60%', 
        scale: 0.85, 
        rotateY: 20, 
        zIndex: 4, 
        opacity: 0.8,
        pointerEvents: 'auto'
      };
    }
    if (diff === 1 || (diff === -(items.length - 1))) {
      return { 
        x: '60%', 
        scale: 0.85, 
        rotateY: -20, 
        zIndex: 4, 
        opacity: 0.8,
        pointerEvents: 'auto'
      };
    }

    // Outer neighbors (Left = -2, Right = 2)
    if (diff === -2 || (diff === items.length - 2)) {
      return { 
        x: '-110%', 
        scale: 0.65, 
        rotateY: 30, 
        zIndex: 3, 
        opacity: 0.4,
        pointerEvents: 'auto'
      };
    }
    if (diff === 2 || (diff === -(items.length - 2))) {
      return { 
        x: '110%', 
        scale: 0.65, 
        rotateY: -30, 
        zIndex: 3, 
        opacity: 0.4,
        pointerEvents: 'auto'
      };
    }

    // Hidden
    return { 
      x: diff < 0 ? '-150%' : '150%', 
      scale: 0.5, 
      rotateY: 0, 
      zIndex: 1, 
      opacity: 0,
      pointerEvents: 'none'
    };
  };

  return (
    <div className="featured-carousel-section">
      <div className="carousel-label">
        <span className="sparkle">✨</span> Featured Collection
      </div>
      
      <div className="coverflow-container">
        {items.length > 1 && (
          <button className="coverflow-nav-btn prev" onClick={handlePrev}>
            <FiChevronLeft />
          </button>
        )}

        <motion.div 
          className="coverflow-scene"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence initial={false}>
            {items.map((product, idx) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url 
                || product.product_images?.[0]?.image_url 
                || '/placeholder.svg';
              
              const isCenter = idx === currentIndex;
              
              return (
                <motion.div
                  key={product.id}
                  className={`coverflow-card ${isCenter ? 'center' : ''}`}
                  onClick={() => handleCardClick(idx)}
                  initial={false}
                  animate={getPositionStyles(idx)}
                  transition={{ type: "spring", stiffness: 150, damping: 22, mass: 0.8 }}
                >
                  <div className="coverflow-card-inner">
                    <div className="coverflow-image-wrap">
                      <img src={primaryImage} alt={product.name} />
                    </div>
                    <div className="coverflow-info">
                      {product.brand && <div className="coverflow-brand">{product.brand}</div>}
                      <h4>{product.name}</h4>
                      <div className="coverflow-specs">
                        {product.processor && <span>{product.processor}</span>}
                        {product.ram && <span> • {product.ram}</span>}
                        {product.storage && <span> • {product.storage}</span>}
                      </div>
                      <div className="coverflow-price-row">
                        <span className="coverflow-price">₹{product.price.toLocaleString('en-IN')}</span>
                        {isCenter && (
                          <Link to={`/product/${product.id}`} className="coverflow-btn">
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {items.length > 1 && (
          <button className="coverflow-nav-btn next" onClick={handleNext}>
            <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
