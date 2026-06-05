import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { User, Mail, Shield, Save, Loader2, CheckCircle2, Phone, Camera } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl';
import './Profile.css';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '', image: null });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                image: null
            });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const body = new FormData();
            body.append('name', formData.name);
            body.append('phone', formData.phone);
            if (formData.image) {
                body.append('image', formData.image);
            }

            const data = await api('/users/profile', {
                method: 'PUT',
                body: body,
            });
            setUser(data.data);
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'New passwords do not match' });
        }
        setPassLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await api('/users/updatepassword', {
                method: 'PUT',
                body: {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                },
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="profile-page animate-fade-in">
            <div className="profile-header">
                <h1>Account Settings</h1>
                <p>Manage your account information and security</p>
            </div>

            {message.text && (
                <div className={`profile-alert ${message.type}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : null}
                    {message.text}
                </div>
            )}

            <div className="profile-grid">
                <div className="profile-card">
                    <h2>Personal Information</h2>
                    <form onSubmit={handleProfileSubmit}>
                        {user && user.image && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                                <img 
                                    src={resolveImageUrl(user.image)} 
                                    alt={user.name} 
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover', 
                                        border: '3px solid var(--store-primary)',
                                        boxShadow: 'var(--store-shadow)'
                                    }} 
                                />
                                <span style={{ fontSize: '0.85rem', color: 'var(--store-text-muted)', marginTop: '8px' }}>Current Profile Photo</span>
                            </div>
                        )}
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-group">
                                <User size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Address (Cannot be updated)</label>
                            <div className="input-group">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={user ? user.email : ''}
                                    disabled
                                    style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'rgba(0,0,0,0.05)' }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-group">
                                <Phone size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Update Profile Photo</label>
                            <div className="input-group">
                                <Camera size={18} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    style={{ paddingTop: '10px' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </form>
                </div>

                <div className="profile-card">
                    <h2>Security</h2>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <div className="input-group">
                                <Shield size={18} />
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-group">
                                <Shield size={18} />
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <div className="input-group">
                                <Shield size={18} />
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="save-btn" disabled={passLoading}>
                            {passLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
