import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiStar, FiSave } from 'react-icons/fi';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';
import './Admin.css';

const BRANDS = ['HP', 'Dell', 'Lenovo', 'Acer', 'Asus', 'Apple', 'Samsung', 'MSI', 'Other'];
const CONDITIONS = ['Excellent', 'Good', 'Fair'];
const CATEGORIES_LIST = ['Gaming', 'Office', 'Budget', 'Student'];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { createProduct, updateProduct, uploadImage, addProductImage, deleteProductImage } = useAdmin();

  const [form, setForm] = useState({
    name: '',
    brand: 'HP',
    price: '',
    original_price: '',
    ram: '',
    storage: '',
    processor: '',
    screen_size: '',
    condition: 'Good',
    description: '',
    categories: [],
    in_stock: true,
    featured: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single();

    if (error) {
      setError('Product not found');
      return;
    }

    setForm({
      name: data.name || '',
      brand: data.brand || 'HP',
      price: data.price || '',
      original_price: data.original_price || '',
      ram: data.ram || '',
      storage: data.storage || '',
      processor: data.processor || '',
      screen_size: data.screen_size || '',
      condition: data.condition || 'Good',
      description: data.description || '',
      categories: data.categories || [],
      in_stock: data.in_stock ?? true,
      featured: data.featured ?? false,
    });
    setExistingImages(data.product_images || []);
  };

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setNewFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    processFiles(files);
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = async (imageId) => {
    try {
      await deleteProductImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const productData = {
        ...form,
        price: parseInt(form.price),
        original_price: form.original_price ? parseInt(form.original_price) : null,
      };

      let productId = id;

      if (isEdit) {
        await updateProduct(id, productData);
      } else {
        const created = await createProduct(productData);
        productId = created.id;
      }

      // Upload new images
      if (newFiles.length > 0) {
        setUploading(true);
        const hasExisting = existingImages.length > 0;

        for (let i = 0; i < newFiles.length; i++) {
          const url = await uploadImage(newFiles[i]);
          const isPrimary = !hasExisting && i === 0;
          await addProductImage(productId, url, isPrimary);
        }
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="admin-form-content">
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div
          className="admin-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="admin-form-title">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className="glass-input"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. HP EliteBook 840 G5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand *</label>
                <select
                  className="glass-input"
                  value={form.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                >
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input
                  type="number"
                  className="glass-input"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="e.g. 25000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  className="glass-input"
                  value={form.original_price}
                  onChange={(e) => updateField('original_price', e.target.value)}
                  placeholder="e.g. 45000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>RAM</label>
                <input
                  type="text"
                  className="glass-input"
                  value={form.ram}
                  onChange={(e) => updateField('ram', e.target.value)}
                  placeholder="e.g. 8GB"
                />
              </div>
              <div className="form-group">
                <label>Storage</label>
                <input
                  type="text"
                  className="glass-input"
                  value={form.storage}
                  onChange={(e) => updateField('storage', e.target.value)}
                  placeholder="e.g. 256GB SSD"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Processor</label>
                <input
                  type="text"
                  className="glass-input"
                  value={form.processor}
                  onChange={(e) => updateField('processor', e.target.value)}
                  placeholder="e.g. Intel Core i5-8th Gen"
                />
              </div>
              <div className="form-group">
                <label>Screen Size</label>
                <input
                  type="text"
                  className="glass-input"
                  value={form.screen_size}
                  onChange={(e) => updateField('screen_size', e.target.value)}
                  placeholder="e.g. 14 inch"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Condition</label>
                <select
                  className="glass-input"
                  value={form.condition}
                  onChange={(e) => updateField('condition', e.target.value)}
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group form-toggles">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => updateField('in_stock', e.target.checked)}
                  />
                  <span>In Stock</span>
                </label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={async (e) => {
                      const isChecked = e.target.checked;
                      if (isChecked) {
                        const { count } = await supabase
                          .from('products')
                          .select('*', { count: 'exact', head: true })
                          .eq('featured', true);
                          
                        if (count >= 5) {
                          setError('Maximum of 5 products can be featured. Please unfeature another product first.');
                          return;
                        }
                      }
                      updateField('featured', isChecked);
                      if (error === 'Maximum of 5 products can be featured. Please unfeature another product first.') {
                        setError('');
                      }
                    }}
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Categories (Select multiple)</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {CATEGORIES_LIST.map(cat => (
                  <label key={cat} style={{ 
                    background: form.categories.includes(cat) ? 'var(--accent)' : 'var(--surface-hover)', 
                    padding: '8px 16px', 
                    borderRadius: 'var(--radius-full)', 
                    color: form.categories.includes(cat) ? '#fff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    border: '1px solid',
                    borderColor: form.categories.includes(cat) ? 'var(--accent)' : 'var(--border)'
                  }}>
                    <input
                      type="checkbox"
                      style={{ display: 'none' }}
                      checked={form.categories.includes(cat)}
                      onChange={(e) => {
                        const newCats = e.target.checked 
                          ? [...form.categories, cat] 
                          : form.categories.filter(c => c !== cat);
                        updateField('categories', newCats);
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="glass-input"
                rows={4}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe the laptop condition, features, etc."
              />
            </div>

            {/* Image Upload Section */}
            <div className="form-group">
              <label>Product Images</label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="image-preview-grid">
                  {existingImages.map(img => (
                    <div key={img.id} className="image-preview-item">
                      <img src={img.image_url} alt="Product" />
                      {img.is_primary && (
                        <span className="image-primary-badge"><FiStar /> Primary</span>
                      )}
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => removeExistingImage(img.id)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Image Previews */}
              {previews.length > 0 && (
                <div className="image-preview-grid" style={{ marginTop: existingImages.length > 0 ? 12 : 0 }}>
                  {previews.map((url, idx) => (
                    <div key={idx} className="image-preview-item new">
                      <img src={url} alt={`New ${idx + 1}`} />
                      <span className="image-new-badge">New</span>
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => removeNewFile(idx)}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label 
                className={`image-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  borderColor: isDragging ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: isDragging ? 'var(--surface-hover)' : 'transparent'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <FiUpload />
                <span>Click or drag images here to upload</span>
                <span className="image-upload-hint">PNG, JPG up to 5MB each</span>
              </label>
            </div>

            <div className="form-actions">
              <Link to="/admin/dashboard" className="glass-button-outline">
                Cancel
              </Link>
              <button type="submit" className="glass-button" disabled={saving}>
                <FiSave />
                {saving ? (uploading ? 'Uploading images...' : 'Saving...') : (isEdit ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
