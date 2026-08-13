import React, { useState, useEffect } from 'react';

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
              <div className="hero-bottom">
                <a 
                  href="#" 
                  className="primary-btn1"
                  onClick={(e) => handleCtaClick(e, slide)}
                >
                  {slide.btnText}
                </a>
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
