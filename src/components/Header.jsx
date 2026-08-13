import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { SUPPORTED_CURRENCIES } from '../utils/currency';

export default function Header({ contact = {}, isAuthenticated, currency, onCurrencyChange, visaEnabled = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHomeHeaderSearch, setShowHomeHeaderSearch] = useState(false);

  const [headerSearch, setHeaderSearch] = useState('');
  const [headerType, setHeaderType] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 60) {
        setScrolled(true);
      } else if (currentScroll < 15) {
        setScrolled(false);
      }

      if (isHome) {
        // Trigger ONLY after the main in-page search card (640px) is completely scrolled out of view
        if (currentScroll > 640) {
          setShowHomeHeaderSearch(true);
        } else if (currentScroll < 480) {
          setShowHomeHeaderSearch(false);
        }
      } else {
        setShowHomeHeaderSearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (headerSearch.trim()) params.append('search', headerSearch.trim());
    if (headerType) params.append('type', headerType);
    const queryString = params.toString();
    navigate(`/tours${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${showHomeHeaderSearch ? 'has-home-search' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img 
              src="https://skyrushtourism.com/wp-content/uploads/2026/05/skyrush-removebg-preview.png" 
              alt="Skyrush Tourism" 
              width="180"
              className="logo-img" 
            />
          </Link>
          
          {/* Animated Glassmorphic Header Search Bar for Home Page on Scroll */}
          {isHome && showHomeHeaderSearch && (
            <form className="header-home-search-bar" onSubmit={handleHeaderSearchSubmit}>
              <div className="header-search-input-wrap">
                <i className="bx bx-map-pin"></i>
                <input 
                  type="text" 
                  placeholder="Where to? (Almaty, Yerevan...)" 
                  value={headerSearch} 
                  onChange={(e) => setHeaderSearch(e.target.value)}
                />
              </div>
              <div className="header-search-select-wrap">
                <i className="bx bx-compass"></i>
                <select value={headerType} onChange={(e) => setHeaderType(e.target.value)}>
                  <option value="">All Types</option>
                  <option value="Family">Family</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Honeymoon">Honeymoon</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>
              <button type="submit" className="header-search-btn">
                <i className="bx bx-search-alt-2"></i>
                <span className="search-btn-text">SEARCH</span>
              </button>
            </form>
          )}

          {/* Scrolled-only Offers Tab */}
          {isHome && showHomeHeaderSearch && (
            <NavLink to="/offers" className="scrolled-offers-tab" onClick={() => setMenuOpen(false)}>
              <i className="bx bx-gift nav-icon"></i>
              <span>Offers</span>
              <span className="offers-badge">New</span>
            </NavLink>
          )}

          {/* Navigation Bar & Mobile Drawer */}
          <nav className={`main-nav ${menuOpen ? 'show' : ''} ${isHome && showHomeHeaderSearch ? 'hide-desktop-inline' : ''}`}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button 
                type="button" 
                className="mobile-nav-close" 
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            <NavLink to="/" end className="nav-link" onClick={() => setMenuOpen(false)}>
              <i className="bx bx-home-alt nav-icon"></i>
              <span>Home</span>
            </NavLink>
            <NavLink to="/tours" className="nav-link" onClick={() => setMenuOpen(false)}>
              <i className="bx bx-compass nav-icon"></i>
              <span>Tours</span>
            </NavLink>
            {visaEnabled && (
              <NavLink to="/visa" className="nav-link" onClick={() => setMenuOpen(false)}>
                <i className="bx bx-id-card nav-icon"></i>
                <span>Visa Services</span>
              </NavLink>
            )}
            <NavLink to="/offers" className="nav-link offers-tab" onClick={() => setMenuOpen(false)}>
              <i className="bx bx-gift nav-icon"></i>
              <span>Offers</span>
              <span className="offers-badge">New</span>
            </NavLink>
            <NavLink to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
              <i className="bx bx-envelope nav-icon"></i>
              <span>Contact Us</span>
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/admin-portal" className="nav-link portal-link" onClick={() => setMenuOpen(false)}>
                <i className="bx bx-shield-quarter nav-icon"></i>
                <span>Portal</span>
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            {/* Hamburger button placed BEFORE currency selector */}
            <button 
              className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
              type="button" 
              aria-label="Toggle Navigation Menu" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <i className={menuOpen ? "bx bx-x" : "bx bx-menu"}></i>
            </button>

            <div className="currency-selector-wrapper">
              <i className="bx bx-globe currency-globe-icon"></i>
              <select 
                value={currency} 
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="currency-select-dropdown"
                aria-label="Select Currency"
              >
                {SUPPORTED_CURRENCIES.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.code} ({cur.symbol})
                  </option>
                ))}
              </select>
              <span className="currency-select-arrow">
                <i className="bx bx-chevron-down"></i>
              </span>
            </div>
            
            <a href={`tel:${contact.phoneCall || '+971567938033'}`} className="header-phone-btn">
              <i className="bx bx-phone-call phone-icon-animated"></i>
              <span className="phone-desktop">{contact.phone || '+971 56 793 8033'}</span>
              <span className="phone-mobile">Call</span>
            </a>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div className="nav-backdrop show" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}

