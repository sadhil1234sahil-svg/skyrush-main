import React from 'react';

export default function Deals({ deals = [] }) {
  const handleDealClick = (e, dealTitle) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-cta-modal', { 
        detail: { title: `Claim Deal: ${dealTitle}` } 
      })
    );
  };

  if (deals.length === 0) return null;

  return (
    <section className="deals-section section-padding">
      <div className="container">
        <div className="section-title-wrap">
          <span className="eg-tag">Hurry Up</span>
          <h2>Phenomenal Deals Offered</h2>
        </div>
        <div className="deals-grid">
          {deals.map((deal) => (
            <div 
              key={deal.id} 
              className={`deal-card ${deal.accent ? 'deal-accent' : ''}`}
              style={{ position: 'relative' }}
            >
              {deal.image && (
                <img className="bg" src={deal.image} alt={deal.category} />
              )}
              <div className="deal-content">
                <p>{deal.category}</p>
                <h3>{deal.title}</h3>
                {deal.subtitle && <p>{deal.subtitle}</p>}
                <a 
                  href="#" 
                  className={deal.accent ? "primary-btn1" : "outline-btn"}
                  style={!deal.accent && !deal.image ? { borderColor: '#fff', color: '#fff' } : {}}
                  onClick={(e) => handleDealClick(e, `${deal.category} - ${deal.title}`)}
                >
                  {deal.btnText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
