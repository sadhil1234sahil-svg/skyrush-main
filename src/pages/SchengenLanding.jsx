import React, { useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import About from '../components/About';
import Testimonials from '../components/Testimonials';

const defaultTestimonials = [
  {
    id: 1,
    category: "Google",
    quote: "Extremely professional team. They guided me through the complex Schengen document checklist and booked my appointments. Very satisfied.",
    author: "Rahul Verma",
    location: "India",
    avatar: "https://i.pravatar.cc/80?img=68",
    meta: "Oct 14, 2024 · 02:10 PM"
  },
  {
    id: 2,
    category: "Tripadvisor",
    quote: "Highly recommend Skyrush for European travel permits. They got us appointment slots for Italy TLS when none were available online. Their documentation checklists are extremely precise.",
    author: "Maria Santos",
    location: "Philippines",
    avatar: "https://i.pravatar.cc/80?img=20",
    meta: "June 1, 2025 · 04:30 PM"
  },
  {
    id: 3,
    category: "Facebook",
    quote: "Exceptional support! They prepared our flight bookings, hotel reservations, and travel insurance coverage within a few hours. The entire submission process at VFS was stress-free.",
    author: "Arthur Pendelton",
    location: "United Kingdom",
    avatar: "https://i.pravatar.cc/80?img=33",
    meta: "Jan 22, 2025 · 11:20 AM"
  },
  {
    id: 4,
    category: "Google",
    quote: "Got my Schengen travel access permit approved for Switzerland! The cover letter draft they prepared was professional and detailed. Outstanding travel clearance service in Dubai.",
    author: "Sandra Valencian",
    location: "India",
    avatar: "https://i.pravatar.cc/80?img=5",
    meta: "Apr 4, 2025 · 10:30 PM"
  },
  {
    id: 5,
    category: "Google",
    quote: "Professional entry clearance consultants. I was worried about my financial proofs, but they assessed my profile and guided me on how to present it correctly. Approved in no time.",
    author: "John Davis",
    location: "United States",
    avatar: "https://i.pravatar.cc/80?img=12",
    meta: "May 12, 2025 · 09:15 AM"
  },
  {
    id: 6,
    category: "Facebook",
    quote: "Super fast response on WhatsApp. They coordinated our entire family documentation and scheduled our VFS slots for Spain. Will definitely use them for our next European vacation.",
    author: "Chloe Lim",
    location: "Singapore",
    avatar: "https://i.pravatar.cc/80?img=47",
    meta: "March 5, 2025 · 08:45 PM"
  }
];

export default function SchengenLanding({ content = {} }) {
  const { landingSlug } = useParams();
  const contact = content.contact || {};

  const activeSlug = landingSlug || 'schengen';
  const page = (content.landingPages || []).find(p => p.slug === activeSlug);



  // Fallback defaults
  const seoTitle = page?.seoTitle || 'Schengen Entry Clearance & Travel Access Consultants | Skyrush Tourism';
  const seoDescription = page?.seoDescription || 'Expert Schengen travel permit consultancy for UAE residents. Professional assistance for VFS/TLS appointments, document preparation, hotel bookings, and travel insurance.';
  const heroTagline = page?.heroTagline || 'Premium Schengen Travel Advisory';
  const heroTitle = page?.heroTitle || 'Unlock Seamless Entry To <span class="accent-text">29 European Countries</span>';
  const heroSubtitle = page?.heroSubtitle || 'Leading entry clearance & travel access consultants for UAE residents. We coordinate VFS/TLS appointments, compile 100% compliant documentation, flight reserves, hotel bookings, and required travel insurance.';
  const heroBtnText = page?.heroBtnText || 'Free Assessment';

  // Contacts
  const cleanWhatsapp = (page?.whatsappNumber || contact.whatsapp || '+971567938033').replace(/[^\d]/g, '');
  const cleanPhone = (page?.phoneNumber || contact.phoneCall || '+971567938033').replace(/[^\d]/g, '');
  const displayPhone = page?.phoneNumber || contact.phone || '+971 56 793 8033';

  // WhatsApp Message Preset
  const whatsappMsgPreset = page?.whatsappMessage || 'Hello, I would like to consult regarding Schengen Entry Clearance.';
  const whatsappLink = `https://api.whatsapp.com/send/?phone=${cleanWhatsapp}&text=${encodeURIComponent(whatsappMsgPreset)}`;

  // Trust Highlights
  const clearanceRate = page?.clearanceRate || '98.8%';
  const appointmentSupport = page?.appointmentSupport || 'VFS & TLS';
  const insuranceLimit = page?.insuranceLimit || '30K EUR';

  // Why Consult With Us Section
  const whySectionTitle = page?.whySectionTitle || 'Why Consult With Us?';
  const whySectionDesc = page?.whySectionDesc || 'Navigating European travel requirements can be complicated. Our team ensures your files are perfect.';
  const whyCards = page?.whyCards || [
    {
      icon: "fa-solid fa-calendar-check",
      title: "VFS / TLS Booking Support",
      text: "We monitor and secure fast-track slots for biometrics and file submissions across European consulates."
    },
    {
      icon: "fa-solid fa-folder-open",
      title: "Compliant Documents",
      text: "We review your financial certificates, bank transcripts, and employer letters to verify they match consulate criteria."
    },
    {
      icon: "fa-solid fa-map-location-dot",
      title: "Itinerary Formats",
      text: "Get confirmed flight bookings, verifiable hotel vouchers, and detailed travel schedules that meet entry rules."
    },
    {
      icon: "fa-solid fa-user-shield",
      title: "Travel Insurance coordination",
      text: "All-inclusive Schengen approved coverage starting from €30,000 to keep you protected throughout your travel."
    }
  ];

  // Simplified Consulting Flow
  const stepsSectionTag = page?.stepsSectionTag || '✨ APPLICATION STEPS';
  const stepsSectionTitle = page?.stepsSectionTitle || 'Our Simplified Consulting Flow';
  const stepsSectionDesc = page?.stepsSectionDesc || 'We guide you step-by-step to compile the perfect travel permit application, secure slot booking, and ensure seamless European entry.';
  const steps = page?.steps || [
    { id: 1, icon: "bx bx-search-alt", title: "Profile Assessment", text: "We review your residency status, passport validity, and bank statement health to identify the best European consulate for your entry." },
    { id: 2, icon: "bx bx-file", title: "Document Prep", text: "We compile your cover letter, flight reservations, verified hotel vouchers, and Schengen-compliant travel insurance policy." },
    { id: 3, icon: "bx bx-calendar", title: "Appointment Booking", text: "We monitor slot availability daily and secure your biometric appointment at the corresponding VFS Global or TLS Contact center." },
    { id: 4, icon: "bx bx-badge-check", title: "Submission Brief", text: "We perform a detailed pre-submission run-through so you walk into your biometric slot with a 100% compliant documentation packet." }
  ];

  // Testimonials
  const testimonialsList = page?.testimonials || defaultTestimonials;

  // Form Section
  const formTitle = page?.formTitle || 'Schedule Your Profile Analysis';
  const formDesc = page?.formDesc || 'Fill out this form to connect with our senior travel access consultants. We will evaluate your profile and advise on VFS slot availability immediately.';
  const formDisclaimer = page?.formDisclaimer || 'Please Note: We assist with tourist, business, and transit entry clearances only. We do not cater to labor, work permit, or employment requests.';
  const packageName = page?.packageName || 'Schengen Tourist Appointment & Documentation';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    applicants: '1',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [responseMsg, setResponseMsg] = useState('');

  const formRef = useRef(null);

  useSEO({
    title: seoTitle,
    description: seoDescription,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': seoTitle,
      'description': seoDescription,
      'provider': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': contact.address || 'Business Bay',
          'addressLocality': 'Dubai',
          'addressCountry': 'AE'
        }
      }
    }
  });

  // If a custom URL slug is requested but doesn't exist in the database, redirect to home
  if (landingSlug && !page) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setResponseMsg('');

    const accessKey = contact.web3formsAccessKey || '';
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('error');
        setResponseMsg('Lead service key is not configured. Please complete configurations in the Admin Dashboard.');
      }, 1000);
      return;
    }

    const formElement = e.target;
    const data = new FormData(formElement);
    data.append('access_key', accessKey);
    data.append('subject', `Lead Query from ${activeSlug} Landing Page: ${formData.name} (${formData.applicants} Applicants)`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setResponseMsg('Thank you! Our Travel Access team will contact you shortly to start your profile assessment.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          applicants: '1',
          message: ''
        });
        formElement.reset();
      } else {
        setSubmitStatus('error');
        setResponseMsg(result.message || 'Something went wrong. Please check configurations.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setResponseMsg('Connection error. Please call us directly or use WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('consultation-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="schengen-landing-page">
      {/* Premium Hero Section */}
      <section className="schengen-hero">
        <div className="schengen-hero-overlay"></div>
        <div className="container schengen-hero-content">
          <span className="schengen-hero-tagline">{heroTagline}</span>
          <h1 className="schengen-hero-title" dangerouslySetInnerHTML={{ __html: heroTitle }} />
          <p className="schengen-hero-subtitle" dangerouslySetInnerHTML={{ __html: heroSubtitle }} />

          <div className="schengen-hero-ctas">
            <button onClick={scrollToForm} className="schengen-btn-primary">
              <i className="fa-solid fa-file-signature"></i> {heroBtnText}
            </button>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="schengen-btn-whatsapp"
            >
              <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
            </a>
            <a 
              href={`tel:${cleanPhone}`} 
              className="schengen-btn-phone"
            >
              <i className="fa-solid fa-phone-volume"></i> Call Now
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="schengen-hero-highlights">
            <div className="highlight-item">
              <span className="highlight-val">{clearanceRate}</span>
              <span className="highlight-lbl">Clearance Rate</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-val">{appointmentSupport}</span>
              <span className="highlight-lbl">Appointment Support</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-val">{insuranceLimit}</span>
              <span className="highlight-lbl">Compliant Insurance Included</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="schengen-why-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>{whySectionTitle}</h2>
            <p className="lead-text">{whySectionDesc}</p>
          </div>

          <div className="why-grid">
            {whyCards.map((card, idx) => (
              <div className="why-card" key={idx}>
                <div className="why-icon-wrap">
                  <i className={card.icon || "fa-solid fa-star"}></i>
                </div>
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Application Steps Section */}
      <section className="schengen-horizontal-steps-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="eg-tag animate-tag">{stepsSectionTag}</span>
            <h2>{stepsSectionTitle}</h2>
            <p className="lead-text">{stepsSectionDesc}</p>
          </div>

          <div className="horizontal-steps-wrapper">
            {/* Horizontal progress connector line (visible on desktop) */}
            <div className="horizontal-steps-line"></div>

            <div className="horizontal-steps-grid">
              {steps.map((step, idx) => (
                <div className="h-step-card" key={idx}>
                  <div className="h-step-badge">{idx + 1}</div>
                  <div className="h-step-icon-wrap">
                    <i className={step.icon || "bx bx-check"}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonialsList} visaEnabled={false} />

      {/* Lead Capture Web Form Section */}
      <section className="schengen-form-section" id="consultation-form-section">
        <div className="container form-section-grid">
          <div className="form-info-side">
            <h2>{formTitle}</h2>
            <p className="lead-text">{formDesc}</p>

            <div className="contact-methods">
              <div className="method-item">
                <div className="method-icon"><i className="fa-solid fa-phone"></i></div>
                <div>
                  <span>Direct Hotline</span>
                  <a href={`tel:${cleanPhone}`}>{displayPhone}</a>
                </div>
              </div>

              <div className="method-item">
                <div className="method-icon"><i className="fa-brands fa-whatsapp"></i></div>
                <div>
                  <span>Consult via WhatsApp</span>
                  <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click to Chat
                  </a>
                </div>
              </div>

              <div className="method-item">
                <div className="method-icon"><i className="fa-solid fa-location-dot"></i></div>
                <div>
                  <span>Our Dubai Office</span>
                  <p>{contact.address || 'Business Bay, Dubai, UAE'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-card-side">
            <h3>Request Callback</h3>
            <p className="form-disclaimer-text" style={{ fontSize: '12px', color: '#64748b', marginTop: '-15px', marginBottom: '20px', lineHeight: '1.4' }}>
              <strong>Please Note:</strong> {formDisclaimer}
            </p>
            
            {submitStatus === 'success' && (
              <div className="status-message success-message">
                <i className="fa-solid fa-circle-check"></i>
                <span>{responseMsg}</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="status-message error-message">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{responseMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} ref={formRef}>
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
              
              <div className="form-group-custom">
                <label>Selected Package</label>
                <input 
                  type="text" 
                  value={packageName} 
                  readOnly 
                  className="read-only-input"
                  name="selected_package"
                  style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="schengen-name">Full Name *</label>
                <input 
                  type="text" 
                  id="schengen-name" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="schengen-email">Email Address *</label>
                <input 
                  type="email" 
                  id="schengen-email" 
                  name="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="schengen-phone">Phone / WhatsApp Number *</label>
                <input 
                  type="tel" 
                  id="schengen-phone" 
                  name="phone" 
                  placeholder="+971 50 000 0000" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="schengen-applicants">Number of Applicants</label>
                <input 
                  type="number" 
                  id="schengen-applicants" 
                  name="applicants" 
                  min="1"
                  placeholder="1"
                  value={formData.applicants}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-custom">
                <label htmlFor="schengen-message">Message / Nationality Details</label>
                <textarea 
                  id="schengen-message" 
                  name="message" 
                  placeholder="Provide passport nationality and intended travel date..." 
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="schengen-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <About about={content.about} />

      {/* Floating CTA bar for mobile screens */}
      <div className="schengen-floating-cta-bar">
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn whatsapp"
        >
          <i className="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <a href={`tel:${cleanPhone}`} className="floating-btn phone">
          <i className="fa-solid fa-phone-volume"></i> Call Now
        </a>
      </div>
    </div>
  );
}
