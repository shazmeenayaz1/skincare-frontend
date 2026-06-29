import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash, X, Upload, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners, createBanner, updateBanner, deleteBanner, resetBannerStatus } from '../../features/bannerSlice';
import { resolveImageUrl } from '../../utils/imageUrl';

const Banners = () => {
  const dispatch = useDispatch();
  const { items: banners, status, actionStatus, actionError } = useSelector((state) => state.banners);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBanners());
    }
  }, [status, dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: '', file: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [formError, setFormError] = useState('');

  const handleOpenModal = (banner = null) => {
    setFormError('');
    if (banner) {
      setEditingBanner(banner);
      setFormData({ title: banner.title, description: banner.description, image: banner.image, file: null });
      setPreviewImage(resolveImageUrl(banner.image));
    } else {
      setEditingBanner(null);
      setFormData({ title: '', description: '', image: '', file: null });
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setFormError('');
    dispatch(resetBannerStatus());
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, image: reader.result, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate image for new banners
    if (!editingBanner && !formData.file) {
      setFormError('Please upload a banner image.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.file) {
      data.append('image', formData.file);
    } else if (editingBanner && formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingBanner) {
        const result = await dispatch(updateBanner({ id: editingBanner._id, formData: data })).unwrap();
        if (result) {
          handleCloseModal();
          // Re-fetch to ensure fresh data
          dispatch(fetchBanners());
        }
      } else {
        const result = await dispatch(createBanner(data)).unwrap();
        if (result) {
          handleCloseModal();
          // Re-fetch to ensure fresh data
          dispatch(fetchBanners());
        }
      }
    } catch (err) {
      setFormError(err || 'Something went wrong. Please try again.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      dispatch(deleteBanner(id));
    }
  };

  return (
    <div className="crud-page animate-fade-in">
      <div className="page-header">
        <div className="header-text">
          <h1>Banners</h1>
          <p className="text-secondary">Manage the promotional banners displayed on your homepage.</p>
        </div>
        <button className="primary" style={{ backgroundColor: 'var(--accent-purple, #a855f7)' }} onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add Banner
        </button>
      </div>

      {actionError && !isModalOpen && (
        <div className="profile-alert error" style={{ marginBottom: 20 }}>{actionError}</div>
      )}

      <div className="glass-card table-section">
        <table>
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>DESCRIPTION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id || banner.id}>
                <td>
                  <div className="banner-preview-small">
                    <img
                      src={resolveImageUrl(banner.image)}
                      alt={banner.title}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Banner'; }}
                    />
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{banner.title}</td>
                <td className="text-secondary banner-desc-cell">{banner.description}</td>
                <td>
                  <div className="action-btns">
                    <button className="icon-btn-small edit-banner-btn" onClick={() => handleOpenModal(banner)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(banner._id || banner.id)}>
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in">
            <div className="modal-header">
              <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>

            {formError && (
              <div className="profile-alert error" style={{ marginBottom: 16 }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Banner Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. New Season Sale"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Promotional text for the banner..."
                  required 
                />
              </div>
              <div className="form-group">
                <label>Banner Image</label>
                <div className="image-upload-wrapper">
                  {previewImage ? (
                    <div className="image-preview-container">
                      <img src={previewImage} alt="Preview" />
                      <button type="button" className="remove-img" onClick={() => {setPreviewImage(null); setFormData({...formData, image: '', file: null})}}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                      <Upload size={24} />
                      <span>Upload Banner Image</span>
                    </label>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary" style={{ backgroundColor: 'var(--accent-purple, #a855f7)' }} disabled={actionStatus === 'loading'}>
                  {actionStatus === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .banner-preview-small {
          width: 120px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }
        
        .banner-preview-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .banner-desc-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .image-upload-wrapper {
          border: 2px dashed var(--glass-border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .upload-placeholder:hover {
          color: white;
        }

        .image-preview-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          max-height: 140px;
          border-radius: 8px;
          overflow: hidden;
          margin: 0 auto;
        }

        .image-preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-img {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 77, 77, 0.8);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .edit-banner-btn:hover {
            border-color: var(--accent-purple, #a855f7) !important;
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2) !important;
        }

        /* Reusing common CRUD styles if not globally available */
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
          padding: 80px 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 20px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }



        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          font-size: 1.2rem;
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

        .form-group {
          margin-bottom: 12px;
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
          gap: 12px;
          margin-top: 20px;
        }

        .profile-alert.error {
          background: rgba(255, 77, 77, 0.1);
          border: 1px solid rgba(255, 77, 77, 0.3);
          color: #ff4d4d;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
        }

      `}</style>
    </div>
  );
};

export default Banners;
