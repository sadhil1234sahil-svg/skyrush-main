import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ contact = {}, visaEnabled = true }) {
  const handleCtaClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('open-cta-modal', { detail: { title: 'Book A Tour' } })
    );
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img 
              src="/logo.png" 
              alt="Skyrush Tourism" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{ display: 'none', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '20px', color: 'var(--white)', marginBottom: '15px' }}>
              <span>SKY</span><span style={{ color: 'var(--orange)' }}>RUSH</span>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', marginLeft: '2px', opacity: 0.8 }}>TOURISM</span>
            </div>
            <p>Want to book a tour package?</p>
            <a href="#" className="primary-btn1" onClick={handleCtaClick}>
              Book A Tour
            </a>
          </div>
          
          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/tours">Tours</Link></li>
              {visaEnabled && <li><Link to="/visa">Visa Consultancy Services</Link></li>}
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h5>More Inquiry</h5>
            <ul>
              <li>
                <a href={`tel:${contact.phoneCall || '+971567938033'}`}>
                  {contact.phone || '+971 56 793 8033'}
                </a>
              </li>
            </ul>
            <h5 style={{ marginTop: '24px' }}>Send Mail</h5>
            <ul>
              <li>
                <a href={`mailto:${contact.email || 'Info@skyrushtourism.com'}`}>
                  {contact.email || 'Info@skyrushtourism.com'}
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h5>Office Address</h5>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {contact.address || 'B2B Office Tower - Office # 910 مراسي درايف - near Kana Cafe - الخليج التجاري - دبي'}
            </p>
          </div>
        </div>
        
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
            <p>© {new Date().getFullYear()} Skyrush Tourism. All Rights Reserved.</p>
            <div className="footer-links">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-of-use">Terms of Use</Link>
            </div>
          </div>
          <p className="currency-disclaimer" style={{ 
            fontSize: '11px', 
            color: 'rgba(255, 255, 255, 0.45)', 
            lineHeight: '1.6', 
            textAlign: 'center', 
            maxWidth: '900px', 
            margin: '5px 0 0 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '12px',
            width: '100%'
          }}>
            Disclaimer: Currency conversions are powered by Frankfurter API. We have no role to play in the rates. These rates are for estimation purposes only and may fluctuate. Skyrush Tourism holds no responsibility or liability for discrepancies in actual credit card or bank settlement rates.
          </p>
          {visaEnabled && (
            <p className="agency-disclaimer" style={{ 
              fontSize: '11px', 
              color: 'rgba(255, 255, 255, 0.45)', 
              lineHeight: '1.6', 
              textAlign: 'center', 
              maxWidth: '900px', 
              margin: '8px 0 0 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '8px',
              width: '100%'
            }}>
              <strong>Visa Consultancy Disclaimer:</strong> Skyrush Tourism is a private travel consultancy and is not affiliated with any government agency, embassy, or official immigration authority. We provide travel consultancy, documentation support, and visa filing assistance. Final approval or rejection of all visas rests solely with the immigration authorities of the respective countries.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
