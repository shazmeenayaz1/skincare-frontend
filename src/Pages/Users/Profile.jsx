import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { User, Mail, Shield, Save, Loader2, CheckCircle2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const data = await api('/users/profile', {
                method: 'PUT',
                body: formData,
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
                            <label>Email Address</label>
                            <div className="input-group">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
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
