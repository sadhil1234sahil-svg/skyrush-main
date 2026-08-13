import React from 'react';

export default function Features({ features = [] }) {
  if (features.length === 0) return null;

  return (
    <section className="features">
      <div className="container">
        <div className="features-wrap">
          {features.map((feature, idx) => (
            <div key={idx} className="feature">
              <i className={feature.icon}></i>
              <div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
