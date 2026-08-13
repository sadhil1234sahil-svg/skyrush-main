import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

// Helper to format countdown values
const formatTimeNumber = (num) => String(num).padStart(2, '0');

export default function OffersPage({ content = {}, currency, rates }) {
  const visaEnabled = content.visaEnabled !== false;

  // 1. Gather dynamic offers from tours & visas where offerPrice is set
  const tourOffers = (content.tours || [])
    .filter((t) => t.offerPrice && String(t.offerPrice).trim() !== '')
    .map((t) => ({
      id: `tour-${t.id}`,
      type: 'tour',
      title: t.title,
      category: t.tourType ? `${t.tourType} Tour` : 'Tour Package',
      regularPrice: t.price,
      offerPrice: t.offerPrice,
      image: t.image,
      details: t.duration,
      location: t.location || t.country,
      link: `/tours/${t.id}`,
      badge: '🔥 TOUR DEAL',
      icon: 'bx-globe',
      accentColor: '#f05a24'
    }));

  const visaOffers = (content.visas || [])
    .filter((v) => v.offerPrice && String(v.offerPrice).trim() !== '')
    .map((v) => ({
      id: `visa-${v.id}`,
      type: 'visa',
      title: v.title,
      category: v.type || 'Visa Consultancy',
      regularPrice: v.price,
      offerPrice: v.offerPrice,
      image: v.image,
      details: v.stay,
      location: v.countryTo || v.country || 'Global',
      link: `/visa/${v.id}`,
      badge: '🇪🇺 VISA DEAL',
      icon: 'bx-shield-quarter',
      accentColor: '#10b981'
    }));

  // Combined active offers
  const dynamicOffers = visaEnabled ? [...tourOffers, ...visaOffers] : [...tourOffers];

  // 2. Fallback default offers if no dynamic offer prices are entered
  const fallbackOffers = [
    {
      id: 'fallback-1',
      type: 'combo',
      title: 'UAE Tourist Visa + Dubai Desert Safari Combo',
      category: 'Combo Bundle',
      regularPrice: 'د.إ799',
      offerPrice: 'د.إ620',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      details: '30 Days Visa + Safari Tour',
      location: 'Dubai, UAE',
      link: '/visa/1',
      badge: '✨ POPULAR COMBO',
      icon: 'bx-layer',
      accentColor: '#f05a24'
    },
    {
      id: 'fallback-2',
      type: 'tour',
      title: 'Fixed Departure Discount - Armenia Winter Tour',
      category: 'Group Departure',
      regularPrice: 'د.إ4,200',
      offerPrice: 'د.إ3,850',
      image: '/Armenia_hero_1.jpg',
      details: '5 Days - 4 Nights',
      location: 'Yerevan, Armenia',
      link: '/tours/1',
      badge: '✈️ GROUP SPECIAL',
      icon: 'bx-globe',
      accentColor: '#0ea5e9'
    },
    {
      id: 'fallback-3',
      type: 'visa',
      title: 'Premium Schengen Visa Document Guidance',
      category: 'Visa Advisory',
      regularPrice: 'د.إ600',
      offerPrice: 'د.إ480',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      details: 'VFS Appointment Support',
      location: 'Europe, Schengen',
      link: '/visa/2',
      badge: '🇪🇺 BEST SELLER',
      icon: 'bx-shield-quarter',
      accentColor: '#22c55e'
    },
    {
      id: 'fallback-4',
      type: 'tour',
      title: 'Almaty Kazakhstan Tour Package - New Year Offer',
      category: 'Adventure Tour',
      regularPrice: 'د.إ3,400',
      offerPrice: 'د.إ2,999',
      image: '/Kazakhstan_hero_3.jpg',
      details: '5 Days - 4 Nights',
      location: 'Almaty, Kazakhstan',
      link: '/tours/1',
      badge: '🌟 NEW YEAR SPECIAL',
      icon: 'bx-crown',
      accentColor: '#eab308'
    }
  ];

  const filteredFallbackOffers = fallbackOffers.filter((o) => {
    if (!visaEnabled) {
      return o.type !== 'visa' && o.type !== 'combo' && !o.link.startsWith('/visa') && !o.title.toLowerCase().includes('visa');
    }
    return true;
  });

  const offers = dynamicOffers.length > 0 ? dynamicOffers : filteredFallbackOffers;

  // 3. Setup dynamic countdown timers for each active offer card
  const getOfferDuration = (id) => {
    const hash = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate duration between 12 and 48 hours
    const hours = (hash % 36) + 12;
    return hours * 60 * 60;
  };

  const [timers, setTimers] = useState(() => {
    const initialTimers = {};
    offers.forEach((o) => {
      initialTimers[o.id] = getOfferDuration(o.id);
    });
    return initialTimers;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        let updated = false;
        offers.forEach((o) => {
          if (next[o.id] === undefined) {
            next[o.id] = getOfferDuration(o.id);
            updated = true;
          }
          if (next[o.id] > 0) {
            next[o.id] -= 1;
            updated = true;
          } else {
            // reset timer to keep it active
            next[o.id] = getOfferDuration(o.id);
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [offers]);

  const getFormattedTime = (secondsLeft = 0) => {
    const days = Math.floor(secondsLeft / (24 * 3600));
    const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = Math.floor(secondsLeft % 60);

    return {
      days: formatTimeNumber(days),
      hours: formatTimeNumber(hours),
      minutes: formatTimeNumber(minutes),
      seconds: formatTimeNumber(seconds)
    };
  };

  useSEO({
    title: visaEnabled
      ? 'Exclusive Deals & Holiday Offers | Skyrush Tourism'
      : 'Exclusive Deals & Holiday Offers | Skyrush Tourism',
    description: visaEnabled
      ? 'Save big on your next journey. Check out our premium holiday package deals, visa consultancy discounts, and combi-offers at Skyrush Tourism.'
      : 'Save big on your next journey. Check out our premium holiday package deals and promotional offers at Skyrush Tourism.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'SpecialAnnouncement',
      'name': 'Skyrush Tourism Travel Deals & Promo Offers',
      'description': visaEnabled
        ? 'Exclusive seasonal discounts, bundle packages, and consultancy services specials.'
        : 'Exclusive seasonal discounts and bundle packages.',
      'url': window.location.origin + '/offers',
      'publisher': {
        '@type': 'TravelAgency',
        'name': 'Skyrush Tourism',
        'url': 'https://skyrushtourism.com'
      }
    }
  });

  return (
    <div className="offers-premium-page">
      {/* Hero Header Section */}
      <div className="offers-hero-section">
        <div className="container">
          <div className="offers-hero-content">
            <span className="eg-tag animate-tag">🎁 UNBEATABLE CAMPAIGNS &amp; SAVINGS</span>
            <h1>{visaEnabled ? 'Unlock Premium Holiday &amp; Visa Offers' : 'Unlock Premium Holiday Offers'}</h1>
            <p className="hero-subtext">
              {visaEnabled
                ? 'Grab handpicked seasonal travel bundle packages, document consult discounts, and exclusive group tour incentives. Act fast before the countdown expires!'
                : 'Grab handpicked seasonal travel bundle packages, exclusive group tour incentives, and early bird discounts. Act fast before the countdown expires!'}
            </p>
          </div>
        </div>
      </div>

      {/* Pinterest-Inspired Masonry Grid Section */}
      <div className="container" style={{ marginTop: '60px', marginBottom: '80px' }}>
        <div className="pinterest-masonry">
          {offers.map((offer, index) => {
            const time = getFormattedTime(timers[offer.id] || getOfferDuration(offer.id));
            const pctOff = calculateDiscountPercentage(offer.regularPrice, offer.offerPrice);
            // Dynamic card image heights to create organic Pinterest masonry flow
            const imgHeight = index % 4 === 0 ? '190px' : index % 4 === 1 ? '270px' : index % 4 === 2 ? '230px' : '310px';

            return (
              <div key={offer.id} className="pinterest-item">
                <article className="pinterest-card">
                  {/* Card Image Cover & Badges */}
                  <div className="pinterest-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      style={{ width: '100%', height: imgHeight, objectFit: 'cover', display: 'block' }}
                    />
                    <div className="pinterest-badge-ribbon" style={{ backgroundColor: offer.accentColor }}>
                      {offer.badge}
                    </div>
                    {pctOff > 0 && (
                      <div className="pinterest-discount-badge">
                        {pctOff}% OFF
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="pinterest-card-body">
                    <span className="pinterest-category" style={{ color: offer.accentColor }}>
                      {offer.category}
                    </span>
                    <h3 className="pinterest-title">
                      <Link to={offer.link}>{offer.title}</Link>
                    </h3>
                    
                    <div className="pinterest-info-row">
                      <span><i className="bx bx-map"></i> {offer.location}</span>
                      {offer.details && <span><i className="bx bx-time"></i> {offer.details}</span>}
                    </div>

                    {/* Countdown Timer Grid inside card */}
                    <div className="pinterest-timer-block">
                      <span className="timer-label"><i className="bx bx-time-five"></i> Ends In:</span>
                      <div className="timer-grid">
                        <div className="timer-unit">
                          <span className="unit-number">{time.hours}</span>
                          <span className="unit-label">Hrs</span>
                        </div>
                        <div className="timer-colon">:</div>
                        <div className="timer-unit">
                          <span className="unit-number">{time.minutes}</span>
                          <span className="unit-label">Mins</span>
                        </div>
                        <div className="timer-colon">:</div>
                        <div className="timer-unit">
                          <span className="unit-number">{time.seconds}</span>
                          <span className="unit-label">Secs</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action Row */}
                    <div className="pinterest-price-block">
                      <div className="pinterest-price-pricing">
                        <span className="pinterest-original-price">{formatPrice(offer.regularPrice, currency, rates)}</span>
                        <span className="pinterest-special-price" style={{ color: offer.accentColor }}>
                          {formatPrice(offer.offerPrice, currency, rates)}
                        </span>
                      </div>
                      <Link 
                        to={offer.link} 
                        className="pinterest-action-btn"
                        style={{
                          background: `linear-gradient(135deg, ${offer.accentColor} 0%, #ff7e5f 100%)`, 
                          boxShadow: `0 4px 10px rgba(240, 90, 36, 0.15)`
                        }}
                      >
                        Claim <i className="bx bx-chevron-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded CSS specific to Pinterest masonry & premium Visuals */}
      <style>{`
        .offers-premium-page {
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .offers-hero-section {
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          padding: 80px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          border-bottom: 2px solid rgba(240, 90, 36, 0.25);
        }

        .offers-hero-section::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240, 90, 36, 0.15) 0%, transparent 70%);
          top: -100px;
          right: -50px;
        }

        .offers-hero-section::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
          bottom: -150px;
          left: -50px;
        }

        .offers-hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .offers-hero-content h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 42px;
          font-weight: 800;
          margin: 16px 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .offers-hero-content .hero-subtext {
          font-size: 16px;
          color: #94a3b8;
          line-height: 1.6;
        }

        /* Pinterest Masonry Layout */
        .pinterest-masonry {
          column-count: 3;
          column-gap: 24px;
          width: 100%;
        }

        @media (max-width: 991px) {
          .pinterest-masonry {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .pinterest-masonry {
            column-count: 1;
          }
        }

        .pinterest-item {
          break-inside: avoid;
          margin-bottom: 24px;
        }

        .pinterest-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.03);
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .pinterest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
          border-color: rgba(240, 90, 36, 0.2);
        }

        .pinterest-badge-ribbon {
          position: absolute;
          top: 12px;
          left: 12px;
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 8px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .pinterest-discount-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: linear-gradient(135deg, #ef4444 0%, #ff7e5f 100%);
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
          animation: pulse-glow-offer-sub 2s infinite alternate;
        }

        @keyframes pulse-glow-offer-sub {
          0% {
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
          }
          100% {
            box-shadow: 0 4px 18px rgba(239, 68, 68, 0.55);
            transform: scale(1.04);
          }
        }

        .pinterest-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .pinterest-category {
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .pinterest-title {
          font-family: 'Poppins', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.35;
        }

        .pinterest-title a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .pinterest-title a:hover {
          color: var(--orange);
        }

        .pinterest-info-row {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 15px;
          font-weight: 600;
          flex-wrap: wrap;
        }

        .pinterest-info-row span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .pinterest-timer-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 8px 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pinterest-timer-block .timer-label {
          font-family: 'Roboto', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
        }

        .pinterest-timer-block .timer-grid {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .pinterest-timer-block .timer-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 26px;
        }

        .pinterest-timer-block .unit-number {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
        }

        .pinterest-timer-block .unit-label {
          font-size: 7px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .pinterest-timer-block .timer-colon {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 800;
          color: #cbd5e1;
        }

        .pinterest-price-block {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .pinterest-price-pricing {
          display: flex;
          flex-direction: column;
        }

        .pinterest-original-price {
          font-size: 11px;
          text-decoration: line-through;
          color: #94a3b8;
          font-weight: 600;
          line-height: 1.2;
        }

        .pinterest-special-price {
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
        }

        .pinterest-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 20px;
          color: #ffffff !important;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 11px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .pinterest-action-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        @media (max-width: 768px) {
          .offers-hero-content h1 {
            font-size: 32px;
          }
          .offers-hero-section {
            padding: 50px 0;
          }
        }
      `}</style>
    </div>
  );
}
