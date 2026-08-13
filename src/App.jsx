import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CtaModal from './components/CtaModal';
import CookieConsent from './components/CookieConsent';
import { FALLBACK_RATES } from './utils/currency';

// Fallback default static content database
import defaultContent from '../data/content.json';

// Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import VisasPage from './pages/VisasPage';
import VisaDetail from './pages/VisaDetail';
import AboutPage from './pages/AboutPage';
import OffersPage from './pages/OffersPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import BlogDetail from './pages/BlogDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

export default function App() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(
    localStorage.getItem('skyrush_role') || ''
  );
  const [token, setToken] = useState(
    localStorage.getItem('skyrush_token') || ''
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem('skyrush_currency') || 'AED'
  );
  const isAuthenticated = !!token && token !== 'undefined' && token !== 'null' && !!userRole && userRole !== 'undefined' && userRole !== 'null';

  // Initialize rates state from cache or fallbacks
  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem('skyrush_rates');
      const cachedTime = localStorage.getItem('skyrush_rates_timestamp');
      if (cached && cachedTime) {
        const parsedRates = JSON.parse(cached);
        const age = Date.now() - parseInt(cachedTime, 10);
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;
        if (age < TWELVE_HOURS && parsedRates.USD) {
          return parsedRates;
        }
      }
    } catch (e) {
      console.error('Error reading cached rates:', e);
    }
    // Fallback static rates
    return FALLBACK_RATES;
  });

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('skyrush_currency', newCurrency);
  };

  // Fetch website configuration from CMS server
  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setContent(data);
        } else {
          console.warn('API returned non-JSON content. Using default fallback content.');
        }
      } else {
        console.error('Failed to retrieve configuration content.');
      }
    } catch (err) {
      console.error('API Connection Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Fetch exchange rates from Frankfurter API and cache for 12 hours
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cachedTime = localStorage.getItem('skyrush_rates_timestamp');
        const age = cachedTime ? Date.now() - parseInt(cachedTime, 10) : Infinity;
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (age >= TWELVE_HOURS) {
          const res = await fetch('https://api.frankfurter.app/latest?from=USD');
          if (res.ok) {
            const data = await res.json();
            if (data && data.rates) {
              const USD_AED_PEG = 3.6725;
              const convertedRates = { AED: 1.0, USD: 1 / USD_AED_PEG };
              for (const [key, value] of Object.entries(data.rates)) {
                convertedRates[key] = value / USD_AED_PEG;
              }
              setRates(convertedRates);
              localStorage.setItem('skyrush_rates', JSON.stringify(convertedRates));
              localStorage.setItem('skyrush_rates_timestamp', Date.now().toString());
              console.log('Dynamic exchange rates updated from Frankfurter API:', convertedRates);
            }
          } else {
            console.warn('Unable to reach Frankfurter API. Using default or cached rates.');
          }
        }
      } catch (err) {
        console.error('Network error fetching currency rates:', err);
      }
    };

    fetchRates();
  }, []);

  const handleLogin = (role, sessionToken) => {
    setUserRole(role);
    setToken(sessionToken);
    localStorage.setItem('skyrush_role', role);
    localStorage.setItem('skyrush_token', sessionToken);
  };

  const handleLogout = () => {
    setUserRole('');
    setToken('');
    localStorage.removeItem('skyrush_role');
    localStorage.removeItem('skyrush_token');
  };

  const handleSaveContent = (updatedContent) => {
    setContent(updatedContent);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Roboto, sans-serif',
        background: '#f8fafc',
        color: '#0f172a'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid var(--orange)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h4 style={{ marginTop: '20px', fontWeight: 600 }}>Loading Skyrush Tourism...</h4>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const contact = content.contact || {};
  const visaEnabled = content.visaEnabled !== false;

  return (
    <Router>
      <div className="site-wrapper">
        <Header 
          contact={contact} 
          isAuthenticated={isAuthenticated} 
          currency={currency} 
          onCurrencyChange={handleCurrencyChange} 
          visaEnabled={visaEnabled}
        />
        
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home content={content} currency={currency} rates={rates} />} />
            <Route path="/tours" element={<Tours content={content} currency={currency} rates={rates} />} />
            <Route path="/tours/:id" element={<TourDetail content={content} currency={currency} rates={rates} />} />
            <Route 
              path="/visa" 
              element={visaEnabled ? <VisasPage content={content} currency={currency} rates={rates} /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/visa/:id" 
              element={visaEnabled ? <VisaDetail content={content} currency={currency} rates={rates} /> : <Navigate to="/" replace />} 
            />
            <Route path="/about" element={<AboutPage content={content} />} />
            <Route path="/offers" element={<OffersPage content={content} currency={currency} rates={rates} />} />
            <Route path="/contact" element={<ContactPage content={content} />} />
            <Route path="/blogs/:id" element={<BlogDetail content={content} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy content={content} />} />
            <Route path="/terms-of-use" element={<TermsOfUse content={content} />} />
            
            {/* Secure Admin Portal Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} content={content} />} />
            <Route 
              path="/admin-portal" 
              element={
                isAuthenticated ? (
                  <AdminDashboard 
                    content={content} 
                    onSaveContent={handleSaveContent} 
                    onLogout={handleLogout}
                    userRole={userRole}
                    token={token}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            {/* Redirect old path /admin to secure path /admin-portal */}
            <Route path="/admin" element={<Navigate to="/admin-portal" replace />} />
          </Routes>
        </main>
        
        <Footer contact={contact} visaEnabled={visaEnabled} />
        
        {/* Floating WhatsApp Widget */}
        <a 
          href={`https://api.whatsapp.com/send/?phone=${(contact.whatsapp || contact.phoneCall || '+971567938033').replace(/[^\d]/g, '')}&text=${encodeURIComponent(contact.whatsappMessage || 'Hello Skyrush Tourism, I need assistance regarding my travel plans.')}&type=phone_number&app_absent=0`}
          className="floating-whatsapp" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Chat on WhatsApp"
        >
          <i className="bx bxl-whatsapp"></i>
        </a>
        
        {/* Universal Lead Capture Form Modal */}
        <CtaModal contact={contact} />

        {/* Beautiful Floating Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </Router>
  );
}
