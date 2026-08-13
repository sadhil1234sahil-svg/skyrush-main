import React from 'react';

const getSourceIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('facebook') || cat.includes('fb')) {
    return <i className="bx bxl-facebook-circle review-icon fb"></i>;
  }
  if (cat.includes('google')) {
    return <i className="bx bxl-google review-icon google"></i>;
  }
  return <i className="bx bx-world review-icon tripadvisor"></i>;
};

function TestimonialCard({ review }) {
  return (
    <div className="testimonial-marquee-card">
      <div className="card-top-header">
        <div className="star-rating-block">
          <i className="bx bxs-star"></i>
          <i className="bx bxs-star"></i>
          <i className="bx bxs-star"></i>
          <i className="bx bxs-star"></i>
          <i className="bx bxs-star"></i>
        </div>
        
        <div className="source-badge">
          {getSourceIcon(review.category)}
          <span>Verified {review.category} Review</span>
        </div>
      </div>

      <p className="quote-text">
        "{review.quote}"
      </p>

      <div className="card-author-profile">
        <img src={review.avatar} alt={review.author} className="author-image" />
        <div className="author-details">
          <h4>{review.author}</h4>
          <span className="location-flag">
            <i className="bx bx-map-pin"></i> {review.location}
          </span>
        </div>
      </div>

      <div className="card-footer-meta">
        <span>{review.meta}</span>
      </div>
    </div>
  );
}

export default function Testimonials({ testimonials = [], visaEnabled = true }) {
  const filteredTestimonials = testimonials.filter(review => {
    if (!visaEnabled) {
      const quote = (review.quote || '').toLowerCase();
      const meta = (review.meta || '').toLowerCase();
      return !quote.includes('visa') && !meta.includes('visa');
    }
    return true;
  });

  if (!filteredTestimonials || filteredTestimonials.length === 0) return null;

  // Split testimonials into two groups for the two rows
  const row1 = filteredTestimonials.filter((_, idx) => idx % 2 === 0);
  const row2 = filteredTestimonials.filter((_, idx) => idx % 2 !== 0);

  return (
    <section className="testimonials-marquee-section section-padding">
      <div className="container">
        <div className="testimonials-header-center">
          <span className="eg-tag animate-tag">✨ CUSTOMER STORIES</span>
          <h2>Trusted by Travelers Worldwide</h2>
          <p className="subtitle">
            Discover why over 15,000+ adventurers, families, and {visaEnabled ? 'visa applicants ' : ''}trust Skyrush Tourism to complete their travel journeys.
          </p>
        </div>
      </div>

      <div className="testimonials-marquee-container">
        {/* Row 1: Scrolling Left */}
        <div className="marquee-row">
          <div className="marquee-content scroll-left">
            {row1.map((review) => (
              <TestimonialCard key={`r1-orig-${review.id}`} review={review} />
            ))}
            {row1.map((review) => (
              <TestimonialCard key={`r1-dup-${review.id}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="marquee-row">
          <div className="marquee-content scroll-right">
            {row2.map((review) => (
              <TestimonialCard key={`r2-orig-${review.id}`} review={review} />
            ))}
            {row2.map((review) => (
              <TestimonialCard key={`r2-dup-${review.id}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
