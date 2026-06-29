import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import GoogleSignIn from '../../Components/GoogleSignIn';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api('/auth/login', {
                method: 'POST',
                body: formData,
            });
            login(data.user, data.token);
        } catch (err) {
            setError(err.message);
            if (err.message.toLowerCase().includes('verify') || err.message.toLowerCase().includes('verification')) {
                setTimeout(() => {
                    navigate('/verify', { state: { email: formData.email } });
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <LogIn size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error animate-shake">{error}</div>}
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="label-row">
                            <label>Password</label>
                            <Link to="/forgot-password" title="Recover Password">Forgot password?</Link>
                        </div>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <GoogleSignIn onError={setError} setLoading={setLoading} />

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create one now</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
