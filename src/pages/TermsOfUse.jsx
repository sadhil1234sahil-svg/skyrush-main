import React from 'react';
import useSEO from '../hooks/useSEO';

export default function TermsOfUse({ content = {} }) {
  const visaEnabled = content.visaEnabled !== false;
  let sectionNum = 2;

  useSEO({
    title: 'Terms of Use | Skyrush Tourism',
    description: 'Terms of use and service conditions of Skyrush Tourism. Read about our booking procedures, cancellations, and travel booking regulations.'
  });

  return (
    <div>
      <div className="page-header">
        <h1>Terms of Use</h1>
        <p>Last updated: June 19, 2026</p>
      </div>

      <div className="container" style={{ marginTop: '50px', marginBottom: '80px', maxWidth: '850px' }}>
        <div className="legal-content" style={{ fontFamily: 'var(--font-body)', color: 'var(--text)', lineHeight: '1.8' }}>
          <p style={{ fontSize: '16px', marginBottom: '30px' }}>
            Welcome to Skyrush Tourism. By accessing this website and booking our tour {visaEnabled ? 'or visa consultancy ' : ''}services, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              1. Bookings and Payments
            </h3>
            <p>
              All bookings requested via this platform are subject to availability and confirmation by our booking desk. 
              Prices shown on the website are indexed in UAE Dirhams (AED) and can be converted into USD or EUR for informational purposes. Final transactions are settled in the agreed currency upon booking confirmation.
            </p>
          </section>

          {visaEnabled && (
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
                {sectionNum++}. Visa Consultancy Services Disclaimer
              </h3>
              <p>
                Skyrush Tourism is a private travel consultancy and is not affiliated with any government agency, embassy, or official immigration authority. We offer professional visa consultation and documentation services. 
                We do not guarantee visa approval, as final decisions rest entirely with the respective government immigration authorities. Booking fees or deposits are non-refundable in case of visa rejection by government authorities.
              </p>
            </section>
          )}

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              {sectionNum++}. Currency Conversions
            </h3>
            <p>
              Currency conversion rates provided on our website are retrieved dynamically from the Frankfurter API. 
              These rates represent standard European Central Bank updates. Conversion tools are provided strictly for estimate purposes. Skyrush Tourism holds no liability for fluctuations or final discrepancies on bank settlements.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              {sectionNum++}. Cancellations and Refunds
            </h3>
            <p>
              Cancellation and refund policies vary depending on the tour operator, airline, and hotel provider. 
              Detailed rules will be shared on your booking itinerary. Any cancellation request must be submitted in writing to our support email.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h3 style={{ color: 'var(--navy)', fontWeight: 700, fontSize: '22px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px' }}>
              {sectionNum}. Governing Law
            </h3>
            <p>
              These terms are governed by and construed in accordance with the laws of the Emirate of Dubai and the Federal Laws of the United Arab Emirates.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
