import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

export default function Deals({ deals = [], currency, rates }) {
  if (deals.length === 0) return null;

  return (
    <section className="deals-section section-padding">
      <div className="container">
        <div className="section-title-wrap">
          <span className="eg-tag">Hurry Up</span>
          <h2>Phenomenal Deals Offered</h2>
        </div>
        <div className="deals-grid">
          {deals.slice(0, 4).map((deal) => {
            const pctOff = calculateDiscountPercentage(deal.regularPrice, deal.offerPrice);
            const originalPriceFormatted = formatPrice(deal.regularPrice, currency, rates);
            const offerPriceFormatted = formatPrice(deal.offerPrice, currency, rates);

            return (
              <div 
                key={deal.id} 
                className="deal-card deal-accent"
                style={{ position: 'relative' }}
              >
                {deal.image && (
                  <img className="bg" src={deal.image} alt={deal.category} />
                )}
                <p className="deal-category-top">{deal.category}</p>
                <div className="deal-content">
                  <h3>{deal.title ? deal.title.trim() : ''}</h3>
                  <p style={{ fontWeight: '700', fontSize: '15px', color: '#cbd5e1', textDecoration: 'line-through', marginBottom: '4px' }}>
                    Original: {originalPriceFormatted}
                  </p>
                  <p style={{ fontWeight: '800', fontSize: '22px', color: '#ff7e5f', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {offerPriceFormatted}
                    {pctOff > 0 && (
                      <span style={{ fontSize: '11px', fontWeight: '900', color: '#ffffff', background: '#ef4444', padding: '3px 8px', borderRadius: '12px', letterSpacing: '0.5px' }}>
                        {pctOff}% OFF
                      </span>
                    )}
                  </p>
                  <Link 
                    to={deal.link} 
                    className="primary-btn1"
                  >
                    {deal.btnText || 'Book Now'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
