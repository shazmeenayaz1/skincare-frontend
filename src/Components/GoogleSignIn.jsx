import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const GoogleSignIn = ({ onError, setLoading }) => {
  const { login } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      onError('Google sign in failed. Please try again.');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const data = await api('/auth/google', {
        method: 'POST',
        body: { credential: credentialResponse.credential },
      });
      login(data.user, data.token);
    } catch (err) {
      onError(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <div className="google-btn-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError('Google sign in was cancelled or failed.')}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={380}
        />
      </div>
    </>
  );
};

export default GoogleSignIn;
