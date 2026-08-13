import React from 'react';

export default function About({ about = {} }) {
  return (
    <section className="about-section section-padding">
      <div className="container about-grid">
        {/* Left Column: Content */}
        <div className="about-left">
          <div className="about-sub-header">
            <span>ABOUT US</span>
            <div className="sub-header-line"></div>
          </div>
          
          <h2 className="about-main-heading">
            OUR JOURNEY.<br />
            <span className="text-orange">YOUR MEMORIES.</span>
          </h2>
          
          <p className="about-description">
            At SkyRush Tourism, our mission is to deliver seamless travel experiences, exceptional service, and unforgettable memories across the world. We are driven by a commitment to excellence, innovation, and customer satisfaction, ensuring that every journey with us is nothing short of extraordinary.
          </p>
          
          <div className="about-features">
            <div className="about-feature-item">
              <div className="feature-icon-wrapper">
                <i className="bx bx-globe"></i>
              </div>
              <h4 className="feature-title">Global Experiences</h4>
              <p className="feature-desc">Curated tours to the world's most stunning destinations.</p>
            </div>
            
            <div className="about-feature-item">
              <div className="feature-icon-wrapper">
                <i className="bx bx-support"></i>
              </div>
              <h4 className="feature-title">Exceptional Service</h4>
              <p className="feature-desc">24/7 support and personalized assistance every step of the way.</p>
            </div>
            
            <div className="about-feature-item">
              <div className="feature-icon-wrapper">
                <i className="bx bx-award"></i>
              </div>
              <h4 className="feature-title">Trusted by Travelers</h4>
              <p className="feature-desc">Thousands of happy travelers & growing every day.</p>
            </div>
            
            <div className="about-feature-item">
              <div className="feature-icon-wrapper">
                <i className="bx bx-purchase-tag-alt"></i>
              </div>
              <h4 className="feature-title">Best Value</h4>
              <p className="feature-desc">Handpicked packages that offer quality and affordability.</p>
            </div>
          </div>
          
          <div className="about-stats-bar">
            <div className="stat-item">
              <i className="bx bx-group stat-icon"></i>
              <div className="stat-info">
                <span className="stat-val">1695+</span>
                <span className="stat-lbl">Happy Customers</span>
              </div>
            </div>
            
            <div className="stat-item">
              <i className="bx bx-star stat-icon"></i>
              <div className="stat-info">
                <span className="stat-val">4.8/5</span>
                <span className="stat-lbl">Average Rating</span>
              </div>
            </div>
            
            <div className="stat-item">
              <i className="bx bx-map stat-icon"></i>
              <div className="stat-info">
                <span className="stat-val">50+</span>
                <span className="stat-lbl">Travel Destinations</span>
              </div>
            </div>
            
            <div className="stat-item">
              <i className="bx bx-camera stat-icon"></i>
              <div className="stat-info">
                <span className="stat-val">1000+</span>
                <span className="stat-lbl">Trips Organized</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column: Collage */}
        <div className="about-collage-container">
          {/* Dotted lines SVG Overlay */}
          <svg className="collage-svg-overlay" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top right plane path */}
            <path d="M 390,140 C 440,70 470,50 490,90 C 500,110 470,140 450,110 C 430,90 460,70 480,85" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            {/* Bottom pin path */}
            <path d="M 380,430 C 370,480 340,480 325,470" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          </svg>
          
          {/* Paper airplane icon at top right */}
          <i className="bx bxs-paper-plane airplane-icon"></i>
          
          {/* Map pin icon at bottom */}
          <i className="bx bxs-map pin-icon"></i>

          {/* Collage Images (Clean 2-Column Balanced Layout) */}
          <img 
            src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&h=800&q=80" 
            alt="Airport flight board woman traveler" 
            className="collage-img collage-main" 
          />
          
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&h=450&q=80" 
            alt="Lake shore mountains hat traveler" 
            className="collage-img collage-top-right" 
          />
          
          <img 
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&h=450&q=80" 
            alt="Open arms mountain traveler" 
            className="collage-img collage-bottom-right" 
          />
          

          {/* Floating Badge */}
          <div className="collage-badge">
            <span className="badge-num">1695+</span>
            <span className="badge-lbl">Happy<br/>Travelers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

