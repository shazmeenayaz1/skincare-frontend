import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash, X, Shield, Mail, Loader2, Phone, Key } from 'lucide-react';
import api from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    role: 'Viewer', 
    status: 'Active' 
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api('/users');
      setUsers(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setSubmitError('');
    if (user) {
      setEditingUser(user);
      // Map urole to Admin/Viewer
      const displayRole = user.urole === 'admin' ? 'Admin' : 'Viewer';
      // Map verifystatus to Active/Inactive
      const displayStatus = user.verifystatus ? 'Active' : 'Inactive';
      
      setFormData({ 
        name: user.name || '', 
        email: user.email || '', 
        phone: user.phone || '', 
        password: '', // Leave blank for edit unless they want to set new password
        role: displayRole, 
        status: displayStatus 
      });
    } else {
      setEditingUser(null);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        password: '', 
        role: 'Viewer', 
        status: 'Active' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    try {
      if (editingUser) {
        // Update user
        await api(`/users/${editingUser._id}`, {
          method: 'PUT',
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status
          }
        });
      } else {
        // Create user
        await api('/users', {
          method: 'POST',
          body: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password || 'password123',
            role: formData.role,
            status: formData.status
          }
        });
      }
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      setSubmitError(err.message || 'Failed to save user');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api(`/users/${id}`, {
          method: 'DELETE'
        });
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="crud-page animate-fade-in">
      <div className="page-header">
        <div className="header-text">
          <h1>Users</h1>
          <p className="text-secondary">Manage administrative access and permissions.</p>
        </div>
        <button className="primary" style={{ backgroundColor: 'var(--accent-purple)' }} onClick={() => handleOpenModal()}>
          <Plus size={20} /> Add User
        </button>
      </div>

      {error && <div className="profile-alert error" style={{ marginBottom: 20 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-purple)' }} />
        </div>
      ) : (
        <div className="glass-card table-section">
          <table>
            <thead>
              <tr>
                <th>USER</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-td">
                      <div className="avatar-small">
                        {user.image ? (
                          <img src={resolveImageUrl(user.image)} alt={user.name} />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--accent-purple)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-details">
                        <span className="user-name-cell">{user.name}</span>
                        <span className="user-email-cell">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="role-badge">
                      <Shield size={12} /> {user.urole === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-dot ${user.verifystatus ? 'active' : 'inactive'}`}></span>
                    {user.verifystatus ? 'Verified' : 'Unverified'}
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn-small" onClick={() => handleOpenModal(user)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(user._id)}>
                        <Trash size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card animate-fade-in">
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            {submitError && (
              <div className="profile-alert error" style={{ marginBottom: 16 }}>{submitError}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="john@example.com"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    placeholder="+1 (555) 000-0000"
                    style={{ paddingLeft: '36px' }}
                    required 
                  />
                </div>
              </div>
              
              {!editingUser && (
                <div className="form-group">
                  <label>Password (Temporary)</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Key size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="password" 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      placeholder="Password (default: password123)"
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>
              )}

              <div className="row">
                <div className="form-group">
                  <label>Role</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Viewer">User</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Verified</option>
                    <option value="Inactive">Unverified</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="primary" style={{ backgroundColor: 'var(--accent-purple)' }} disabled={submitLoading}>
                  {submitLoading ? <Loader2 className="animate-spin" size={18} /> : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .user-td {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          overflow: hidden;
          background: #2d2d30;
        }

        .avatar-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name-cell {
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-email-cell {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
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
          border-color: var(--accent-purple);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
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
          overflow-y: auto;
        }

        .modal-content {
          width: 100%;
          max-width: 500px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .modal-content input, .modal-content select {
          width: 100%;
          padding: 12px 14px;
          background: var(--sidebar-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
        }

        .modal-content input:focus, .modal-content select:focus {
          border-color: var(--accent-purple);
          background: var(--card-bg);
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
          border-color: var(--accent-purple);
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
          gap: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
        }

        .status-dot.active { background: var(--accent-green); box-shadow: 0 0 8px var(--accent-green); }
        .status-dot.inactive { background: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default Users;
