import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../features/categorySlice';
import { resolveImageUrl } from '../../utils/imageUrl';

const Categories = () => {
  const dispatch = useDispatch();
  const { items: categories, status } = useSelector((state) => state.categories);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name || '', 
        description: category.description || '', 
        image: null 
      });
      setImagePreview(resolveImageUrl(category.image) || null);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: null });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (editingCategory) {
      const id = editingCategory._id || editingCategory.id;
      await dispatch(updateCategory({ id, categoryData: data }));
    } else {
      await dispatch(createCategory(data));
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="crud-page animate-fade-in">
      <div className="page-header">
        <div className="header-text">
          <h1>Categories</h1>
          <p className="text-secondary">Organize your products into logical groups.</p>
        </div>
        <button className="primary" style={{ backgroundColor: 'var(--accent-cyan)' }} onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="glass-card table-section">
        <table>
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
              <th>DESCRIPTION</th>
              <th>PRODUCTS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id || category.id}>
                  <td>
                    <div className="table-img-container">
                      <img
                        src={resolveImageUrl(category.image) || 'https://via.placeholder.com/40'}
                        alt={category.name || 'Category'}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{category.name || 'Unnamed'}</td>
                  <td className="text-secondary">{category.description || 'No description'}</td>
                  <td>{category.count || 0} items</td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn-small" onClick={() => handleOpenModal(category)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(category._id || category.id)}>
                        <Trash size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }} className="text-secondary">
                  No categories found. Click "Add Category" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content glass-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-left">
                  <div className="form-group">
                    <label>Category Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="e.g. Moisturizers"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      rows="3"
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      placeholder="Tell us about this category..."
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-right">
                  <div className="image-upload-section">
                    <label>Category Image</label>
                    <div className="image-preview-box" onClick={() => document.getElementById('category-image').click()}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        <div className="upload-placeholder">
                          <Plus size={32} />
                          <span>Upload Image</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        id="category-image" 
                        hidden 
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary" style={{ backgroundColor: 'var(--accent-cyan)' }}>
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
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
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(77, 243, 255, 0.2);
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
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          width: 100%;
          max-width: 800px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
          border-color: var(--accent-cyan);
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

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
        }

        .table-img-container {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
        }

        .table-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 32px;
        }

        .image-upload-section {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .image-preview-box {
          flex: 1;
          min-height: 180px;
          background: rgba(255, 255, 255, 0.03);
          border: 2px dashed var(--glass-border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s;
          position: relative;
        }

        .image-preview-box:hover {
          border-color: var(--accent-cyan);
          background: rgba(77, 243, 255, 0.05);
        }

        .image-preview-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;
