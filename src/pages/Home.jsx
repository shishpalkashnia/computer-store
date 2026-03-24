import { useState, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { FaLaptop, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import macbookImg from '../components/images/macbook.webp';
import mouseImg from '../components/images/mouse.webp';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useProducts } from '../hooks/useProducts';
import './Home.css';

const BRANDS = ['all', 'HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'Apple', 'Samsung', 'MSI', 'Other'];
const RAM_OPTIONS = ['all', '4GB', '8GB', '16GB', '32GB'];
const STORAGE_OPTIONS = ['all', '128GB SSD', '256GB SSD', '512GB SSD', '1TB SSD', '500GB HDD', '1TB HDD'];

export default function Home() {
  const [filters, setFilters] = useState({
    brand: 'all',
    ram: 'all',
    storage: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  // Parallax effects (minimal for performance)
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const { products, loading } = useProducts(filters);

  const handleSmoothScroll = (e, targetSelector) => {
    if (e) e.preventDefault();
    const target = document.querySelector(targetSelector);
    if (target) {
      const yTarget = target.getBoundingClientRect().top + window.scrollY - 72; // Account for navbar
      window.scrollTo({ top: yTarget, left: 0, behavior: 'smooth' });
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ brand: 'all', ram: 'all', storage: 'all', minPrice: '', maxPrice: '', search: '', category: '' });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.brand !== 'all') count++;
    if (filters.ram !== 'all') count++;
    if (filters.storage !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  }, [filters]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">
            <motion.div
              className="hero-text"
              style={{ y: heroY, opacity: heroOpacity }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="hero-title">
                Certified Used Laptops
              </h1>
              <p className="hero-subtitle">
                Trust, comprehensive warranty, and the best pricing on pre-owned devices. Every laptop is rigorously tested by experts.
              </p>
              
              <div className="trust-badges" style={{ borderTop: 'none', paddingTop: 0, marginBottom: '40px', justifyContent: 'flex-start' }}>
                <div className="trust-badge">
                  <div className="trust-icon">✓</div>
                  <span>Tested & Certified</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">🛡️</div>
                  <span>6-Month Warranty</span>
                </div>
                <div className="trust-badge">
                  <div className="trust-icon">🎧</div>
                  <span>Free Support</span>
                </div>
              </div>
              
              <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
                <a 
                  href="#carousel" 
                  className="glass-button hero-cta"
                  onClick={(e) => handleSmoothScroll(e, '.featured-carousel-section')}
                >
                  Browse Products
                </a>
              </div>
            </motion.div>

            <motion.div 
              className="hero-images"
              style={{ y: heroY, opacity: heroOpacity }}
            >
              <motion.img 
                src={macbookImg} 
                className="hero-macbook"
                alt="Premium Certified Macbook"
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
              <motion.img 
                src={mouseImg} 
                className="hero-mouse"
                alt="Premium Wireless Mouse"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          </div>
          
          <motion.a
            href="#carousel"
            className="scroll-indicator"
            onClick={(e) => handleSmoothScroll(e, '.featured-carousel-section')}
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            aria-label="Scroll down"
          >
            <FiChevronDown />
          </motion.a>
        </div>
      </section>

      {/* Featured Carousel Section */}
      <FeaturedCarousel />

      {/* Categories Section */}
      <section className="categories-section section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="categories-grid">
            {[
              { name: 'Gaming', icon: '🎮' },
              { name: 'Office', icon: '💼' },
              { name: 'Budget', icon: '💰' },
              { name: 'Student', icon: '🎓' }
            ].map(cat => (
              <div 
                key={cat.name} 
                className="category-card glass-card-hover"
                onClick={() => {
                  updateFilter('category', cat.name);
                  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section section" id="products">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="section-title">Explore All Laptops</h2>
            <p className="section-subtitle">Browse our complete certified pre-owned collection</p>
          </motion.div>

          {/* Search + Filter Bar */}
          <div className="filter-bar glass-card">
            <div className="search-wrap">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="glass-input search-input"
                placeholder="Search laptops..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <button
              className={`filter-toggle glass-button-outline ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter />
              Filters
              {(activeFilterCount > 0 || filters.category) && (
                <span className="filter-count">{activeFilterCount + (filters.category ? 1 : 0)}</span>
              )}
            </button>
          </div>

          {filters.category && (
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-accent" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                Category: {filters.category}
                <FiX style={{ cursor: 'pointer' }} onClick={() => updateFilter('category', '')} />
              </span>
            </div>
          )}

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              className="filters-panel glass-card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Brand</label>
                  <select
                    className="glass-input"
                    value={filters.brand}
                    onChange={(e) => updateFilter('brand', e.target.value)}
                  >
                    {BRANDS.map(b => (
                      <option key={b} value={b}>{b === 'all' ? 'All Brands' : b}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>RAM</label>
                  <select
                    className="glass-input"
                    value={filters.ram}
                    onChange={(e) => updateFilter('ram', e.target.value)}
                  >
                    {RAM_OPTIONS.map(r => (
                      <option key={r} value={r}>{r === 'all' ? 'All RAM' : r}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Storage</label>
                  <select
                    className="glass-input"
                    value={filters.storage}
                    onChange={(e) => updateFilter('storage', e.target.value)}
                  >
                    {STORAGE_OPTIONS.map(s => (
                      <option key={s} value={s}>{s === 'all' ? 'All Storage' : s}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Min Price (₹)</label>
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="e.g. 10000"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Max Price (₹)</label>
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="e.g. 50000"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  />
                </div>
              </div>
              {activeFilterCount > 0 && (
                <button className="clear-filters" onClick={clearFilters}>
                  <FiX /> Clear all filters
                </button>
              )}
            </motion.div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-card glass-card">
                  <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '40%' }} />
                    <div className="skeleton" style={{ height: 16, width: '80%' }} />
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton" style={{ height: 20, width: '50%', marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FaLaptop className="empty-icon" />
              <h3>No laptops found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="glass-button" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.slice(0, visibleCount).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              {visibleCount < products.length && (
                <div className="load-more-wrap">
                  <button 
                    className="glass-button load-more-btn"
                    onClick={() => setVisibleCount(prev => prev + 10)}
                  >
                    Load More ({products.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="location-section section" id="location">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Visit Our Store</h2>
            <p className="section-subtitle">Come see our collection in person</p>
          </motion.div>

          <div className="location-grid">
            <motion.div
              className="location-map glass-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3474.841!2d75.016!3d29.534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDMyJzAyLjQiTiA3NcKwMDAnNTcuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Online Computers Sirsa Location"
              />
            </motion.div>

            <motion.div
              className="location-info"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="location-card glass-card">
                <FaMapMarkerAlt className="location-icon" />
                <h3>Online Computers Sirsa</h3>
                <p>Sirsa, Haryana, India</p>
                <div className="location-hours">
                  <h4>Store Hours</h4>
                  <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                  <p>Sunday: 11:00 AM - 6:00 PM</p>
                </div>
                <a
                  href="https://wa.me/917082604232?text=Hi%2C%20I%20want%20to%20visit%20your%20store.%20Can%20you%20share%20the%20exact%20location%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button location-cta"
                >
                  <FaWhatsapp /> Get Directions on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
