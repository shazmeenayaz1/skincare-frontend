import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Mail, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import './Auth.css';

const VerifyUser = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Pre-fill email if passed from Registration page state
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api('/auth/verify-user', {
                method: 'POST',
                body: { email, code },
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card animate-fade-in">
                    <div className="auth-header">
                        <div className="auth-logo success">
                            <ShieldCheck size={32} />
                        </div>
                        <h1>Verified!</h1>
                        <p>Your email has been successfully verified. Redirecting you to sign in...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Verify Email</h1>
                    <p>Enter the 6-digit verification code sent to your email</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error animate-shake">{error}</div>}

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Verification Code</label>
                        <div className="input-with-icon">
                            <ShieldCheck size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="123456"
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="otp-input"
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Verify Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="back-link">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyUser;
