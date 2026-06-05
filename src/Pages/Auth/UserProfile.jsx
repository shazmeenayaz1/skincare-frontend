import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { User, Mail, Lock, Phone, Camera, Save, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUrl';
import './Auth.css';

const UserProfile = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        image: null
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            image: null
        });
    }, [user, navigate]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
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
            setProfileLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }
        setPasswordLoading(true);
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
            setPasswordLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="auth-page" style={{ flexDirection: 'column', gap: '2rem', padding: '4rem 1.5rem' }}>
            <div className="auth-header" style={{ marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.25rem' }}>Profile Settings</h1>
                <p>Manage your account settings and update password</p>
            </div>

            {message.text && (
                <div 
                    className={message.type === 'success' ? 'auth-success' : 'auth-error'} 
                    style={{ maxWidth: '900px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    {message.type === 'success' && <CheckCircle2 size={18} />}
                    {message.text}
                </div>
            )}

            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '2rem', 
                justifyContent: 'center', 
                width: '100%', 
                maxWidth: '900px' 
            }}>
                {/* Profile Form */}
                <div className="auth-card" style={{ flex: '1 1 400px', maxWidth: '440px' }}>
                    <div className="auth-header">
                        <h2>Personal Information</h2>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="auth-form">
                        {user.image && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                                <img 
                                    src={resolveImageUrl(user.image)} 
                                    alt={user.name} 
                                    style={{ 
                                        width: '90px', 
                                        height: '90px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover', 
                                        border: '3px solid var(--store-primary)',
                                    }} 
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--store-text-muted)', marginTop: '6px' }}>Current Avatar</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address (Read-Only)</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#f9f9f9' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Update Avatar</label>
                            <div className="input-with-icon">
                                <Camera size={18} className="input-icon" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                    style={{ paddingLeft: '42px', paddingTop: '10px' }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={profileLoading}>
                            {profileLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} style={{ marginRight: '8px' }} /> Save Changes</>}
                        </button>
                    </form>
                </div>

                {/* Password Form */}
                <div className="auth-card" style={{ flex: '1 1 400px', maxWidth: '440px' }}>
                    <div className="auth-header">
                        <h2>Change Password</h2>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Current Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={passwordLoading}>
                            {passwordLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} style={{ marginRight: '8px' }} /> Update Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
