import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { formatPrice, calculateDiscountPercentage } from '../utils/currency';

const TOUR_TYPES = [
  { label: 'All Types', value: '', icon: 'bx-grid-alt' },
  { label: 'Family', value: 'Family', icon: 'bx-group' },
  { label: 'Romantic', value: 'Romantic', icon: 'bx-heart' },
  { label: 'Adventure', value: 'Adventure', icon: 'bx-compass' },
  { label: 'Luxury', value: 'Luxury', icon: 'bx-crown' },
  { label: 'Cultural', value: 'Cultural', icon: 'bx-landscape' },
  { label: 'Honeymoon', value: 'Honeymoon', icon: 'bx-gift' },
  { label: 'Budget', value: 'Budget', icon: 'bx-wallet' }
];

export default function Tours({ content = {}, currency, rates }) {
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [tourTypeFilter, setTourTypeFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [priceSort, setPriceSort] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has('search')) setSearch(params.get('search'));
    if (params.has('type')) setTourTypeFilter(params.get('type'));
    if (params.has('hotel')) setHotelFilter(params.get('hotel'));
    if (params.has('budget')) setBudgetFilter(params.get('budget'));
  }, [location.search]);

  const tours = content.tours || [];

  useSEO({
    title: 'Holiday Packages & International Tours | Skyrush Tourism',
    description: 'Explore our handpicked international holiday deals and vacation packages. Adventure, luxury, and family tour packages with top destinations globally.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Explore International Holiday Tours',
      'itemListElement': tours.map((tour, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `${window.location.origin}/tours/${tour.id}`,
        'name': tour.title
      }))
    }
  });

  // Parse numerical price for sorting & budget filtering (e.g., "د.إ3,400" -> 3400)
  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const isFiltered = search || tourTypeFilter || hotelFilter || budgetFilter || durationFilter || countryFilter || priceSort;

  const resetFilters = () => {
    setSearch('');
    setTourTypeFilter('');
    setHotelFilter('');
    setBudgetFilter('');
    setDurationFilter('');
    setCountryFilter('');
    setPriceSort('');
  };

  // Filtered and sorted list
  const filteredTours = tours
    .filter((tour) => {
      const matchSearch = !search || 
        tour.title.toLowerCase().includes(search.toLowerCase()) || 
        tour.location.toLowerCase().includes(search.toLowerCase()) ||
        (tour.overview && tour.overview.toLowerCase().includes(search.toLowerCase()));

      const matchTourType = !tourTypeFilter || (tour.tourType && tour.tourType.toLowerCase() === tourTypeFilter.toLowerCase());

      const matchHotel = !hotelFilter || (tour.hotelCategory && tour.hotelCategory.toLowerCase().includes(hotelFilter.toLowerCase()));

      const price = getNumericPrice(tour.price);
      let matchBudget = true;
      if (budgetFilter === 'under-3000') matchBudget = price < 3000;
      else if (budgetFilter === '3000-5000') matchBudget = price >= 3000 && price <= 5000;
      else if (budgetFilter === 'above-5000') matchBudget = price > 5000;

      const matchDuration = !durationFilter || tour.duration.toLowerCase().includes(durationFilter.toLowerCase());
      const matchCountry = !countryFilter || tour.country.toLowerCase().includes(countryFilter.toLowerCase());

      return matchSearch && matchTourType && matchHotel && matchBudget && matchDuration && matchCountry;
    })
    .sort((a, b) => {
      if (priceSort === 'low-to-high') {
        return getNumericPrice(a.price) - getNumericPrice(b.price);
      } else if (priceSort === 'high-to-low') {
        return getNumericPrice(b.price) - getNumericPrice(a.price);
      }
      return 0;
    });

  const handleBookClick = (e, tourTitle) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent('open-cta-modal', { detail: { title: `Book ${tourTitle}` } })
    );
  };

  return (
    <div>
      <div className="page-header tours-hero-header">
        <div className="container">
          <span className="eg-tag animate-tag">✨ Handpicked Getaways</span>
          <h1>International Tour Packages</h1>
          <p>Filter by experience, hotel star rating, budget, and destination to discover your perfect getaway.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '40px', marginBottom: '60px' }}>
        
        {/* Modern Interactive Filter Card */}
        <div className="tours-filter-card">
          <div className="filter-card-header">
            <div className="search-input-wrapper">
              <i className="bx bx-search search-icon"></i>
              <input 
                type="text" 
                className="tours-search-input" 
                placeholder="Search packages, destinations (e.g. Almaty, Yerevan, Greece)..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              {search && (
                <button type="button" className="clear-search-btn" onClick={() => setSearch('')}>
                  <i className="bx bx-x"></i>
                </button>
              )}
            </div>

            <div className="filter-header-actions">
              <span className="results-count-badge">
                <i className="bx bx-package"></i> {filteredTours.length} {filteredTours.length === 1 ? 'Package' : 'Packages'} Available
              </span>
              {isFiltered && (
                <button type="button" className="reset-filters-btn" onClick={resetFilters}>
                  <i className="bx bx-refresh"></i> Reset All
                </button>
              )}
            </div>
          </div>

          {/* Category Type Chips */}
          <div className="tour-chips-wrapper">
            <span className="chips-label">Tour Type:</span>
            <div className="tour-type-chips">
              {TOUR_TYPES.map((type) => (
                <button
                  key={type.label}
                  type="button"
                  className={`chip-btn ${tourTypeFilter === type.value ? 'active' : ''}`}
                  onClick={() => setTourTypeFilter(tourTypeFilter === type.value && type.value !== '' ? '' : type.value)}
                >
                  <i className={`bx ${type.icon}`}></i>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Dropdown Filter Grid */}
          <div className="tours-dropdowns-grid">
            <div className="filter-select-group">
              <label><i className="bx bx-hotel"></i> Hotel Category</label>
              <select 
                className="tours-filter-select"
                value={hotelFilter} 
                onChange={(e) => setHotelFilter(e.target.value)}
              >
                <option value="">All Hotel Categories</option>
                <option value="3-Star">3-Star Hotel</option>
                <option value="4-Star">4-Star Hotel</option>
                <option value="5-Star">5-Star Luxury</option>
                <option value="Boutique">Boutique Stay</option>
                <option value="Resort">Resort</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label><i className="bx bx-wallet"></i> Budget Range</label>
              <select 
                className="tours-filter-select"
                value={budgetFilter} 
                onChange={(e) => setBudgetFilter(e.target.value)}
              >
                <option value="">All Budgets</option>
                <option value="under-3000">Under AED 3,000</option>
                <option value="3000-5000">AED 3,000 - AED 5,000</option>
                <option value="above-5000">Above AED 5,000</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label><i className="bx bx-time-five"></i> Duration</label>
              <select 
                className="tours-filter-select"
                value={durationFilter} 
                onChange={(e) => setDurationFilter(e.target.value)}
              >
                <option value="">All Durations</option>
                <option value="4 Days">4 Days</option>
                <option value="5 Days">5 Days</option>
                <option value="6 Days">6 Days</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label><i className="bx bx-globe"></i> Destination Country</label>
              <select 
                className="tours-filter-select"
                value={countryFilter} 
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">All Countries</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Armenia">Armenia</option>
                <option value="Greece">Greece</option>
                <option value="Singapore">Singapore</option>
                <option value="Thailand">Thailand</option>
                <option value="Egypt">Egypt</option>
              </select>
            </div>

            <div className="filter-select-group">
              <label><i className="bx bx-sort"></i> Sort Price</label>
              <select 
                className="tours-filter-select"
                value={priceSort} 
                onChange={(e) => setPriceSort(e.target.value)}
              >
                <option value="">Default Sorting</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {filteredTours.length > 0 ? (
          <div className="packages-grid">
            {filteredTours.map((tour) => (
              <article className="package-card" key={tour.id}>
                <Link to={`/tours/${tour.id}`} className="package-img">
                  <img src={tour.image} alt={tour.title} />
                  <div className="package-badge">
                    <span className="duration"><i className="bx bx-time"></i> {tour.duration}</span>
                    <span className="location"><i className="bx bx-map-pin"></i> {tour.location}</span>
                  </div>
                  
                  {/* Category Pill Badges on Card Image */}
                  <div className="card-top-badges">
                    {tour.tourType && (
                      <span className="card-badge tour-type-pill">
                        <i className="bx bx-purchase-tag-alt"></i> {tour.tourType}
                      </span>
                    )}
                    {tour.hotelCategory && (
                      <span className="card-badge hotel-cat-pill">
                        <i className="bx bxs-star"></i> {tour.hotelCategory}
                      </span>
                    )}
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
        ) : (
          <div className="no-tours-found">
            <i className="bx bx-search-alt"></i>
            <h3>No Tour Packages Found</h3>
            <p>We couldn't find any tour packages matching your selected filters.</p>
            <button type="button" className="primary-btn2" onClick={resetFilters} style={{ marginTop: '16px' }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

