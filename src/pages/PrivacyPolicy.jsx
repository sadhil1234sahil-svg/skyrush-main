import React from 'react';
import useSEO from '../hooks/useSEO';

export default function PrivacyPolicy({ content = {} }) {
  const visaEnabled = content.visaEnabled !== false;

  useSEO({
    title: 'Privacy Policy | Skyrush Tourism',
    description: 'Privacy policy and data protection guidelines of Skyrush Tourism. Learn how we collect, use, and secure your personal travel information.'
  });

  return (
    <div>
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: June 19, 2026</p>
      </div>

      <div className="container" style={{ marginTop: '50px', marginBottom: '80px', maxWidth: '850px' }}>
        <div className="legal-content" style={{ fontFamily: 'var(--font-body)', color: 'var(--text)', lineHeight: '1.8' }}>
          <p style={{ fontSize: '16px', marginBottom: '30px' }}>
            At Skyrush Tourism, we are committed to protecting your privacy and security. This Privacy Policy outlines the types of information we collect, how we process it, and your rights concerning your personal data.
          </p>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              1. Information We Collect
            </h3>
            <p>
              We collect information that you provide directly to us when booking a tour{visaEnabled ? ', submitting a visa inquiry,' : ''} or subscribing to our newsletters. This may include:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li>Contact details (name, email address, telephone number)</li>
              {visaEnabled && <li>Passport information and national identity details for visa processing</li>}
              <li>Billing and payment information processed securely via our payment partners</li>
              <li>Travel preferences and booking details</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              2. How We Use Your Information
            </h3>
            <p>
              We process your personal information to deliver our services, specifically:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li>Processing bookings, travel itineraries{visaEnabled ? ', and tourist visas' : ''}</li>
              <li>Communicating with you regarding updates, inquiries, and customer support</li>
              <li>Complying with local government rules, airline policies, and immigration guidelines</li>
              <li>Improving our website performance and user experience</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              3. Cookies and Analytics
            </h3>
            <p>
              We use essential and functional cookies to remember your preferences (such as selected currency and interface interactions) and analyze site traffic. You can adjust your choices anytime through our Cookie Consent banner or your browser settings.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              4. Data Protection & Safety Measures
            </h3>
            <p>
              We enforce appropriate technical and organizational measures to safeguard your personal data against unauthorized access, loss, or alteration. All database updates and transactions run under strict SSL security layers.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              5. Contact Us
            </h3>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, please reach out to us at:
            </p>
            <p style={{ fontWeight: 600, color: 'var(--orange)' }}>
              Email: Info@skyrushtourism.com<br />
              Address: B2B Office Tower - Office # 910, Business Bay, Dubai, UAE
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
