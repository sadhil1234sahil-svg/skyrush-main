import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSlider({ sliders = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sliders.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 6000); // auto slide every 6 seconds
    return () => clearInterval(interval);
  }, [sliders]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const handleCtaClick = (e, slide) => {
    e.preventDefault();
    const btnTextLower = (slide.btnText || '').toLowerCase();
    const titleLower = (slide.title || '').toLowerCase();
    const isGuidance = btnTextLower.includes("guidance") || 
                       btnTextLower.includes("consultation") ||
                       titleLower.includes("visa");
    
    let title = "";
    if (isGuidance) {
      title = `Get Expert Guidance - ${slide.tag}`;
    } else {
      title = `Book ${slide.tag}`;
    }
    
    window.dispatchEvent(
      new CustomEvent('open-cta-modal', { detail: { title } })
    );
  };

  if (sliders.length === 0) return null;

  return (
    <section className="hero-wrap">
      <div className="hero-slider" style={{ position: 'relative', overflow: 'hidden', minHeight: '440px' }}>
        {sliders.map((slide, index) => (
          <div 
            key={slide.id || index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: index === currentSlide ? 'flex' : 'none'
            }}
          >
            <div className="hero-content">
              <div className="hero-tag">
                <i className="bx bx-map"></i> {slide.tag}
              </div>
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <div className="hero-bottom" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <a 
                  href="#" 
                  className="primary-btn1"
                  onClick={(e) => handleCtaClick(e, slide)}
                >
                  {slide.btnText}
                </a>
                {(() => {
                  if (slide.linkedItem) {
                    const parts = slide.linkedItem.split(':');
                    const type = parts[0];
                    const id = parts[1];
                    const linkUrl = type === 'tour' ? `/tours/${id}` : type === 'visa' ? `/visa/${id}` : null;
                    if (linkUrl) {
                      return (
                        <Link 
                          to={linkUrl}
                          style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff', 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.color = 'var(--navy)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                        >
                          Learn More <i className="bx bx-right-arrow-alt"></i>
                        </Link>
                      );
                    }
                  }
                  return null;
                })()}
                {slide.rating && (
                  <div className="hero-rating">
                    <span className="stars">★★★★★</span>
                    <span>{slide.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <button 
          className="hero-nav hero-prev" 
          type="button" 
          aria-label="Previous slide"
          onClick={handlePrev}
        >
          <i className="bx bx-chevron-left"></i>
        </button>
        <button 
          className="hero-nav hero-next" 
          type="button" 
          aria-label="Next slide"
          onClick={handleNext}
        >
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}
