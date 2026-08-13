import React from 'react';
import ContactSection from '../components/ContactSection';
import useSEO from '../hooks/useSEO';

export default function ContactPage({ content = {} }) {
  const visaEnabled = content.visaEnabled !== false;

  useSEO({
    title: 'Contact Us | Skyrush Tourism Dubai Office Inquiries',
    description: `Get in touch with Skyrush Tourism located in Business Bay, Dubai. Call ${content.contact?.phone || '+971 56 793 8033'} or email ${content.contact?.email || 'info@skyrushtourism.com'} for bookings.`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      'name': 'Contact Skyrush Tourism',
      'mainEntity': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'telephone': content.contact?.phone || '+971 56 793 8033',
        'email': content.contact?.email || 'Info@skyrushtourism.com'
      }
    }
  });
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with our travel agents or stop by our office tower located in the heart of Dubai.</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <ContactSection contact={content.contact || {}} />
      </div>

      {/* Embed map and office hours info */}
      <div className="container" style={{ marginBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'stretch' }}>
          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(240, 90, 36, 0.1)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-clock" style={{ fontSize: '18px' }}></i>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Office Timings</h4>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                <strong>Monday - Saturday:</strong> 9:00 AM to 7:00 PM
              </p>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                <strong>Sunday:</strong> Closed (Support line active 24/7)
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(37, 211, 102, 0.1)', color: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '20px' }}></i>
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>WhatsApp Inquiries</h4>
              </div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: '0 0 15px 0' }}>
                Prefer to text? Message our travel advisory team directly on WhatsApp for instant support on {visaEnabled ? 'visa processing and custom tour planning.' : 'custom tour planning.'}
              </p>
              <a 
                href={`https://api.whatsapp.com/send/?phone=${(content.contact?.whatsapp || content.contact?.phoneCall || '+971567938033').replace(/[^\d]/g, '')}&text=${encodeURIComponent(content.contact?.whatsappMessage || 'Hello Skyrush Tourism, I need assistance regarding my travel plans.')}&type=phone_number&app_absent=0`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  backgroundColor: '#25d366', 
                  color: '#ffffff', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease, transform 0.1s ease',
                  width: 'fit-content'
                }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Google Location Map Column */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '360px' }}>
            <iframe 
              title="Skyrush Tourism LLC Location Map"
              src="https://maps.google.com/maps?q=Skyrush%20Tourism%20LLC%2C%20Business%20Bay%2C%20Dubai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: '10px', flex: 1, minHeight: '300px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px 4px 8px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-location-dot" style={{ color: 'var(--orange)' }}></i>
                Office #910, B2B Tower, Business Bay, Dubai
              </span>
              <a 
                href="https://share.google/rEQR3ab2hyFmby1cZ" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ fontSize: '13px', color: 'var(--orange)', fontWeight: 600, textDecoration: 'none' }}
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
