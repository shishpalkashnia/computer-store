import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
import { useAdmin } from '../../hooks/useAdmin';
import './Admin.css';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { fetchAllProducts, toggleStock, toggleFeatured, deleteProduct } = useAdmin();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleStock = async (id, currentStatus) => {
    try {
      await toggleStock(id, currentStatus);
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, in_stock: !currentStatus } : p)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      if (!currentStatus) {
        const featuredCount = products.filter(p => p.featured).length;
        if (featuredCount >= 5) {
          alert('Maximum of 5 products can be featured. Please unfeature another product first.');
          return;
        }
      }
      
      await toggleFeatured(id, currentStatus);
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, featured: !currentStatus } : p)
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard-content">

      <div className="container admin-content">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <FiSearch className="admin-search-icon" />
            <input
              type="text"
              className="glass-input admin-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/admin/products/new" className="glass-button">
            <FiPlus /> Add Product
          </Link>
        </div>

        <div className="admin-stats-row">
          <div className="admin-stat-card glass-card">
            <span className="admin-stat-number">{products.length}</span>
            <span className="admin-stat-label">Total Products</span>
          </div>
          <div className="admin-stat-card glass-card">
            <span className="admin-stat-number">{products.filter(p => p.in_stock).length}</span>
            <span className="admin-stat-label">In Stock</span>
          </div>
          <div className="admin-stat-card glass-card">
            <span className="admin-stat-number">{products.filter(p => !p.in_stock).length}</span>
            <span className="admin-stat-label">Out of Stock</span>
          </div>
        </div>

        {loading ? (
          <div className="admin-table-loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 56, marginBottom: 8, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px' }}>
            <FiPackage style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              {search ? 'Try a different search term' : 'Start by adding your first product'}
            </p>
            {!search && (
              <Link to="/admin/products/new" className="glass-button">
                <FiPlus /> Add First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap glass-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const primaryImg = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-thumb">
                            {primaryImg ? (
                              <img src={primaryImg.image_url} alt={product.name} />
                            ) : (
                              <span>?</span>
                            )}
                          </div>
                          <span className="admin-product-name">{product.name}</span>
                        </div>
                      </td>
                      <td><span className="badge badge-accent">{product.brand}</span></td>
                      <td className="admin-price">₹{product.price?.toLocaleString('en-IN')}</td>
                      <td>
                        <button
                          className={`stock-toggle ${product.in_stock ? 'in-stock' : 'out-stock'}`}
                          onClick={() => handleToggleStock(product.id, product.in_stock)}
                          title={product.in_stock ? 'Mark as out of stock' : 'Mark as in stock'}
                        >
                          <div className="stock-toggle-knob" />
                        </button>
                      </td>
                      <td>
                        <button
                          className={`stock-toggle ${product.featured ? 'in-stock' : 'out-stock'}`}
                          onClick={() => handleToggleFeatured(product.id, product.featured)}
                          title={product.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <div className="stock-toggle-knob" />
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="admin-action-btn edit"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </Link>
                          {deleteConfirm === product.id ? (
                            <div className="delete-confirm">
                              <button
                                className="admin-action-btn delete confirm"
                                onClick={() => handleDelete(product.id)}
                              >
                                Confirm
                              </button>
                              <button
                                className="admin-action-btn cancel"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="admin-action-btn delete"
                              onClick={() => setDeleteConfirm(product.id)}
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
