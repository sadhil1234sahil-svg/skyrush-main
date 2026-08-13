import React, { useState, useEffect } from 'react';

export default function CtaModal({ contact = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Book Your Trip');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail && e.detail.title) {
        setTitle(e.detail.title);
      }
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-cta-modal', handleOpen);
    return () => {
      window.removeEventListener('open-cta-modal', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const accessKey = contact.web3formsAccessKey || '';
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      setTimeout(() => {
        setIsSubmitting(false);
        alert(`Thank you, ${formData.name}! Your request for "${title}" has been submitted successfully.`);
        setFormData({ name: '', email: '', phone: '' });
        handleClose();
      }, 1000);
      return;
    }

    const formElement = e.target;
    const data = new FormData(formElement);
    data.append('access_key', accessKey);
    data.append('subject', `Skyrush Inquiry: ${title}`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (result.success) {
        alert(`Thank you, ${formData.name}! Your request for "${title}" has been submitted successfully.`);
        setFormData({ name: '', email: '', phone: '' });
        formElement.reset();
        handleClose();
      } else {
        alert(result.message || 'Something went wrong. Please check your Web3Forms access key.');
      }
    } catch (error) {
      alert('Unable to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal when pressing escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`cf7-popup-modal ${isOpen ? 'show' : ''}`} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modalTitle"
    >
      <div className="cf7-popup-overlay" onClick={handleClose}></div>
      <div className="cf7-popup-content">
        <span className="cf7-popup-close" onClick={handleClose}>&times;</span>
        <h3 id="modalTitle" className="cf7-popup-title">{title}</h3>
        
        <div role="form" className="wpcf7">
          <form onSubmit={handleSubmit} className="wpcf7-form">
            {/* Anti-spam honeypot */}
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <span className="wpcf7-form-control-wrap">
              <input 
                type="text" 
                name="Package_Name" 
                className="wpcf7-form-control wpcf7-text" 
                value={title} 
                readOnly 
                style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1', cursor: 'not-allowed', color: '#0f172a', fontWeight: 600, marginBottom: '12px' }}
              />
            </span>

            <span className="wpcf7-form-control-wrap">
              <input 
                type="text" 
                name="name" 
                className="wpcf7-form-control wpcf7-text wpcf7-validates-as-required" 
                placeholder="Your Name *" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </span>
            <span className="wpcf7-form-control-wrap">
              <input 
                type="email" 
                name="email" 
                className="wpcf7-form-control wpcf7-text wpcf7-email wpcf7-validates-as-required" 
                placeholder="Your Email *" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </span>
            <span className="wpcf7-form-control-wrap">
              <input 
                type="tel" 
                name="phone" 
                className="wpcf7-form-control wpcf7-text wpcf7-tel wpcf7-validates-as-required" 
                placeholder="Phone Number *" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </span>
            <input 
              type="submit" 
              value={isSubmitting ? "Submitting..." : "Submit Request"} 
              className="wpcf7-form-control wpcf7-submit" 
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            />
          </form>
        </div>

        <div className="cf7-popup-phone-fallback">
          <span className="cf7-fallback-title">Hate Forms! call us now.</span>
          <a href={`tel:${contact.phoneCall || '+971567938033'}`} className="cf7-fallback-phone">
            <i className="fa-solid fa-phone"></i> phone number - {contact.phone || '+971 56 793 8033'}
          </a>
        </div>
      </div>
    </div>
  );
}
