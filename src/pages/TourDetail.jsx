import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

const getTourPackageCode = (tour) => {
  if (tour && tour.packageCode) return tour.packageCode;
  if (!tour) return '10000';
  const idNum = parseInt(tour.id || 1, 10);
  const hash = String(tour.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (10000 + (idNum * 317 + hash * 43) % 89999).toString();
};

export default function TourDetail({ content = {}, currency, rates }) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('itinerary');
  const [expandedDays, setExpandedDays] = useState({ 0: true, 1: true });
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', date: '', travelers: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');
  
  const tours = content.tours || [];
  const tour = tours.find((t) => t.id === parseInt(id, 10));

  const inquiryFormRef = useRef(null);

  useSEO({
    title: tour?.seoTitle || (tour ? `${tour.title} - ${tour.duration} Tour Package | Skyrush Tourism` : 'Tour Package | Skyrush Tourism'),
    description: tour?.seoDescription || (tour ? `Book our ${tour.title} for ${tour.duration}. Overview: ${tour.overview ? tour.overview.substring(0, 150) : ''}... Starting from ${tour.price} per person. Explore custom itineraries.` : ''),
    schema: tour ? {
      '@context': 'https://schema.org',
      '@type': 'Trip',
      'name': tour.title,
      'description': tour.overview || tour.title,
      'touristType': 'International Tourists',
      'offers': {
        '@type': 'Offer',
        'price': tour.price ? tour.price.replace(/[^\d]/g, '') : '1500',
        'priceCurrency': 'AED',
        'category': 'TravelTour',
        'availability': 'https://schema.org/InStock',
        'url': window.location.href
      },
      'itinerary': (tour.itinerary || []).map((day, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
          '@type': 'TouristAttraction',
          'name': day.title,
          'description': day.description
        }
      }))
    } : null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setResponseMsg('');

    const accessKey = content.contact?.web3formsAccessKey || '';
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('error');
        setResponseMsg('Web3Forms Access Key is not configured yet. Please configure it in the Admin Portal under General Settings.');
      }, 1000);
      return;
    }

    const formElement = e.target;
    const data = new FormData(formElement);
    const pCode = getTourPackageCode(tour);

    data.append('access_key', accessKey);
    data.append('Package_ID', `#${pCode}`);
    data.append('Package_Code', pCode);
    data.append('subject', `Tour Booking Enquiry: ${tour?.title} [Package ID: #${pCode}]`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setResponseMsg('Thank you! Your booking inquiry has been submitted successfully.');
        setFormData({ name: '', email: '', phone: '', date: '', travelers: 1 });
        formElement.reset();
      } else {
        setSubmitStatus('error');
        setResponseMsg(result.message || 'Something went wrong. Please check your Web3Forms access key.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setResponseMsg('Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDayExpand = (idx) => {
    setExpandedDays(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const scrollToSection = (tabName, elementId) => {
    setActiveTab(tabName);
    const elem = document.getElementById(elementId);
    if (elem) {
      const yOffset = -140;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const scrollToInquiry = () => {
    if (inquiryFormRef.current) {
      inquiryFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!tour) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px' }}>
        <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 700 }}>Tour Package Not Found</h2>
        <p style={{ margin: '20px 0 30px', color: '#64748b' }}>The tour package you are trying to view does not exist or has been removed.</p>
        <Link to="/tours" className="primary-btn1">Back to Tours Directory</Link>
      </div>
    );
  }

  // Generate 3 or 4 gallery photos for adaptive collage
  const userGallery = (tour.gallery && Array.isArray(tour.gallery)) ? tour.gallery.filter(Boolean) : [];
  const defaultPhotos = [
    tour.image,
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80"
  ];
  
  const gallery = userGallery.length >= 3 ? userGallery.slice(0, 4) : defaultPhotos.slice(0, 4);
  const photoCount = gallery.length >= 4 ? 4 : 3;

  // Inclusions Summary Helper
  const visaEnabled = content.visaEnabled !== false;
  const inc = tour.inclusionsSummary || {};
  const tourInclusions = (tour.inclusions || []).filter(item => visaEnabled || !item.toLowerCase().includes('visa'));
  const tourExclusions = (tour.exclusions || []).filter(item => visaEnabled || !item.toLowerCase().includes('visa'));

  return (
    <div className="tour-detail-page">
      {/* Top Header & Tags */}
      <div className="tour-detail-header">
        <div className="container">
          <div className="tour-title-area">
            <h1>{tour.title}</h1>
            <div className="tour-tags-row">
              <span className="tour-tag-pill customizable">
                <i className="bx bx-slider-alt"></i> Customizable
              </span>
              <span className="tour-tag-pill duration">
                <i className="bx bx-time-five"></i> {tour.duration}
              </span>
              {tour.tourType && (
                <span className="tour-tag-pill category">
                  <i className="bx bx-purchase-tag-alt"></i> {tour.tourType}
                </span>
              )}
              {tour.hotelCategory && (
                <span className="tour-tag-pill hotel">
                  <i className="bx bxs-star"></i> {tour.hotelCategory}
                </span>
              )}
              <span className="tour-tag-pill location">
                <i className="bx bx-map"></i> {tour.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        {photoCount === 3 ? (
          /* 3-PHOTO ADAPTIVE COLLAGE GRID */
          <div className="tour-collage-grid count-3">
            <div className="collage-item tour-collage-main" onClick={() => setActivePhotoIdx(0)}>
              <img src={gallery[0]} alt={`${tour.title} Main View`} />
              <button type="button" className="view-gallery-btn">
                <i className="bx bx-images"></i> VIEW GALLERY ({gallery.length}) →
              </button>
            </div>
            <div className="collage-column">
              <div className="collage-item" onClick={() => setActivePhotoIdx(1)}>
                <img src={gallery[1]} alt={`${tour.title} View 2`} />
                <span className="collage-label">Activities &amp; Sightseeing</span>
              </div>
              <div className="collage-item" onClick={() => setActivePhotoIdx(2)}>
                <img src={gallery[2]} alt={`${tour.title} View 3`} />
                <span className="collage-label">Property &amp; Stay Photos</span>
              </div>
            </div>
          </div>
        ) : (
          /* 4-PHOTO ADAPTIVE COLLAGE GRID */
          <div className="tour-collage-grid count-4">
            <div className="collage-item tour-collage-main" onClick={() => setActivePhotoIdx(0)}>
              <img src={gallery[0]} alt={`${tour.title} Main View`} />
              <button type="button" className="view-gallery-btn">
                <i className="bx bx-images"></i> VIEW GALLERY ({gallery.length}) →
              </button>
            </div>
            <div className="collage-column collage-single">
              <div className="collage-item" onClick={() => setActivePhotoIdx(1)}>
                <img src={gallery[1]} alt={`${tour.title} View 2`} />
              </div>
            </div>
            <div className="collage-column">
              <div className="collage-item" onClick={() => setActivePhotoIdx(2)}>
                <img src={gallery[2]} alt={`${tour.title} Activities`} />
                <span className="collage-label">Activities &amp; Sightseeing</span>
              </div>
              <div className="collage-item" onClick={() => setActivePhotoIdx(3)}>
                <img src={gallery[3]} alt={`${tour.title} Hotel Stays`} />
                <span className="collage-label">Property Photos</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sub-header Navigation Tabs Bar */}
      <div className="tour-tabs-sticky-nav">
        <div className="container nav-inner">
          <div className="tabs-list">
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => scrollToSection('itinerary', 'section-itinerary')}
            >
              ITINERARY
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'inclusions' ? 'active' : ''}`}
              onClick={() => scrollToSection('inclusions', 'section-inclusions')}
            >
              INCLUSIONS &amp; EXCLUSIONS
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => scrollToSection('overview', 'section-overview')}
            >
              OVERVIEW
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
              onClick={() => scrollToSection('policies', 'section-policies')}
            >
              POLICIES
            </button>
          </div>

          <button type="button" className="share-btn" onClick={handleShare}>
            <i className="bx bx-share-alt"></i>
            <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Layout - 2 Columns (70% Left / 30% Right Sticky Sidebar) */}
      <div className="container" style={{ marginTop: '35px', marginBottom: '80px' }}>
        <div className="tour-split-layout">
          
          {/* LEFT COLUMN (70%) */}
          <div className="tour-left-column">
            
            {/* Included In This Package Section */}
            <div className="package-included-card">
              <h4>Included In This Package</h4>
              <div className="included-chips-row">
                <div className={`inc-chip ${inc.flight !== false ? 'active' : 'excluded'}`}>
                  <i className="bx bx-plane-alt"></i>
                  <span>FLIGHTS</span>
                  <i className={`bx ${inc.flight !== false ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                <div className={`inc-chip ${inc.stay !== false ? 'active' : 'excluded'}`}>
                  <i className="bx bx-building-house"></i>
                  <span>HOTEL STAY</span>
                  <i className={`bx ${inc.stay !== false ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                <div className={`inc-chip ${inc.breakfast !== false ? 'active' : 'excluded'}`}>
                  <i className="bx bx-restaurant"></i>
                  <span>BREAKFAST</span>
                  <i className={`bx ${inc.breakfast !== false ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                <div className={`inc-chip ${inc.sightseeing !== false ? 'active' : 'excluded'}`}>
                  <i className="bx bx-camera"></i>
                  <span>SIGHTSEEING</span>
                  <i className={`bx ${inc.sightseeing !== false ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                <div className={`inc-chip ${inc.transfer !== false ? 'active' : 'excluded'}`}>
                  <i className="bx bx-car"></i>
                  <span>TRANSFERS</span>
                  <i className={`bx ${inc.transfer !== false ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                <div className={`inc-chip ${inc.guide ? 'active' : 'excluded'}`}>
                  <i className="bx bx-user-voice"></i>
                  <span>GUIDE</span>
                  <i className={`bx ${inc.guide ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                </div>
                {visaEnabled && (
                  <div className={`inc-chip ${inc.visa ? 'active' : 'excluded'}`}>
                    <i className="bx bx-id-card"></i>
                    <span>VISA ASSISTANCE</span>
                    <i className={`bx ${inc.visa ? 'bx-check-circle check' : 'bx-x-circle cross'}`}></i>
                  </div>
                )}
              </div>
            </div>

            {/* Overview Section */}
            <div id="section-overview" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-book-open"></i>
                <h2>Tour Overview</h2>
              </div>
              <p className="overview-text">
                {tour.overview || "Experience the breathtaking beauty of this destination with our premium tour package."}
              </p>
            </div>

            {/* Itinerary Schedule Accordion Section */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div id="section-itinerary" className="tour-section-block">
                <div className="section-block-title">
                  <i className="bx bx-map-pin"></i>
                  <h2>Day-by-Day Detailed Itinerary</h2>
                </div>
                <div className="itinerary-accordion-list">
                  {tour.itinerary.map((day, idx) => {
                    const isExp = !!expandedDays[idx];
                    return (
                      <div className={`itinerary-day-card ${isExp ? 'open' : ''}`} key={idx}>
                        <div className="day-card-header" onClick={() => toggleDayExpand(idx)}>
                          <div className="day-title-wrap">
                            <span className="day-badge">{day.day || `Day ${idx + 1}`}</span>
                            <h5>{day.title}</h5>
                          </div>
                          <i className={`bx ${isExp ? 'bx-chevron-up' : 'bx-chevron-down'} toggle-icon`}></i>
                        </div>
                        {isExp && (
                          <div className="day-card-body">
                            <p>{day.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions */}
            <div id="section-inclusions" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-check-shield"></i>
                <h2>Inclusions &amp; Exclusions</h2>
              </div>
              <div className="inc-exc-grid">
                {tour.inclusions && tour.inclusions.length > 0 && (
                  <div className="inc-box">
                    <h4><i className="bx bx-check-circle" style={{ color: '#10b981' }}></i> What's Included</h4>
                    <ul>
                      {tourInclusions.filter(Boolean).map((item, idx) => (
                        <li key={idx}>
                          <i className="bx bx-check"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tourExclusions.length > 0 && (
                  <div className="exc-box">
                    <h4><i className="bx bx-x-circle" style={{ color: '#ef4444' }}></i> What's Excluded</h4>
                    <ul>
                      {tourExclusions.filter(Boolean).map((item, idx) => (
                        <li key={idx}>
                          <i className="bx bx-x"></i>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Policies Section */}
            <div id="section-policies" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-shield-quarter"></i>
                <h2>Booking &amp; Travel Policies</h2>
              </div>
              <div className="policies-content-box">
                <div className="policy-item">
                  <h5><i className="bx bx-info-circle"></i> Booking &amp; Confirmation</h5>
                  <p>Bookings are subject to availability at the time of reservation. Instant confirmation vouchers are issued within 24 hours of successful booking inquiry submission.</p>
                </div>
                <div className="policy-item">
                  <h5><i className="bx bx-revision"></i> Cancellation &amp; Refund Policy</h5>
                  <p>Free cancellation available up to 7 days prior to departure for fixed departure tour packages. Terms may vary for promotional or flight-inclusive bookings.</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form Block */}
            <div ref={inquiryFormRef} className="tour-section-block inquiry-form-block">
              <div className="section-block-title">
                <i className="bx bx-envelope"></i>
                <h2>Submit Tour Inquiry</h2>
              </div>

              {submitStatus === 'success' && (
                <div className="alert-msg success">{responseMsg}</div>
              )}
              {submitStatus === 'error' && (
                <div className="alert-msg error">{responseMsg}</div>
              )}

              <form onSubmit={handleSubmit} className="tour-inquiry-form">
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
                <input type="hidden" name="Package_ID" value={`#${getTourPackageCode(tour)}`} />
                <input type="hidden" name="Package_Code" value={getTourPackageCode(tour)} />
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Selected Tour Package
                  </label>
                  <input 
                    type="text" 
                    name="Package_Name" 
                    className="form-input" 
                    value={tour.title} 
                    readOnly 
                    style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed', color: '#0f172a', fontWeight: 600 }}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-input" 
                      placeholder="Enter your full name" 
                      value={formData.name} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-input" 
                      placeholder="name@example.com" 
                      value={formData.email} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      className="form-input" 
                      placeholder="+971 50 000 0000" 
                      value={formData.phone} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Travel Date *</label>
                    <input 
                      type="date" 
                      name="date" 
                      className="form-input" 
                      value={formData.date} 
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Number of Travelers</label>
                  <input 
                    type="number" 
                    name="travelers" 
                    min="1" 
                    className="form-input" 
                    value={formData.travelers} 
                    onChange={handleChange}
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="contact-form-submit" 
                  disabled={isSubmitting} 
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  {isSubmitting ? 'Submitting Inquiry...' : 'PROCEED TO INQUIRY'}
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN (30% Sticky Sidebar Widget) */}
          <aside className="tour-right-sidebar">
            <div className="sticky-booking-card">
              
              {/* Discount Tag Header - only if offer price entered */}
              {tour.offerPrice && String(tour.offerPrice).trim() !== '' ? (
                <div className="card-price-header">
                  <span className="original-price">
                    {formatPrice(tour.price, currency, rates)}
                  </span>
                  <span className="discount-tag">
                    {calculateDiscountPercentage(tour.price, tour.offerPrice)}% OFF
                  </span>
                </div>
              ) : null}

              {/* Campaign Highlight Label */}
              {tour.offerPrice && String(tour.offerPrice).trim() !== '' ? (
                <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <i className="bx bxs-hot"></i> Special Campaign Price
                </div>
              ) : null}

              {/* Main Price */}
              <div className="main-price-display">
                <span className="price-num" style={{ color: (tour.offerPrice && String(tour.offerPrice).trim() !== '') ? 'var(--orange)' : 'inherit' }}>
                  {formatPrice(tour.offerPrice && String(tour.offerPrice).trim() !== '' ? tour.offerPrice : tour.price, currency, rates)}
                </span>
                <span className="price-unit">/ Adult</span>
              </div>
              <p className="price-tax-text">Excluding applicable taxes &amp; fees</p>

              {/* Action Buttons */}
              <button 
                type="button" 
                className="proceed-booking-btn"
                onClick={scrollToInquiry}
              >
                PROCEED TO INQUIRY
              </button>

              <a 
                href={`https://wa.me/${(content.contact?.whatsapp || '971567938033').replace(/[^\d]/g, '')}?text=Hello%20Skyrush%20Tourism,%20I%20am%20interested%20in%20the%20${encodeURIComponent(tour.title)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="whatsapp-assist-btn"
              >
                <i className="bx bxl-whatsapp"></i> Chat on WhatsApp
              </a>

              {/* Guarantee Badges List */}
              <div className="trust-badges-list">
                <div className="trust-badge-item">
                  <i className="bx bx-bolt-circle"></i>
                  <div>
                    <h6>Instant Booking Confirmation</h6>
                    <span>Quick response within 1 hour</span>
                  </div>
                </div>
                <div className="trust-badge-item">
                  <i className="bx bx-shield-alt-2"></i>
                  <div>
                    <h6>Transparent Pricing</h6>
                    <span>Honest rates with no hidden fees</span>
                  </div>
                </div>
                <div className="trust-badge-item">
                  <i className="bx bx-support"></i>
                  <div>
                    <h6>24/7 Dedicated Support</h6>
                    <span>Personal travel consultant guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Premium Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div className="gallery-modal-overlay" onClick={() => setActivePhotoIdx(null)}>
          <div className="gallery-modal-content single-photo-mode" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-modal-btn" onClick={() => setActivePhotoIdx(null)}>
              <i className="bx bx-x"></i>
            </button>
            
            <div className="lightbox-image-container">
              {gallery.length > 1 && (
                <button 
                  type="button" 
                  className="lightbox-nav-btn prev-btn" 
                  onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + gallery.length) % gallery.length)}
                >
                  <i className="bx bx-chevron-left"></i>
                </button>
              )}
              
              <img 
                src={gallery[activePhotoIdx]} 
                alt={`${tour.title} Enlarged View`} 
                className="lightbox-main-img" 
              />
              
              {gallery.length > 1 && (
                <button 
                  type="button" 
                  className="lightbox-nav-btn next-btn" 
                  onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % gallery.length)}
                >
                  <i className="bx bx-chevron-right"></i>
                </button>
              )}
            </div>
            
            <div className="lightbox-caption">
              Photo {activePhotoIdx + 1} of {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

