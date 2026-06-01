import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash, Search, X, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../features/productSlice';
import { fetchCategories } from '../../features/categorySlice';
import { resolveImageUrl } from '../../utils/imageUrl';

const Products = () => {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const { items: categories, status: catStatus } = useSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
    if (catStatus === 'idle') dispatch(fetchCategories());
  }, [status, catStatus, dispatch]);

  const SKIN_TYPES = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
  const CONCERNS = ['Acne', 'Aging', 'Dryness', 'Dark Spots', 'Redness', 'Pores', 'Fine Lines'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', category_id: '', price: '', stock_quantity: '', 
    description: '', short_description: '', brand: '', sku: '', 
    discount_price: '', skin_type: [], concerns: [], ingredients: '',
    how_to_use: '', benefits: '', status: 'active', is_featured: false,
    main_image: '', file: null, gallery_files: []
  });
  const [previewImage, setPreviewImage] = useState(null);

  const toggleArrayItem = (arrayName, item) => {
    setFormData(prev => {
      const currentArray = prev[arrayName] || [];
      if (currentArray.includes(item)) {
        return { ...prev, [arrayName]: currentArray.filter(i => i !== item) };
      } else {
        return { ...prev, [arrayName]: [...currentArray, item] };
      }
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ 
        name: product.name, 
        category_id: product.category_id?._id || product.category_id || '', 
        price: product.price, 
        stock_quantity: product.stock_quantity || product.stock || '',
        description: product.description || '',
        short_description: product.short_description || '',
        brand: product.brand || '',
        sku: product.sku || '',
        discount_price: product.discount_price || '',
        skin_type: product.skin_type || [],
        concerns: product.concerns || [],
        ingredients: product.ingredients || '',
        how_to_use: product.how_to_use || '',
        benefits: product.benefits || '',
        status: product.status || 'active',
        is_featured: product.is_featured || false,
        main_image: product.main_image || '',
        file: null,
        gallery_files: []
      });
      setPreviewImage(resolveImageUrl(product.main_image));
    } else {
      setEditingProduct(null);
      setFormData({ 
        name: '', category_id: '', price: '', stock_quantity: '', 
        description: '', short_description: '', brand: '', sku: '', 
        discount_price: '', skin_type: [], concerns: [], ingredients: '',
        how_to_use: '', benefits: '', status: 'active', is_featured: false,
        main_image: '', file: null, gallery_files: []
      });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, main_image: reader.result, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, gallery_files: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    data.append('category_id', formData.category_id);
    data.append('price', formData.price);
    data.append('stock_quantity', formData.stock_quantity);
    data.append('description', formData.description || 'No description provided.');
    data.append('short_description', formData.short_description);
    data.append('brand', formData.brand || 'Generic');
    data.append('sku', formData.sku || formData.name.toUpperCase().replace(/\s/g, '').substring(0, 8) + Date.now().toString().slice(-4));
    data.append('discount_price', formData.discount_price);
    data.append('ingredients', formData.ingredients);
    data.append('how_to_use', formData.how_to_use);
    data.append('benefits', formData.benefits);
    data.append('status', formData.status);
    data.append('is_featured', formData.is_featured);

    if (formData.skin_type && formData.skin_type.length > 0) {
      formData.skin_type.forEach(s => data.append('skin_type', s));
    }
    if (formData.concerns && formData.concerns.length > 0) {
      formData.concerns.forEach(s => data.append('concerns', s));
    }
    
    if (formData.file) {
      data.append('main_image', formData.file);
    } else if (editingProduct && formData.main_image) {
      data.append('main_image', formData.main_image);
    }

    if (formData.gallery_files && formData.gallery_files.length > 0) {
      formData.gallery_files.forEach(file => {
        data.append('gallery_images', file);
      });
    }

    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct._id, formData: data }));
    } else {
      await dispatch(createProduct(data));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="crud-page animate-fade-in">
      {!isModalOpen ? (
        <>
          <div className="page-header">
        <div className="header-text">
          <h1>Products</h1>
          <p className="text-secondary">Manage your skincare product catalog.</p>
        </div>
        <button className="primary" onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="glass-card table-section">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th>NAME</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id || product.id}>
                <td style={{ fontWeight: 700, color: 'var(--accent-pink)', textAlign: 'center' }}>
                  {index + 1}
                </td>
                <td style={{ fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {product.main_image && (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', flexShrink: 0 }}>
                        <img
                          src={resolveImageUrl(product.main_image)}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=NA'; }}
                        />
                      </div>
                    )}
                    {product.name}
                  </div>
                </td>
                <td>{product.category_id?.name || product.category || 'N/A'}</td>
                <td>${Number(product.price).toFixed(2)}</td>
                <td>{product.stock_quantity || product.stock || 0}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', background: product.status === 'active' ? 'rgba(77, 255, 148, 0.1)' : 'rgba(255, 77, 77, 0.1)', color: product.status === 'active' ? '#4dff94' : '#ff4d4d' }}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn-small" onClick={() => handleOpenModal(product)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(product._id || product.id)}>
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      ) : (
        <div className="full-page-form animate-fade-in">
          <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="header-text">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-secondary" style={{ marginTop: '8px' }}>Fill out the product details below.</p>
            </div>
            <button type="button" onClick={handleCloseModal} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.3s' }}>
              <X size={20} /> Cancel
            </button>
          </div>
          <div className="glass-card" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="form-group">
                  <label>Main Image</label>
                  <div className="image-upload-wrapper">
                    {previewImage ? (
                      <div className="image-preview-container" style={{ position: 'relative', width: '100%', maxHeight: '140px', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                        <img src={previewImage} alt="Preview" style={{ height: '140px', objectFit: 'cover' }} />
                        <button type="button" onClick={() => {setPreviewImage(null); setFormData({...formData, main_image: '', file: null})}} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,77,77,0.8)', border: 'none', color: 'white', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-placeholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '20px', border: '2px dashed var(--glass-border)', borderRadius: '12px' }}>
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                        <Upload size={24} />
                        <span>Upload Main Image</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Gallery Images (Max 10)</label>
                  <div className="image-upload-wrapper" style={{ height: previewImage ? 'auto' : '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleGalleryChange} 
                      style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                    />
                    {formData.gallery_files.length > 0 && (
                      <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--accent-pink)', textAlign: 'center' }}>
                        {formData.gallery_files.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Radiance Serum" required />
                </div>
                <div className="form-group">
                  <label>SKU (Auto-generated if empty)</label>
                  <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder="e.g. RAD-SERUM-01" />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} required style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id} style={{ color: 'black' }}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="Brand name" />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="29.99" required />
                </div>
                <div className="form-group">
                  <label>Discount Price ($)</label>
                  <input type="number" step="0.01" value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})} placeholder="19.99" />
                </div>
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} placeholder="100" required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                    <option value="active" style={{ color: 'black' }}>Active</option>
                    <option value="inactive" style={{ color: 'black' }}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} style={{ marginRight: '12px', width: '20px', height: '20px' }} />
                  Mark as Featured Product
                </label>
              </div>

              <div className="form-group">
                <label>Short Description</label>
                <textarea rows="2" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} placeholder="Brief overview..." />
              </div>

              <div className="form-group">
                <label>Full Description</label>
                <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed product description..." />
              </div>

              <div className="row">
                <div className="form-group">
                  <label>Skin Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SKIN_TYPES.map(type => (
                      <span 
                        key={type} 
                        onClick={() => toggleArrayItem('skin_type', type)}
                        style={{ 
                          padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                          background: formData.skin_type.includes(type) ? 'var(--accent-pink)' : 'rgba(255,255,255,0.05)',
                          color: formData.skin_type.includes(type) ? '#fff' : 'var(--text-secondary)',
                          border: `1px solid ${formData.skin_type.includes(type) ? 'var(--accent-pink)' : 'var(--glass-border)'}`,
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Concerns</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CONCERNS.map(concern => (
                      <span 
                        key={concern} 
                        onClick={() => toggleArrayItem('concerns', concern)}
                        style={{ 
                          padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                          background: formData.concerns.includes(concern) ? 'var(--accent-pink)' : 'rgba(255,255,255,0.05)',
                          color: formData.concerns.includes(concern) ? '#fff' : 'var(--text-secondary)',
                          border: `1px solid ${formData.concerns.includes(concern) ? 'var(--accent-pink)' : 'var(--glass-border)'}`,
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                <textarea rows="2" value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} placeholder="List of ingredients..." />
              </div>

              <div className="form-group">
                <label>How To Use</label>
                <textarea rows="2" value={formData.how_to_use} onChange={(e) => setFormData({...formData, how_to_use: e.target.value})} placeholder="Usage instructions..." />
              </div>

              <div className="form-group">
                <label>Benefits</label>
                <textarea rows="2" value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} placeholder="Product benefits..." />
              </div>



              <div className="modal-footer">
                <button type="button" className="secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .crud-page .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        
        .table-section {
          overflow-x: auto;
        }

        .action-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .icon-btn-small {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-primary);

          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-btn-small:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--accent-pink);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 77, 148, 0.2);
        }

        .delete-btn {
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.2);
          color: #ff4d4d;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .delete-btn:hover {
          background: rgba(255, 77, 77, 0.2);
          border-color: #ff4d4d;
          box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
          transform: translateY(-2px);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          padding: 40px 20px;
          overflow-y: auto;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          width: 100%;
          max-width: 800px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          margin-bottom: 40px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: var(--accent-pink);
          transform: rotate(90deg);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
          
        .image-upload-wrapper {
          border: 2px dashed var(--glass-border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
        }
      `}</style>
    </div>
  );
};

export default Products;
