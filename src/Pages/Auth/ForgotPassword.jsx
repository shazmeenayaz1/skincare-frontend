import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Mail, Loader2, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Code
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const data = await api('/auth/forgot-password', {
                method: 'POST',
                body: { email },
            });
            setMessage(data.message || 'Verification code sent to your email');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            await api('/auth/verify-code', {
                method: 'POST',
                body: { email, code },
            });
            // Redirect to reset password with email and code in state
            navigate('/reset-password', { state: { email, code } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        {step === 1 ? <KeyRound size={32} /> : <ShieldCheck size={32} />}
                    </div>
                    <h1>{step === 1 ? 'Reset Password' : 'Verify Code'}</h1>
                    <p>
                        {step === 1 
                            ? "Enter your email and we'll send you a verification code" 
                            : `We've sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendCode} className="auth-form">
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

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="auth-form">
                        {message && <div className="auth-success">{message}</div>}
                        {error && <div className="auth-error animate-shake">{error}</div>}
                        
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
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                        </button>

                        <button 
                            type="button" 
                            className="text-btn" 
                            onClick={() => setStep(1)}
                            disabled={loading}
                        >
                            Change Email
                        </button>
                    </form>
                )}

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

export default ForgotPassword;
