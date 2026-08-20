import React from 'react';
import HeroSlider from '../components/HeroSlider';
import HomeSearchWidget from '../components/HomeSearchWidget';
import About from '../components/About';
import Packages from '../components/Packages';
import Visas from '../components/Visas';
import WhyChoose from '../components/WhyChoose';
import Deals from '../components/Deals';
import Testimonials from '../components/Testimonials';
import InstagramFeed from '../components/InstagramFeed';
import ContactSection from '../components/ContactSection';
import useSEO from '../hooks/useSEO';

export default function Home({ content = {}, currency, rates }) {
  const visaEnabled = content.visaEnabled !== false;

  useSEO({
    title: visaEnabled
      ? 'Skyrush Tourism | Premium Holiday Tours & Dubai Visa Consultancy Services'
      : 'Skyrush Tourism | Premium Holiday Tours & Travel Services',
    description: visaEnabled
      ? 'Embark on unforgettable holiday journeys and expert travel consultancy services with Skyrush Tourism Dubai. We are a private travel agency and visa consultancy offering global tour packages and documentation consulting.'
      : 'Embark on unforgettable holiday journeys and expert travel services with Skyrush Tourism Dubai. We are a private travel agency offering global tour packages.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      'name': 'Skyrush Tourism',
      'legalName': 'Skyrush Tourism',
      'description': visaEnabled
        ? 'Skyrush Tourism is a private, independent travel consultancy and tour organizing agency. We provide expert travel planning, tour packages, and visa documentation consultancy services. We are not affiliated with any government embassy or official immigration authority.'
        : 'Skyrush Tourism is a private, independent travel and tour organizing agency. We provide expert travel planning and tour packages. We are not affiliated with any government embassy or official authority.',
      'disambiguatingDescription': visaEnabled
        ? 'Private travel agency and visa documentation consultancy services provider in Dubai, UAE.'
        : 'Private travel agency and tour provider in Dubai, UAE.',
      'image': 'https://skyrushtourism.com/wp-content/uploads/2026/05/skyrush-removebg-preview.png',
      'telephone': content.contact?.phone || '+971 56 793 8033',
      'email': content.contact?.email || 'Info@skyrushtourism.com',
      'priceRange': '$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': content.contact?.address || 'B2B Office Tower - Office # 910 مراسي درايف - near Kana Cafe - الخليج التجاري',
        'addressLocality': 'Dubai',
        'addressCountry': 'AE'
      },
      'url': window.location.origin
    }
  });

  const filteredSliders = (content.sliders || []).filter(slide => {
    if (!visaEnabled) {
      const title = (slide.title || '').toLowerCase();
      const text = (slide.text || '').toLowerCase();
      const tag = (slide.tag || '').toLowerCase();
      const btnText = (slide.btnText || '').toLowerCase();
      return !title.includes('visa') && !text.includes('visa') && !tag.includes('visa') && !btnText.includes('visa');
    }
    return true;
  });

  // Gather dynamic offers from tours & visas where offerPrice is set
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
      accentColor: '#f05a24',
      btnText: 'Book Now'
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
      accentColor: '#10b981',
      btnText: 'Claim Offer'
    }));

  const dynamicOffers = visaEnabled ? [...tourOffers, ...visaOffers] : [...tourOffers];

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
      accentColor: '#f05a24',
      btnText: 'Discover Dubai'
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
      accentColor: '#0ea5e9',
      btnText: 'Book Now'
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
      accentColor: '#22c55e',
      btnText: 'View This Trip'
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
      accentColor: '#eab308',
      btnText: 'Book Now'
    }
  ];

  const filteredFallbackOffers = fallbackOffers.filter((o) => {
    if (!visaEnabled) {
      return o.type !== 'visa' && o.type !== 'combo' && !o.link.startsWith('/visa') && !o.title.toLowerCase().includes('visa');
    }
    return true;
  });

  const offers = dynamicOffers.length > 0 ? dynamicOffers : filteredFallbackOffers;
  const top4Offers = offers.slice(0, 4);

  return (
    <>
      <HeroSlider sliders={filteredSliders} />
      <HomeSearchWidget />
      <About about={content.about || {}} />
      <Packages tours={content.tours || []} limit={3} currency={currency} rates={rates} />
      {visaEnabled && <Visas visas={content.visas || []} currency={currency} rates={rates} />}
      <WhyChoose whyChoose={content.whyChoose || []} />
      <Deals deals={top4Offers} currency={currency} rates={rates} />
      <Testimonials testimonials={content.testimonials || []} visaEnabled={visaEnabled} />
      <InstagramFeed instagram={content.instagram} />
      <ContactSection contact={content.contact || {}} />
    </>
  );
}
