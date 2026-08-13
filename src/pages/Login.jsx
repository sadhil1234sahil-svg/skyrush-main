import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

export default function Login({ onLogin, content }) {
  useSEO({
    title: 'Admin Login | Skyrush Tourism',
    description: 'Secure authentication gateway for administrative portal access to Skyrush Tourism CMS.'
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      "Password Reset Instructions:\n\n" +
      "To enable automatic password resets, a transactional email service (like SMTP, SendGrid, or Amazon SES) and an 'email' field in user accounts are required.\n\n" +
      "For now, please contact a Master Admin (super_admin) to update or reset your password in the User Management dashboard, or manually update the password entry in content.json."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.token && data.role) {
        onLogin(data.role, data.token);
        navigate('/admin-portal');
      } else {
        setError(data.error || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Please verify that the server is running.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      background: '#f8fafc',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <div className="login-card" style={{
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="https://skyrushtourism.com/wp-content/uploads/2026/05/skyrush-removebg-preview.png" 
            alt="Skyrush Logo" 
            style={{ width: '150px', margin: '0 auto 15px', display: 'block' }}
          />
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Admin Portal Access</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Please login to manage site content</p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #fca5a5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>
              Username
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--orange)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="contact-form-submit"
            style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
