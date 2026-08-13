import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOUR_TYPES = [
  { label: 'All Tour Types', value: '' },
  { label: 'Family Tours', value: 'Family' },
  { label: 'Romantic Packages', value: 'Romantic' },
  { label: 'Adventure Trips', value: 'Adventure' },
  { label: 'Luxury Stays', value: 'Luxury' },
  { label: 'Cultural Tours', value: 'Cultural' },
  { label: 'Honeymoon Specials', value: 'Honeymoon' },
  { label: 'Budget Friendly', value: 'Budget' }
];

const HOTEL_CATEGORIES = [
  { label: 'Any Hotel Rating', value: '' },
  { label: '⭐ 3-Star Hotel', value: '3-Star Hotel' },
  { label: '⭐ 4-Star Hotel', value: '4-Star Hotel' },
  { label: '⭐ 5-Star Luxury', value: '5-Star Luxury' },
  { label: '⭐ Boutique Stay', value: 'Boutique Stay' }
];

const BUDGET_TIERS = [
  { label: 'Any Budget Range', value: '' },
  { label: 'Under AED 2,500', value: 'under2500' },
  { label: 'AED 2,500 - AED 4,000', value: '2500-4000' },
  { label: 'Over AED 4,000', value: 'over4000' }
];

export default function HomeSearchWidget() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [tourType, setTourType] = useState('');
  const [hotelCat, setHotelCat] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.append('search', destination.trim());
    if (tourType) params.append('type', tourType);
    if (hotelCat) params.append('hotel', hotelCat);
    if (budget) params.append('budget', budget);

    const queryString = params.toString();
    navigate(`/tours${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="home-search-container">
      <div className="container">
        <form className="home-search-card" onSubmit={handleSearch}>
          <div className="search-card-header">
            <span className="search-badge">
              <i className="bx bx-compass"></i> FIND YOUR PERFECT GETAWAY
            </span>
            <span className="search-sub">Explore handpicked international tours &amp; custom itineraries</span>
          </div>

          <div className="home-search-grid">
            {/* Field 1: Destination / Keyword */}
            <div className="search-field-group">
              <label><i className="bx bx-map-pin"></i> Destination / Keyword</label>
              <input 
                type="text" 
                className="search-field-input" 
                placeholder="Where to? (e.g. Almaty, Yerevan...)" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            {/* Field 2: Tour Category */}
            <div className="search-field-group">
              <label><i className="bx bx-category-alt"></i> Tour Experience</label>
              <select 
                className="search-field-select" 
                value={tourType} 
                onChange={(e) => setTourType(e.target.value)}
              >
                {TOUR_TYPES.map((t) => (
                  <option key={t.label} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Field 3: Hotel Rating */}
            <div className="search-field-group">
              <label><i className="bx bx-hotel"></i> Hotel Category</label>
              <select 
                className="search-field-select" 
                value={hotelCat} 
                onChange={(e) => setHotelCat(e.target.value)}
              >
                {HOTEL_CATEGORIES.map((h) => (
                  <option key={h.label} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>

            {/* Field 4: Budget Range */}
            <div className="search-field-group">
              <label><i className="bx bx-wallet"></i> Budget Range</label>
              <select 
                className="search-field-select" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b.label} value={b.value}>{b.label}</option>
                ))}
              </select>
            </div>

            {/* Field 5: Submit Button */}
            <div className="search-submit-group">
              <button type="submit" className="home-search-btn">
                <i className="bx bx-search-alt-2"></i>
                <span>SEARCH TOURS</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
