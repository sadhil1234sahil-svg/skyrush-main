import React from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

export default function AboutPage({ content = {} }) {
  const visaEnabled = content.visaEnabled !== false;

  useSEO({
    title: visaEnabled
      ? 'About Skyrush Tourism Dubai | Premium Travel & Visa Advisory'
      : 'About Skyrush Tourism Dubai | Premium Travel Advisory',
    description: visaEnabled
      ? 'Learn about Skyrush Tourism. Read about our core pillars of excellence, integrity-first principles, global operator networks, and bespoke holiday & visa services.'
      : 'Learn about Skyrush Tourism. Read about our core pillars of excellence, integrity-first principles, global operator networks, and bespoke holiday services.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About Skyrush Tourism',
      'description': visaEnabled
        ? 'Leading private travel consultancy and tour agency in Dubai offering fixed departure packages, custom itineraries, and visa document advisory services.'
        : 'Leading private travel consultancy and tour agency in Dubai offering fixed departure packages and custom itineraries.',
      'publisher': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'url': 'https://skyrushtourism.com',
        'telephone': '+971-56-793-8033',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Dubai',
          'addressCountry': 'AE'
        }
      }
    }
  });

  return (
    <div className="about-premium-page">
      {/* Hero Showcase Header */}
      <div className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <span className="eg-tag animate-tag">✨ REDEFINING LUXURY &amp; ACCESSIBLE TRAVEL</span>
            <h1>Crafting Unforgettable Journeys &amp; Seamless Travel Experiences</h1>
            <p className="hero-subtext">
              Based in Dubai, UAE — <strong>Skyrush Tourism</strong> is a premier licensed travel consultancy and tour operator dedicated to bespoke holiday packages, {visaEnabled ? 'expert visa document advisory, ' : ''}and 5-star customer care.
            </p>

            {/* Live Stats Row */}
            <div className="about-stats-grid">
              {visaEnabled && (
                <div className="about-stat-card">
                  <div className="stat-icon-wrap">
                    <i className="bx bx-trophy"></i>
                  </div>
                  <div>
                    <span className="stat-number">99.4%</span>
                    <span className="stat-label">Visa Approval Record</span>
                  </div>
                </div>
              )}

              <div className="about-stat-card">
                <div className="stat-icon-wrap">
                  <i className="bx bx-user-check"></i>
                </div>
                <div>
                  <span className="stat-number">15,000+</span>
                  <span className="stat-label">Happy Travelers</span>
                </div>
              </div>

              <div className="about-stat-card">
                <div className="stat-icon-wrap">
                  <i className="bx bx-globe"></i>
                </div>
                <div>
                  <span className="stat-number">45+</span>
                  <span className="stat-label">Global Destinations</span>
                </div>
              </div>

              <div className="about-stat-card">
                <div className="stat-icon-wrap">
                  <i className="bx bxs-star"></i>
                </div>
                <div>
                  <span className="stat-number">4.9 / 5</span>
                  <span className="stat-label">Customer Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Are Story Split */}
      <div className="container" style={{ marginTop: '70px', marginBottom: '70px' }}>
        <div className="about-story-grid">
          
          {/* Left Narrative Column */}
          <div className="story-text-column">
            <span className="chips-label" style={{ color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
              OUR JOURNEY &amp; PHILOSOPHY
            </span>
            <h2 className="story-title">Your Trusted Travel Companion In Dubai &amp; Beyond</h2>
            <p className="story-lead">
              Founded with a passion for wanderlust and a commitment to absolute transparency, <strong>Skyrush Tourism</strong> has grown to become one of Dubai’s most trusted private travel consultancies and tour coordinators.
            </p>
            <p className="story-body">
              Whether you are seeking a snow-capped New Year escape to Almaty, a romantic sunset getaway in Santorini, a family adventure across Yerevan, or {visaEnabled ? 'fast-track UAE & Schengen visa advisory' : 'custom itinerary planning'} — our dedicated team ensures every detail is meticulously planned.
            </p>
            
            <div className="story-checklist">
              <div className="story-check-item">
                <i className="bx bx-check-circle"></i>
                <div>
                  <h6>Curated Fixed Departure &amp; Bespoke Tours</h6>
                  <span>Hand-crafted itineraries with verified hotel stays, transfers, and guided sightseeing.</span>
                </div>
              </div>
              {visaEnabled && (
                <div className="story-check-item">
                  <i className="bx bx-check-circle"></i>
                  <div>
                    <h6>Certified Visa &amp; Documentation Advisory</h6>
                    <span>Independent application audit, appointment booking support, and GDRFA/ICP clearances.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="story-actions" style={{ marginTop: '30px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/tours" className="primary-btn1">
                Explore Tour Packages →
              </Link>
              <Link to="/contact" className="outline-btn">
                Contact Our Team
              </Link>
            </div>
          </div>

          {/* Right Visual Photo Mosaic Column */}
          <div className="story-visual-column">
            <div className="photo-mosaic-wrap">
              <img 
                src="/Kazakhstan_hero_3.jpg" 
                alt="Skyrush Travel Experience" 
                className="mosaic-img main-img"
              />
              <img 
                src="/armenia_hero_3.jpg" 
                alt="Destination Visual" 
                className="mosaic-img sub-img-top"
              />
              <img 
                src="/Armenia_hero_2.jpg" 
                alt="Sightseeing Visual" 
                className="mosaic-img sub-img-bottom"
              />

              {/* Floating Badges */}
              <div className="floating-badge top-badge">
                <i className="bx bx-buildings"></i>
                <div>
                  <h6>Dubai Headquartered</h6>
                  <span>Licensed UAE Operator</span>
                </div>
              </div>

              <div className="floating-badge bottom-badge">
                <i className="bx bx-shield-check"></i>
                <div>
                  <h6>100% Verified Support</h6>
                  <span>Independent Travel Advisory</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Pillars of Excellence Section */}
      <div style={{ background: '#f8fafc', padding: '80px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-title-wrap text-center" style={{ marginBottom: '50px' }}>
            <span className="eg-tag">Core Brand Values</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>Our Pillars of Excellence</h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px', margin: '10px auto 0' }}>
              We operate on four uncompromising principles that guarantee every client receives VIP travel services.
            </p>
          </div>

          <div className="pillars-card-grid">
            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <i className="bx bx-shield-quarter"></i>
              </div>
              <h4>Uncompromising Integrity</h4>
              <p>
                We deliver honest, transparent {visaEnabled ? 'visa consultations' : 'travel services'} and ensure our tour package inclusions match the actual experience with zero hidden fees.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <i className="bx bx-slider-alt"></i>
              </div>
              <h4>Tailored Personalization</h4>
              <p>
                Every traveler is unique. We tailor custom itinerary requests to your precise budget, preferences, and travel style with customizable options.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <i className="bx bx-world"></i>
              </div>
              <h4>Global Partner Network</h4>
              <p>
                Direct partnerships with certified local hoteliers, ground transport providers, and travel escorts to guarantee safety and exclusive access.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-wrap">
                <i className="bx bx-headset"></i>
              </div>
              <h4>Express 24/7 Concierge</h4>
              <p>
                From your initial inquiry until you return home safely, our dedicated personal travel consultants are available round-the-clock to assist you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Skyrush Matrix */}
      <div className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
        <div className="section-title-wrap text-center" style={{ marginBottom: '50px' }}>
          <span className="eg-tag">The Skyrush Advantage</span>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>Why Travelers Choose Us</h2>
        </div>

        <div className="why-choose-matrix">
          <div className="matrix-card">
            <i className="bx bx-bolt-circle matrix-icon"></i>
            <h5>Instant Inquiry Response</h5>
            <p>Connect with a dedicated travel specialist within 1 hour for custom quotes {visaEnabled ? 'and visa checklists' : 'and travel checklists'}.</p>
          </div>

          {visaEnabled && (
            <div className="matrix-card">
              <i className="bx bx-id-card matrix-icon"></i>
              <h5>Certified Visa Auditing</h5>
              <p>Document formatting checks by experienced Dubai specialists before official embassy submission.</p>
            </div>
          )}

          <div className="matrix-card">
            <i className="bx bx-dollar-circle matrix-icon"></i>
            <h5>Transparent Rates</h5>
            <p>No unexpected surcharges or hidden service costs. Clear breakdowns for every package.</p>
          </div>

          <div className="matrix-card">
            <i className="bx bx-hotel matrix-icon"></i>
            <h5>Hand-picked Accommodations</h5>
            <p>We partner with tested 3-star, 4-star, and 5-star luxury hotels offering high comfort and central locations.</p>
          </div>

          <div className="matrix-card">
            <i className="bx bx-transfer-alt matrix-icon"></i>
            <h5>Seamless Transfers</h5>
            <p>Enjoy private airport pickups, air-conditioned tour coaches, and hassle-free transit assistance.</p>
          </div>

          <div className="matrix-card">
            <i className="bx bx-heart matrix-icon"></i>
            <h5>Dedicated Care</h5>
            <p>5-Star client satisfaction rating supported by thousands of happy holiday reviews.</p>
          </div>
        </div>
      </div>

      {/* CTA Callout Banner */}
      <div className="container" style={{ marginBottom: '80px' }}>
        <div className="about-cta-banner">
          <div className="cta-banner-content">
            <span className="cta-tag">PLAN YOUR NEXT JOURNEY WITH US</span>
            <h2>{visaEnabled ? 'Ready To Explore The World Or Need Express Visa Advisory?' : 'Ready To Explore The World?'}</h2>
            <p>Speak with our Dubai travel experts today and let us handle every detail of your dream vacation.</p>
            <div className="cta-banner-actions">
              <Link to="/tours" className="primary-btn1">
                EXPLORE TOUR PACKAGES →
              </Link>
              {visaEnabled ? (
                <a 
                  href={`https://api.whatsapp.com/send/?phone=${(content.contact?.whatsapp || content.contact?.phoneCall || '+971567938033').replace(/[^\d]/g, '')}&text=${encodeURIComponent(content.contact?.whatsappMessage || 'Hello Skyrush Tourism, I need assistance regarding my visa application.')}&type=phone_number&app_absent=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-assist-btn" 
                  style={{ width: 'auto', marginBottom: 0 }}
                >
                  <i className="bx bxl-whatsapp"></i> GET VISA ADVISORY
                </a>
              ) : (
                <a 
                  href={`https://api.whatsapp.com/send/?phone=${(content.contact?.whatsapp || content.contact?.phoneCall || '+971567938033').replace(/[^\d]/g, '')}&text=${encodeURIComponent(content.contact?.whatsappMessage || 'Hello Skyrush Tourism, I need assistance planning my holiday.')}&type=phone_number&app_absent=0`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-assist-btn" 
                  style={{ width: 'auto', marginBottom: 0 }}
                >
                  <i className="bx bxl-whatsapp"></i> CHAT WITH US
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

