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

  return (
    <>
      <HeroSlider sliders={filteredSliders} />
      <HomeSearchWidget />
      <About about={content.about || {}} />
      <Packages tours={content.tours || []} limit={3} currency={currency} rates={rates} />
      {visaEnabled && <Visas visas={content.visas || []} currency={currency} rates={rates} />}
      <WhyChoose whyChoose={content.whyChoose || []} />
      <Deals deals={content.deals || []} />
      <Testimonials testimonials={content.testimonials || []} visaEnabled={visaEnabled} />
      <InstagramFeed instagram={content.instagram} />
      <ContactSection contact={content.contact || {}} />
    </>
  );
}
