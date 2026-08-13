import React from 'react';

const placeholderPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Sunset skyline views over Downtown Dubai ✨🏙️ #SkyRushTravel #DubaiMagic',
    likes: '2.4k',
    comments: '184',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Floating above Cappadocia at sunrise 🎈🌅 #SkyRushMemories #BucketList',
    likes: '3.1k',
    comments: '215',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Paradise found in the Maldives overwater villas 🏝️🌊 #MaldivesEscape #SkyRush',
    likes: '4.8k',
    comments: '340',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Golden hour moments in Santorini Greece 🇬🇷🏛️ #GreeceTravel #SkyRush',
    likes: '1.9k',
    comments: '128',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Conquering the snow peaks of the Swiss Alps 🏔️❄️ #AlpsAdventure #SkyRush',
    likes: '2.7k',
    comments: '192',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&h=600&q=80',
    caption: 'Road tripping through breathtaking valley trails 🌄🚗 #Wanderlust #SkyRush',
    likes: '3.5k',
    comments: '264',
    url: 'https://www.instagram.com/skyrushtourism',
    isVideo: false
  }
];

export default function InstagramFeed({ instagram }) {
  const {
    tag = "INSTAGRAM GALLERY",
    title = "Follow Us On Instagram",
    handle = "@skyrushtourism",
    url = "https://www.instagram.com/skyrushtourism",
    subtitle = "Discover real moments, travel inspiration, and behind-the-scenes glimpses of our global journeys.",
    btnText = "Follow Us On Instagram",
    posts = placeholderPosts
  } = instagram || {};

  return (
    <section className="instagram-feed-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="insta-header">
          <div className="insta-title-area">
            <div className="insta-tag-pill">
              <i className="bx bxl-instagram insta-pill-icon"></i>
              <span>{tag}</span>
            </div>
            <h2 className="insta-heading">
              {title} <span className="insta-handle">{handle}</span>
              <i className="bx bxs-badge-check verified-badge" title="Verified Account"></i>
            </h2>
            <p className="insta-subtitle">
              {subtitle}
            </p>
          </div>

          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="insta-follow-btn"
          >
            <i className="bx bxl-instagram"></i>
            <span>{btnText}</span>
          </a>
        </div>

        {/* 6-Card Photo Grid */}
        <div className="insta-grid">
          {posts.map((post) => (
            <a 
              key={post.id} 
              href={post.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="insta-card"
            >
              <img src={post.image} alt="Skyrush Instagram post" className="insta-card-img" />
              
              {/* Video Play Badge if post is a Reel/Video */}
              {post.isVideo && (
                <div className="reel-play-badge">
                  <i className="bx bx-play"></i> REEL
                </div>
              )}

              {/* Hover Overlay */}
              <div className="insta-card-overlay">
                <div className="insta-overlay-icon">
                  <i className={post.isVideo ? 'bx bx-play-circle' : 'bx bxl-instagram'}></i>
                </div>
                
                <p className="insta-caption">{post.caption}</p>
                
                <div className="insta-card-stats">
                  {post.likes && <span className="insta-stat"><i className="bx bxs-heart"></i> {post.likes}</span>}
                  {post.comments && post.comments !== '0' && (
                    <span className="insta-stat"><i className="bx bxs-chat"></i> {post.comments}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Hashtag Callout Banner */}
        <div className="insta-callout-banner">
          <i className="bx bx-camera-home callout-icon"></i>
          <span>Share your travel stories! Tag <strong className="hashtag-accent">#SkyRushMemories</strong> on Instagram for a chance to be featured!</span>
        </div>
      </div>
    </section>
  );
}
