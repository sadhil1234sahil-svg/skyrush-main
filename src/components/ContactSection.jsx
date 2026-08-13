import React, { useState } from 'react';

export default function ContactSection({ contact = {} }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [responseMsg, setResponseMsg] = useState('');

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
        setResponseMsg('Web3Forms Access Key is not configured yet. Please configure it in the Admin Portal under General Settings.');
      }, 1000);
      return;
    }

    const formElement = e.target;
    const data = new FormData(formElement);
    data.append('access_key', accessKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setResponseMsg('Thank you for contacting us! Our travel experts will get back to you shortly.');
        setFormData({ name: '', email: '', phone: '', message: '' });
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

  return (
    <div className="container" id="contact">
      <section className="contact-section">
        <div className="contact-grid">
          {/* Info Column */}
          <div className="contact-info-col">
            <h3>Contact Us</h3>
            <p className="lead-text">
              Have questions or want to customize your next dream trip? Get in touch with our travel experts today. We are here to guide you 24/7.
            </p>
            
            <div className="contact-method-card">
              <div className="contact-icon-wrapper">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <h5>Call Us Directly</h5>
                <p>
                  <a href={`tel:${contact.phoneCall || '+971567938033'}`} style={{ fontWeight: 700 }}>
                    {contact.phone || '+971 56 793 8033'}
                  </a>
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Available for Call &amp; WhatsApp
                </p>
              </div>
            </div>
            
            <div className="contact-method-card">
              <div className="contact-icon-wrapper">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h5>Email Support</h5>
                <p>
                  <a href={`mailto:${contact.email || 'Info@skyrushtourism.com'}`}>
                    {contact.email || 'Info@skyrushtourism.com'}
                  </a>
                </p>
              </div>
            </div>
            
            <div className="contact-method-card">
              <div className="contact-icon-wrapper">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h5>Our Office</h5>
                <p>
                  {contact.address || 'B2B Office Tower - Office # 910 مراسي درايف - near Kana Cafe - الخليج التجاري - دبي'}
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col">
            <h4>Send Us A Message</h4>
            
            {submitStatus === 'success' && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#047857',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '18px' }}></i>
                <span>{responseMsg}</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #ef4444',
                color: '#b91c1c',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '18px' }}></i>
                <span>{responseMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} id="mainContactForm">
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
              
              <div className="form-group">
                <label htmlFor="contact-name">Full Name *</label>
                <input 
                  type="text" 
                  id="contact-name" 
                  name="name" 
                  className="form-input" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    name="email" 
                    className="form-input" 
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="contact-phone" 
                    name="phone" 
                    className="form-input" 
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea 
                  id="contact-message" 
                  name="message" 
                  className="form-input" 
                  placeholder="Tell us about your travel plans..." 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="contact-form-submit"
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
