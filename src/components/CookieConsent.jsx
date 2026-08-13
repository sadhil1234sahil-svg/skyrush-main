import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('skyrush_cookie_consent');
    if (!consent) {
      // Show banner after a slight delay to allow smooth loading
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('skyrush_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('skyrush_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 9999,
      maxWidth: '420px',
      background: 'rgba(26, 45, 77, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
      color: '#ffffff',
      fontFamily: 'var(--font-body)',
      animation: 'slideUp 0.5s ease-out forwards'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
        <i className="bx bx-cookie" style={{ fontSize: '32px', color: 'var(--orange)', marginTop: '2px' }}></i>
        <div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>Cookie Preference</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
            We use cookies to optimize your browsing experience, remember your currency preferences, and analyze our traffic. Please choose your preference below.
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          onClick={handleDecline}
          style={{
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          Decline
        </button>
        <button 
          onClick={handleAccept}
          style={{
            background: 'var(--orange)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 10px rgba(240, 90, 36, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.background = 'var(--orange-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'none';
            e.target.style.background = 'var(--orange)';
          }}
        >
          Accept All
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 576px) {
          div[style*="bottom: 30px"] {
            bottom: 20px !important;
            right: 20px !important;
            left: 20px !important;
            max-width: calc(100% - 40px) !important;
          }
        }
      `}</style>
    </div>
  );
}
