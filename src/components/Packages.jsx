import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

export default function Packages({ tours = [], limit, currency, rates }) {
  const displayedTours = limit ? tours.slice(0, limit) : tours;

  const handleBookClick = (e, tourTitle) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-cta-modal', { 
        detail: { title: `Book: ${tourTitle}` } 
      })
    );
  };

  if (tours.length === 0) return null;

  return (
    <section className="packages-section section-padding">
      <div className="container">
        <div className="section-title-wrap">
          <span className="eg-tag">Tour Experience</span>
          <h2>Ultimate Travel Experience</h2>
        </div>
        <div className="packages-grid">
          {displayedTours.map((tour) => (
            <article className="package-card" key={tour.id}>
              <Link to={`/tours/${tour.id}`} className="package-img">
                <img src={tour.image} alt={tour.title} />
                <div className="package-badge">
                  <span className="duration">{tour.duration}</span>
                  <span className="location">{tour.location}</span>
                </div>
              </Link>
              <div className="package-body">
                <h5>
                  <Link to={`/tours/${tour.id}`}>{tour.title}</Link>
                </h5>
                <div className="package-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div className="price-block" style={{ width: '100%' }}>
                      <h6>Starting From:</h6>
                      {tour.offerPrice && String(tour.offerPrice).trim() !== '' ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="price" style={{ color: 'var(--orange)', fontWeight: 800, fontSize: '20px' }}>
                            {formatPrice(tour.offerPrice, currency, rates)}
                          </span>
                          <span className="original-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
                            {formatPrice(tour.price, currency, rates)}
                          </span>
                          <span className="discount-tag" style={{ background: '#ef4444', color: '#ffffff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                            {calculateDiscountPercentage(tour.price, tour.offerPrice)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="price">{formatPrice(tour.price, currency, rates)}</span>
                      )}
                      <p className="tax" style={{ margin: 0 }}>TAXES INCL/PERS</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
                    <Link 
                      to={`/tours/${tour.id}`} 
                      className="outline-btn" 
                      style={{ padding: '10px 14px', fontSize: '13px', justifyContent: 'center', whiteSpace: 'nowrap' }}
                    >
                      View Details
                    </Link>
                    <a 
                      href="#" 
                      className="primary-btn2"
                      onClick={(e) => handleBookClick(e, tour.title)}
                      style={{ padding: '10px 14px', fontSize: '13px', justifyContent: 'center', whiteSpace: 'nowrap' }}
                    >
                      Book A Trip
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
