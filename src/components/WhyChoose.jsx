import React from 'react';

export default function WhyChoose({ whyChoose = [] }) {
  if (whyChoose.length === 0) return null;

  return (
    <section className="section-padding" style={{ background: '#fff' }}>
      <div className="container">
        <div className="section-title-wrap">
          <span className="eg-tag">Our Success</span>
          <h2>Why Choose Skyrush Tourism</h2>
        </div>
        <div className="features-grid">
          {whyChoose.map((item, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon">
                <i className={item.icon}></i>
              </div>
              <h6>{item.title}</h6>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
