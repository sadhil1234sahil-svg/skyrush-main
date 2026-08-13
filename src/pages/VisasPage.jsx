import React, { useState } from 'react';
import Visas from '../components/Visas';
import useSEO from '../hooks/useSEO';

export default function VisasPage({ content = {}, currency, rates }) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const visas = content.visas || [];

  useSEO({
    title: 'Global Visa Consultancy & UAE Tourist Visa Consulting | Skyrush Tourism',
    description: 'Expert global visa consultancy and documentation support services. Skyrush Tourism is a private travel advisory firm in Dubai (not a government agency). We assist with documents, applications, and consulting.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Global & UAE Travel Visa Consultancy Services',
      'description': 'Private travel consultancy providing visa advising, documentation preparation, and appointment booking support. Skyrush Tourism is not affiliated with any government agency or embassy.',
      'provider': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'description': 'Skyrush Tourism is a private travel consultancy and tour agency based in Dubai.'
      },
      'serviceType': 'Travel Visa Consultancy',
      'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'AED',
        'lowPrice': '450'
      }
    }
  });

  const regionOptions = [
    { label: 'All Regions', value: 'All', icon: 'bx-globe' },
    { label: 'UAE & GCC', value: 'UAE & GCC', icon: 'bx-building-house' },
    { label: 'Schengen Europe', value: 'Schengen', icon: 'bx-map-pin' },
    { label: 'Asia & Far East', value: 'Asia & Far East', icon: 'bx-landscape' },
    { label: 'Americas & UK', value: 'Americas & UK', icon: 'bx-world' }
  ];

  const filteredVisas = visas.filter((visa) => {
    const matchesSearch = search === '' || 
      visa.title.toLowerCase().includes(search.toLowerCase()) ||
      visa.country.toLowerCase().includes(search.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || 
      (visa.region && visa.region === selectedRegion) ||
      (selectedRegion === 'Schengen' && (visa.country.includes('Schengen') || visa.region === 'Schengen'));

    return matchesSearch && matchesRegion;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedRegion('All');
  };

  return (
    <div className="visas-main-page">
      <div className="page-header visas-hero-header">
        <div className="container">
          <span className="eg-tag animate-tag">🛡️ Certified Documentation Advisory</span>
          <h1>Visa Consultancy Services</h1>
          <p>Expert consulting for UAE, Schengen, UK, US, and global visa applications with 99%+ approval record.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
        
        {/* Government Agency Disclaimer Card */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderLeft: '5px solid #d97706',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '35px',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.05)',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            background: '#fef3c7',
            borderRadius: '50%',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706',
            flexShrink: 0
          }}>
            <i className="bx bx-info-circle" style={{ fontSize: '22px' }}></i>
          </div>
          <div>
            <h5 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#92400e', fontFamily: 'Poppins, sans-serif' }}>
              Important Consultation Notice
            </h5>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#b45309', fontFamily: 'Roboto, sans-serif' }}>
              <strong>Skyrush Tourism</strong> is an independent private visa consultancy and document advisory firm in Dubai. We are <strong>not</strong> a government agency, embassy, or official immigration department. Final decisions on visa approvals rest solely with official sovereign immigration authorities.
            </p>
          </div>
        </div>

        {/* Modern Interactive Filter Bar */}
        <div className="tours-filter-card" style={{ marginBottom: '40px' }}>
          <div className="filter-card-header">
            <div className="search-input-wrapper">
              <i className="bx bx-search search-icon"></i>
              <input 
                type="text" 
                className="tours-search-input" 
                placeholder="Search visa package by country, city, or visa type..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              {search && (
                <button type="button" className="clear-search-btn" onClick={() => setSearch('')}>
                  <i className="bx bx-x"></i>
                </button>
              )}
            </div>

            <div className="filter-header-actions">
              <span className="results-count-badge">
                <i className="bx bx-badge-check"></i> {filteredVisas.length} Packages Available
              </span>
              {(search || selectedRegion !== 'All') && (
                <button type="button" className="reset-filters-btn" onClick={resetFilters}>
                  <i className="bx bx-refresh"></i> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Region Chips */}
          <div className="tour-chips-wrapper">
            <span className="chips-label">Destination Region:</span>
            <div className="tour-type-chips">
              {regionOptions.map((opt) => (
                <button 
                  key={opt.value}
                  type="button" 
                  className={`chip-btn ${selectedRegion === opt.value ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(opt.value)}
                >
                  <i className={`bx ${opt.icon}`}></i>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visa Directory Cards */}
        {filteredVisas.length > 0 ? (
          <Visas visas={filteredVisas} showViewAll={false} currency={currency} rates={rates} />
        ) : (
          <div className="no-tours-found">
            <i className="bx bx-search-alt"></i>
            <h3>No Visa Packages Found</h3>
            <p>Try resetting your search filters or region selection to view all available options.</p>
            <button type="button" className="reset-filters-btn" onClick={resetFilters} style={{ marginTop: '16px' }}>
              <i className="bx bx-refresh"></i> Reset All Filters
            </button>
          </div>
        )}

        {/* Visa FAQ / Requirements Block */}
        <section className="tour-section-block" style={{ marginTop: '60px' }}>
          <div className="section-block-title" style={{ justifyContent: 'center' }}>
            <i className="bx bx-certification"></i>
            <h2>General Visa Application Requirements</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px', marginTop: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--orange)', marginBottom: '10px' }}>1. Passport Validity</h5>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Your original passport must have at least 6 months validity remaining from your intended date of entry with minimum 2 blank pages.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--orange)', marginBottom: '10px' }}>2. Photographs Compliance</h5>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Two recent high-resolution passport-sized photos with plain white background, adhering to specific embassy size requirements.
              </p>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--orange)', marginBottom: '10px' }}>3. Proof of Finance &amp; Ties</h5>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                Recent stamped bank statement demonstrating adequate funds alongside an employer NOC or trade license proof.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

