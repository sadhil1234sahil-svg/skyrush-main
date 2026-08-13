import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

export default function VisaDetail({ content = {}, currency, rates }) {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('documents');
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', travelers: 1, date: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [responseMsg, setResponseMsg] = useState('');

  const visas = content.visas || [];
  const visa = visas.find((v) => v.id === parseInt(id, 10));

  const inquiryFormRef = useRef(null);

  useSEO({
    title: visa?.seoTitle || (visa ? `${visa.title} Consultancy & Application Support | Skyrush Tourism` : 'Visa Consultancy Details | Skyrush Tourism'),
    description: visa?.seoDescription || (visa ? `Professional consultancy and documentation support for ${visa.title}. Skyrush Tourism is an independent travel advisory (not a government agency).` : ''),
    schema: visa ? {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': `${visa.title} Consultancy`,
      'description': `Professional visa consultancy, application documentation, and appointment support for ${visa.title}. Provided by Skyrush Tourism, an independent private travel consultancy.`,
      'provider': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'description': 'Skyrush Tourism is a private travel consultancy and tour agency based in Dubai.'
      },
      'offers': {
        '@type': 'Offer',
        'price': visa.price ? visa.price.replace(/[^\d]/g, '') : '999',
        'priceCurrency': 'AED'
      }
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
    data.append('access_key', accessKey);
    data.append('subject', `Visa Consultation Request: ${visa?.title}`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setResponseMsg('Thank you! Your visa inquiry has been submitted successfully.');
        setFormData({ name: '', email: '', phone: '', travelers: 1, date: '', message: '' });
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

  if (!visa) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px' }}>
        <h2 style={{ fontSize: '32px', color: '#0f172a', fontWeight: 700 }}>Visa Package Not Found</h2>
        <p style={{ margin: '20px 0 30px', color: '#64748b' }}>The visa package you are trying to view does not exist or has been removed.</p>
        <Link to="/visa" className="primary-btn1">Back to Visa Directory</Link>
      </div>
    );
  }

  // Generate 3 or 4 photos for the adaptive collage
  const defaultPhotos = [
    visa.image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
  ];
  const userGallery = (visa.gallery && Array.isArray(visa.gallery)) ? visa.gallery.filter(Boolean) : [];
  const gallery = userGallery.length >= 3 ? userGallery.slice(0, 4) : defaultPhotos.slice(0, 4);
  const photoCount = gallery.length >= 4 ? 4 : 3;

  const defaultDocs = [
    "Passport Copy (valid for at least 6 months)",
    "Recent Passport-Sized Photograph (white background)",
    "UAE Residence Visa & Emirates ID Copy",
    "3 Months Stamped Bank Statement",
    "Employment NOC Letter / Salary Certificate",
    "Confirmed Flight & Hotel Reservation Voucher"
  ];
  const reqDocs = (visa.documents && visa.documents.length > 0) ? visa.documents : defaultDocs;

  return (
    <div className="visa-detail-page">
      {/* Top Header & Tags */}
      <div className="tour-detail-header">
        <div className="container">
          <div className="tour-title-area">
            <h1>{visa.title}</h1>
            <div className="tour-tags-row">
              <span className="tour-tag-pill customizable">
                <i className="bx bx-bolt-circle"></i> {visa.processingTime || '24-48 Hours Express'}
              </span>
              <span className="tour-tag-pill category">
                <i className="bx bx-id-card"></i> {visa.type || 'E-Visa Consultancy'}
              </span>
              <span className="tour-tag-pill duration">
                <i className="bx bx-time-five"></i> Stay: {visa.stay}
              </span>
              <span className="tour-tag-pill hotel">
                <i className="bx bx-refresh"></i> {visa.entryType || 'Single Entry'}
              </span>
              <span className="tour-tag-pill location">
                <i className="bx bx-map"></i> {visa.countryTo || visa.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Photo Collage Grid (Adaptive 3 or 4 Images) */}
      <div className="container" style={{ marginTop: '20px' }}>
        {photoCount === 3 ? (
          <div className="tour-collage-grid count-3">
            <div className="collage-item tour-collage-main" onClick={() => setActivePhotoIdx(0)}>
              <img src={gallery[0]} alt={`${visa.title} Main View`} />
              <button type="button" className="view-gallery-btn">
                <i className="bx bx-images"></i> VIEW GALLERY ({gallery.length}) →
              </button>
            </div>
            <div className="collage-column">
              <div className="collage-item" onClick={() => setActivePhotoIdx(1)}>
                <img src={gallery[1]} alt={`${visa.title} Document Visual`} />
                <span className="collage-label">Embassy &amp; Visa Advisory</span>
              </div>
              <div className="collage-item" onClick={() => setActivePhotoIdx(2)}>
                <img src={gallery[2]} alt={`${visa.title} Destination View`} />
                <span className="collage-label">Destination View</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="tour-collage-grid count-4">
            <div className="collage-item tour-collage-main" onClick={() => setActivePhotoIdx(0)}>
              <img src={gallery[0]} alt={`${visa.title} Main View`} />
              <button type="button" className="view-gallery-btn">
                <i className="bx bx-images"></i> VIEW GALLERY ({gallery.length}) →
              </button>
            </div>
            <div className="collage-column collage-single">
              <div className="collage-item" onClick={() => setActivePhotoIdx(1)}>
                <img src={gallery[1]} alt={`${visa.title} View 2`} />
              </div>
            </div>
            <div className="collage-column">
              <div className="collage-item" onClick={() => setActivePhotoIdx(2)}>
                <img src={gallery[2]} alt={`${visa.title} Advisory`} />
                <span className="collage-label">Document Verification</span>
              </div>
              <div className="collage-item" onClick={() => setActivePhotoIdx(3)}>
                <img src={gallery[3]} alt={`${visa.title} Destination`} />
                <span className="collage-label">Destination Photos</span>
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
              className={`nav-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => scrollToSection('documents', 'section-documents')}
            >
              REQUIRED DOCUMENTS
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'process' ? 'active' : ''}`}
              onClick={() => scrollToSection('process', 'section-process')}
            >
              PROCESS TIMELINE
            </button>
            <button 
              type="button" 
              className={`nav-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => scrollToSection('rules', 'section-rules')}
            >
              ELIGIBILITY &amp; RULES
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
              className={`nav-tab-btn ${activeTab === 'disclaimer' ? 'active' : ''}`}
              onClick={() => scrollToSection('disclaimer', 'section-disclaimer')}
            >
              LEGAL NOTICE
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
            
            {/* Key Service Highlights Card */}
            <div className="package-included-card">
              <h4>Key Service Highlights Included</h4>
              <div className="included-chips-row">
                <div className="inc-chip active">
                  <i className="bx bx-bolt-circle"></i>
                  <span>FAST PROCESSING</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
                <div className="inc-chip active">
                  <i className="bx bx-building"></i>
                  <span>EMBASSY SUBMISSION</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
                <div className="inc-chip active">
                  <i className="bx bx-file-find"></i>
                  <span>DOCUMENT AUDIT</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
                <div className="inc-chip active">
                  <i className="bx bx-hotel"></i>
                  <span>HOTEL VOUCHERS</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
                <div className="inc-chip active">
                  <i className="bx bx-shield-quarter"></i>
                  <span>INSURANCE GUIDANCE</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
                <div className="inc-chip active">
                  <i className="bx bx-check-shield"></i>
                  <span>99%+ SUCCESS RATE</span>
                  <i className="bx bx-check-circle check"></i>
                </div>
              </div>
            </div>

            {/* Required Documents Checklist Section */}
            <div id="section-documents" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-task"></i>
                <h2>Required Documents Checklist</h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                Please prepare the following documents. Our visa specialist team will audit every document to ensure total compliance before embassy submission.
              </p>
              <div className="visa-docs-checklist-grid">
                {reqDocs.map((doc, idx) => (
                  <div className="doc-check-card" key={idx}>
                    <div className="doc-icon-wrap">
                      <i className="bx bx-file"></i>
                    </div>
                    <div className="doc-info">
                      <h6>Document #{idx + 1}</h6>
                      <p>{doc}</p>
                    </div>
                    <i className="bx bx-check-circle doc-status-check"></i>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Application Process Timeline */}
            <div id="section-process" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-git-commit"></i>
                <h2>Step-by-Step Application Process</h2>
              </div>
              <div className="visa-process-timeline">
                <div className="timeline-step-item">
                  <div className="step-num-badge">1</div>
                  <div className="step-content">
                    <h5>Submit Inquiry &amp; Upload Documents</h5>
                    <p>Fill out the inquiry form or contact our WhatsApp advisor. Submit digital copies of your passport, photo, and residence visa.</p>
                  </div>
                </div>
                <div className="timeline-step-item">
                  <div className="step-num-badge">2</div>
                  <div className="step-content">
                    <h5>Expert Audit &amp; Format Verification</h5>
                    <p>Our experienced travel documentation team audits your paperwork, prepares official cover letters, flight reservations, and hotel vouchers.</p>
                  </div>
                </div>
                <div className="timeline-step-item">
                  <div className="step-num-badge">3</div>
                  <div className="step-content">
                    <h5>Embassy / ICP Portal Submission</h5>
                    <p>We submit your verified application directly to the official government electronic visa portal or schedule VFS / embassy appointments.</p>
                  </div>
                </div>
                <div className="timeline-step-item">
                  <div className="step-num-badge">4</div>
                  <div className="step-content">
                    <h5>Visa Approval &amp; PDF Delivery</h5>
                    <p>Once approved, your official E-Visa / approval voucher is sent directly to your Email &amp; WhatsApp for instant travel.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility & Embassy Rules Block */}
            <div id="section-rules" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-shield-alt-2"></i>
                <h2>Eligibility Criteria &amp; Guidelines</h2>
              </div>
              <div className="policies-content-box">
                <div className="policy-item">
                  <h5><i className="bx bx-calendar"></i> Passport &amp; Residency Validity</h5>
                  <p>Passports must be valid for at least 6 months beyond the date of travel. For sticker visas, UAE residents must hold a valid UAE residence visa with at least 3 months remaining.</p>
                </div>
                <div className="policy-item">
                  <h5><i className="bx bx-dollar-circle"></i> Financial Requirements</h5>
                  <p>Certain embassies require recent 3-month stamped bank statements demonstrating adequate funds to cover stay expenses.</p>
                </div>
              </div>
            </div>

            {/* Detailed Overview Section */}
            <div id="section-overview" className="tour-section-block">
              <div className="section-block-title">
                <i className="bx bx-book-open"></i>
                <h2>Visa Package Overview</h2>
              </div>
              <div 
                className="overview-text"
                dangerouslySetInnerHTML={{ __html: visa.description || `<p>No detailed description available for this package.</p>` }} 
              />
            </div>

            {/* Government Agency Disclaimer */}
            <div id="section-disclaimer" className="tour-section-block" style={{ background: '#fffbeb', borderColor: '#fef3c7' }}>
              <div className="section-block-title" style={{ borderBottomColor: '#fde68a' }}>
                <i className="bx bx-info-circle" style={{ color: '#d97706' }}></i>
                <h2 style={{ color: '#92400e' }}>Independent Consultancy Disclaimer</h2>
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: '#b45309' }}>
                <strong>Skyrush Tourism</strong> is an independent private travel consultancy and document advisory firm in Dubai, UAE. We are <strong>not</strong> a government agency, embassy, or official immigration authority. Final decisions on visa approval or rejection reside solely with the respective sovereign government immigration departments.
              </p>
            </div>

            {/* Inquiry Form Block */}
            <div ref={inquiryFormRef} className="tour-section-block inquiry-form-block">
              <div className="section-block-title">
                <i className="bx bx-envelope"></i>
                <h2>Apply / Inquire For Visa</h2>
              </div>

              {submitStatus === 'success' && (
                <div className="alert-msg success">{responseMsg}</div>
              )}
              {submitStatus === 'error' && (
                <div className="alert-msg error">{responseMsg}</div>
              )}

              <form onSubmit={handleSubmit} className="tour-inquiry-form">
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Selected Visa Package
                  </label>
                  <input 
                    type="text" 
                    name="Package_Name" 
                    className="form-input" 
                    value={visa.title} 
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
                    <label>Phone / WhatsApp Number *</label>
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
                    <label>Number of Applicants</label>
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
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Message / Nationality Details</label>
                  <textarea 
                    name="message" 
                    rows="3"
                    className="form-input" 
                    placeholder="Provide passport nationality and intended travel date..." 
                    value={formData.message} 
                    onChange={handleChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="contact-form-submit" 
                  disabled={isSubmitting} 
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  {isSubmitting ? 'Submitting Visa Request...' : 'APPLY FOR VISA NOW'}
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN (30% Sticky Sidebar Widget) */}
          <aside className="tour-right-sidebar">
            <div className="sticky-booking-card">
              
              {/* Discount Tag Header - only if offer price entered */}
              {visa.offerPrice && String(visa.offerPrice).trim() !== '' ? (
                <div className="card-price-header" style={{ marginBottom: '10px' }}>
                  <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
                    {formatPrice(visa.price, currency, rates)}
                  </span>
                  <span className="discount-tag" style={{ background: '#ef4444' }}>
                    {calculateDiscountPercentage(visa.price, visa.offerPrice)}% OFF
                  </span>
                </div>
              ) : (
                <div className="card-price-header">
                  <span className="discount-tag" style={{ background: '#10b981' }}>⚡ {visa.approvalRate || '99.4%'} APPROVAL RATE</span>
                </div>
              )}

              {/* Promo Highlight Label */}
              {visa.offerPrice && String(visa.offerPrice).trim() !== '' ? (
                <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <i className="bx bxs-hot"></i> Special Promo Price
                </div>
              ) : null}

              {/* Main Price */}
              <div className="main-price-display">
                <span className="price-num" style={{ color: (visa.offerPrice && String(visa.offerPrice).trim() !== '') ? 'var(--orange)' : 'inherit' }}>
                  {formatPrice(visa.offerPrice && String(visa.offerPrice).trim() !== '' ? visa.offerPrice : visa.price, currency, rates)}
                </span>
                <span className="price-unit">/ Applicant</span>
              </div>
              <p className="price-tax-text">Government &amp; Advisory Fees Included</p>

              {/* Action Buttons */}
              <button 
                type="button" 
                className="proceed-booking-btn"
                onClick={scrollToInquiry}
              >
                APPLY FOR VISA NOW
              </button>

              <a 
                href={`https://wa.me/${(content.contact?.whatsapp || '971567938033').replace(/[^\d]/g, '')}?text=Hello%20Skyrush%20Tourism,%20I%20am%20interested%20in%20the%20${encodeURIComponent(visa.title)}`} 
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
                    <h6>Fast Processing Support</h6>
                    <span>Express 24 - 48 Hours option available</span>
                  </div>
                </div>
                <div className="trust-badge-item">
                  <i className="bx bx-shield-check"></i>
                  <div>
                    <h6>Certified Document Verification</h6>
                    <span>Thorough checklist audit by experts</span>
                  </div>
                </div>
                <div className="trust-badge-item">
                  <i className="bx bx-support"></i>
                  <div>
                    <h6>24/7 Dedicated Visa Specialist</h6>
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
                alt={`${visa.title} Enlarged View`} 
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

