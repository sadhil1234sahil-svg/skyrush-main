import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

export default function Visas({ visas = [], showViewAll = true, currency, rates }) {
  if (visas.length === 0) return null;

  return (
    <section className="section-padding" style={{ paddingTop: showViewAll ? '80px' : '0' }}>
      <div className="container">
        {showViewAll && (
          <div className="section-title-wrap">
            <span className="eg-tag">Certified Documentation Advisory</span>
            <h2>Global Visa Packages</h2>
          </div>
        )}
        
        {showViewAll && (
          <div className="text-center mb-40">
            <Link to="/visa" className="outline-btn">
              View All Visa Packages
            </Link>
          </div>
        )}

        <div className="packages-grid">
          {visas.map((visa) => (
            <article className="package-card" key={visa.id}>
              {/* Card Image Cover & Top Badges */}
              <div className="package-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={visa.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"} 
                  alt={visa.title} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />

                {/* Top Glassmorphic Badges */}
                <div className="card-top-badges">
                  {visa.processingTime && (
                    <span className="card-badge tour-type-pill" style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#ffffff' }}>
                      <i className="bx bx-bolt-circle"></i> {visa.processingTime}
                    </span>
                  )}
                  {visa.stay && (
                    <span className="card-badge hotel-cat-pill">
                      <i className="bx bx-calendar"></i> {visa.stay}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="package-card-body" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '8px' }}>
                  <i className="bx bx-map" style={{ color: 'var(--orange)' }}></i>
                  <span>{visa.countryTo || visa.country}</span>
                  <span>•</span>
                  <span>{visa.type || 'E-Visa'}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.3 }}>
                  <Link to={`/visa/${visa.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {visa.title}
                  </Link>
                </h3>

                {/* Key Tags Row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    <i className="bx bx-check" style={{ color: '#10b981', marginRight: '3px' }}></i> Document Audit
                  </span>
                  <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    <i className="bx bx-check" style={{ color: '#10b981', marginRight: '3px' }}></i> Embassy Submission
                  </span>
                </div>

                {/* Footer Price & Button */}
                <div className="package-card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Consultation From</span>
                    {visa.offerPrice && String(visa.offerPrice).trim() !== '' ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--orange)' }}>
                          {formatPrice(visa.offerPrice, currency, rates)}
                        </span>
                        <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>
                          {formatPrice(visa.price, currency, rates)}
                        </span>
                        <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '8px', fontWeight: 700, padding: '1px 4px', borderRadius: '3px', lineHeight: 1 }}>
                          {calculateDiscountPercentage(visa.price, visa.offerPrice)}% OFF
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--orange)' }}>{formatPrice(visa.price, currency, rates)}</span>
                    )}
                  </div>
                  <Link 
                    to={`/visa/${visa.id}`} 
                    className="primary-btn1"
                    style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '20px' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

