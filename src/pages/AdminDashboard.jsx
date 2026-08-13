import React, { useState, useEffect } from 'react';
import ClassicEditor from '../components/ClassicEditor';

const COUNTRIES_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
  "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function AdminDashboard({ content = {}, onSaveContent, onLogout, userRole, token }) {
  const [activeSection, setActiveSection] = useState(
    userRole === 'blogger' ? 'blogs' : 'general'
  );
  const [localContent, setLocalContent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedTours, setExpandedTours] = useState({});
  const [expandedVisas, setExpandedVisas] = useState({});
  const [expandedBlogs, setExpandedBlogs] = useState({});
  const [tourSearchQuery, setTourSearchQuery] = useState('');

  const generate5DigitCode = (existingCodes = []) => {
    const set = new Set(existingCodes);
    let code;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (set.has(code));
    return code;
  };

  const getTourPackageCode = (tour) => {
    if (tour && tour.packageCode) return tour.packageCode;
    if (!tour) return '10000';
    const idNum = parseInt(tour.id || 1, 10);
    const hash = String(tour.title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (10000 + (idNum * 317 + hash * 43) % 89999).toString();
  };

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('blogger');
  const [userError, setUserError] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to retrieve user accounts:', err);
    }
  };

  useEffect(() => {
    if (activeSection === 'users' && userRole === 'super_admin' && token) {
      fetchUsers();
    }
  }, [activeSection, userRole, token]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setUserError('');
    
    if (!newUsername.trim() || !newPassword.trim()) {
      setUserError('Username and password are required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword,
          role: newRole
        })
      });

      const data = await res.json();

      if (res.ok) {
        setNewUsername('');
        setNewPassword('');
        setNewRole('blogger');
        fetchUsers();
        alert('User account created successfully!');
      } else {
        setUserError(data.error || 'Failed to create user account.');
      }
    } catch (err) {
      console.error(err);
      setUserError('Connection to server failed.');
    }
  };

  const handleDeleteUser = async (usernameToDelete) => {
    if (usernameToDelete === 'admin') {
      alert('The primary "admin" account is protected and cannot be deleted.');
      return;
    }

    const targetUser = users.find(u => u.username === usernameToDelete);
    if (targetUser && targetUser.role === 'super_admin') {
      const superAdmins = users.filter(u => u.role === 'super_admin');
      if (superAdmins.length <= 1) {
        alert('Cannot delete this user. At least one "super_admin" account must remain.');
        return;
      }
    }

    if (window.confirm(`Are you sure you want to delete user "${usernameToDelete}"?`)) {
      try {
        const res = await fetch(`/api/admin/users/${usernameToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          fetchUsers();
          alert('User account deleted successfully!');
        } else {
          alert(data.error || 'Failed to delete user account.');
        }
      } catch (err) {
        console.error(err);
        alert('Connection to server failed.');
      }
    }
  };

  const toggleTourExpand = (tourId) => {
    setExpandedTours(prev => ({
      ...prev,
      [tourId]: !prev[tourId]
    }));
  };

  const toggleBlogExpand = (blogId) => {
    setExpandedBlogs(prev => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  };

  const toggleVisaExpand = (visaId) => {
    setExpandedVisas(prev => ({
      ...prev,
      [visaId]: !prev[visaId]
    }));
  };

  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      const copy = JSON.parse(JSON.stringify(content)); // Deep copy
      if (copy.tours && Array.isArray(copy.tours)) {
        const usedCodes = new Set(copy.tours.map(t => t.packageCode).filter(Boolean));
        copy.tours = copy.tours.map(t => {
          if (!t.packageCode) {
            let code;
            do {
              code = Math.floor(10000 + Math.random() * 90000).toString();
            } while (usedCodes.has(code));
            usedCodes.add(code);
            return { ...t, packageCode: code };
          }
          return t;
        });
      }
      if (!copy.instagram) {
        copy.instagram = {
          tag: "INSTAGRAM GALLERY",
          title: "Follow Us On Instagram",
          handle: "@skyrushtourism",
          url: "https://www.instagram.com/skyrushtourism",
          subtitle: "Discover real moments, travel inspiration, and behind-the-scenes glimpses of our global journeys.",
          btnText: "Follow Us On Instagram",
          posts: [
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
          ]
        };
      }
      setLocalContent(copy);
    }
  }, [content]);

  if (!localContent) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px' }}>
        <h3 style={{ fontWeight: 700 }}>Loading Dashboard Configuration...</h3>
      </div>
    );
  }

  // Handle simple general contact change
  const handleContactChange = (field, val) => {
    setLocalContent((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: val
      }
    }));
  };

  // Handle hero slider field change
  const handleSliderChange = (idx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.sliders[idx][field] = val;
      return copy;
    });
  };

  // Handle tour field change
  const handleTourChange = (idx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.tours[idx][field] = val;
      return copy;
    });
  };

  // Handle tour nested array item change (inclusions/exclusions)
  const handleTourArrayChange = (tourIdx, field, itemIdx, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.tours[tourIdx][field]) {
        copy.tours[tourIdx][field] = [];
      }
      copy.tours[tourIdx][field][itemIdx] = val;
      return copy;
    });
  };

  // Add tour nested array item
  const addTourArrayItem = (tourIdx, field) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.tours[tourIdx][field]) {
        copy.tours[tourIdx][field] = [];
      }
      copy.tours[tourIdx][field].push('');
      return copy;
    });
  };

  // Remove tour nested array item
  const removeTourArrayItem = (tourIdx, field, itemIdx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (copy.tours[tourIdx][field]) {
        copy.tours[tourIdx][field].splice(itemIdx, 1);
      }
      return copy;
    });
  };

  const handleInstagramHeaderChange = (field, val) => {
    setLocalContent((prev) => ({
      ...prev,
      instagram: {
        ...prev.instagram,
        [field]: val
      }
    }));
  };

  const handleInstagramPostChange = (idx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.instagram) copy.instagram = {};
      if (!copy.instagram.posts) copy.instagram.posts = [];
      const updatedPosts = [...copy.instagram.posts];
      updatedPosts[idx] = {
        ...updatedPosts[idx],
        [field]: val
      };
      copy.instagram.posts = updatedPosts;
      return copy;
    });
  };

  const handleAddInstagramPost = () => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.instagram) copy.instagram = {};
      if (!copy.instagram.posts) copy.instagram.posts = [];
      copy.instagram.posts = [
        ...copy.instagram.posts,
        {
          id: String(Date.now()),
          image: '',
          caption: '',
          likes: '',
          comments: '',
          url: 'https://www.instagram.com/skyrushtourism',
          isVideo: false
        }
      ];
      return copy;
    });
  };

  const handleRemoveInstagramPost = (idx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.instagram || !copy.instagram.posts) return prev;
      const updatedPosts = [...copy.instagram.posts];
      updatedPosts.splice(idx, 1);
      copy.instagram.posts = updatedPosts;
      return copy;
    });
  };

  // Handle itinerary field change
  const handleItineraryChange = (tourIdx, dayIdx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (copy.tours[tourIdx].itinerary && copy.tours[tourIdx].itinerary[dayIdx]) {
        copy.tours[tourIdx].itinerary[dayIdx][field] = val;
      }
      return copy;
    });
  };

  // Add itinerary day
  const addItineraryDay = (tourIdx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.tours[tourIdx].itinerary) {
        copy.tours[tourIdx].itinerary = [];
      }
      const nextDayNum = copy.tours[tourIdx].itinerary.length + 1;
      copy.tours[tourIdx].itinerary.push({
        day: `Day ${nextDayNum}`,
        title: 'New Day Activity',
        description: 'Provide details about this day\'s schedule.'
      });
      return copy;
    });
  };

  // Remove itinerary day
  const removeItineraryDay = (tourIdx, dayIdx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (copy.tours[tourIdx].itinerary) {
        copy.tours[tourIdx].itinerary.splice(dayIdx, 1);
      }
      return copy;
    });
  };

  // Delete Tour Package
  const deleteTour = (idx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.tours.splice(idx, 1);
      return copy;
    });
  };

  // Add Tour Package
  const addTour = () => {
    const nextId = localContent.tours.length > 0 ? Math.max(...localContent.tours.map(t => t.id)) + 1 : 1;
    const existingCodes = (localContent.tours || []).map(t => t.packageCode).filter(Boolean);
    const newCode = generate5DigitCode(existingCodes);

    setExpandedTours(prev => ({
      ...prev,
      [nextId]: true
    }));
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.tours.push({
        id: nextId,
        packageCode: newCode,
        title: 'New Tour Package',
        duration: '4 Days - 3 Nights',
        days: 4,
        nights: 3,
        country: 'Kazakhstan',
        tourType: 'Family',
        hotelCategory: '4-Star Hotel',
        location: 'Destination',
        image: 'https://skyrushtourism.com/wp-content/uploads/2026/06/almaty.jpg',
        price: 'د.إ1,500',
        offerPrice: '',
        inclusionsSummary: {
          transfer: true,
          stay: true,
          breakfast: true,
          lunch: false,
          dinner: false,
          sightseeing: true,
          guide: true,
          flight: false,
          visa: false
        },
        overview: 'Experience the breathtaking beauty of this destination with our premium tour package.',
        inclusions: [
          'Premium Hotels (Double/Twin Sharing)',
          'Daily Breakfast & Dinner',
          'Airport Transfers'
        ],
        exclusions: [],
        itinerary: [
          {
            day: 'Day 1',
            title: 'Arrival & Check-in',
            description: 'Meet your guide at the airport and transfer to the hotel.'
          }
        ]
      });
      return copy;
    });
  };

  // Handle visa field change
  const handleVisaChange = (idx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      const visa = copy.visas[idx];
      visa[field] = val;

      // Automatically generate title, stay, and country based on input
      const from = visa.countryFrom || '';
      const to = visa.countryTo || '';
      const min = visa.minDays || '';
      const max = visa.maxDays || '';

      // Set Title
      if (from && to) {
        visa.title = `Visa from ${from} to ${to}`;
      } else if (to) {
        visa.title = `${to} Visa Package`;
      } else if (from) {
        visa.title = `Visa from ${from}`;
      } else {
        visa.title = 'New Visa Consultation Package';
      }

      // Set Country string for searches
      visa.country = [from, to].filter(Boolean).join(', ');

      // Set Stay
      if (min && max) {
        visa.stay = min === max ? `${min} Days` : `${min} - ${max} Days`;
      } else if (min) {
        visa.stay = `${min} Days`;
      } else if (max) {
        visa.stay = `${max} Days`;
      }

      return copy;
    });
  };

  // Delete Visa Package
  const deleteVisa = (idx) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.visas.splice(idx, 1);
      return copy;
    });
  };

  // Add Visa Package
  const addVisa = () => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      const nextId = copy.visas.length > 0 ? Math.max(...copy.visas.map(v => v.id)) + 1 : 1;
      copy.visas.push({
        id: nextId,
        title: 'New Visa Consultation Package',
        country: 'UAE (Dubai)',
        type: 'Travel Documentation Consultation',
        stay: '60 Days',
        price: 'د.إ999',
        offerPrice: '',
        countryFrom: '',
        countryTo: 'UAE (Dubai)',
        minDays: '60',
        maxDays: '60',
        description: '',
        docLink: ''
      });
      setExpandedVisas((prevExpanded) => ({
        ...prevExpanded,
        [nextId]: true
      }));
      return copy;
    });
  };

  // Handle blog field change
  const handleBlogChange = (idx, field, val) => {
    setLocalContent((prev) => {
      const copy = { ...prev };
      copy.blogs[idx][field] = val;
      return copy;
    });
  };

  // Delete Blog Post
  const deleteBlog = (idx) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setLocalContent((prev) => {
        const copy = { ...prev };
        copy.blogs.splice(idx, 1);
        return copy;
      });
    }
  };

  // Add Blog Post
  const addBlog = () => {
    const nextId = localContent.blogs && localContent.blogs.length > 0 
      ? Math.max(...localContent.blogs.map(b => b.id)) + 1 
      : 1;
    setExpandedBlogs(prev => ({
      ...prev,
      [nextId]: true
    }));
    setLocalContent((prev) => {
      const copy = { ...prev };
      if (!copy.blogs) {
        copy.blogs = [];
      }
      copy.blogs.push({
        id: nextId,
        title: 'New Travel Blog Article',
        author: 'Skyrush Admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '3 Min Read',
        image: 'https://skyrushtourism.com/wp-content/uploads/2026/06/greece.jpg',
        excerpt: 'Provide a short summary of the blog post to display on cards.',
        content: '<p>Write your article here...</p>'
      });
      return copy;
    });
  };



  // Save edits back to backend server
  const handleSave = async () => {
    // Validate compulsory regular price
    const missingTourPrice = (localContent.tours || []).some(t => !t.price || !t.price.trim());
    const missingVisaPrice = (localContent.visas || []).some(v => !v.price || !v.price.trim());
    if (missingTourPrice || missingVisaPrice) {
      alert('Error: Regular Price is compulsory for all Tour and Visa packages. Please fill in the missing prices before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localContent)
      });
      if (res.ok) {
        const data = await res.json();
        alert('All changes saved successfully to backend content database!');
        onSaveContent(localContent); // update parent React App state
      } else {
        if (res.status === 401 || res.status === 403) {
          alert('Your session has expired or is invalid. Please click the Logout button at the bottom-left, log back in, and try saving again.');
        } else {
          let errMsg = 'Make sure backend Express server is running.';
          try {
            const errJson = await res.json();
            if (errJson && errJson.error) {
              errMsg = errJson.error;
            }
          } catch (e) {}
          alert(`Failed to save changes: ${errMsg}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Side Control Panel */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <i className="bx bx-cog" style={{ fontSize: '24px' }}></i>
          <span>Skyrush Admin</span>
        </div>
        {(userRole === 'super_admin' || userRole === 'tour_visa') && (
          <>
            <button 
              className={`admin-nav-item ${activeSection === 'general' ? 'active' : ''}`}
              onClick={() => setActiveSection('general')}
            >
              <i className="bx bx-slider-alt"></i> General Settings
            </button>
            <button 
              className={`admin-nav-item ${activeSection === 'sliders' ? 'active' : ''}`}
              onClick={() => setActiveSection('sliders')}
            >
              <i className="bx bx-images"></i> Home Sliders
            </button>
            <button 
              className={`admin-nav-item ${activeSection === 'tours' ? 'active' : ''}`}
              onClick={() => setActiveSection('tours')}
            >
              <i className="bx bx-package"></i> Tour Packages
            </button>
            <button 
              className={`admin-nav-item ${activeSection === 'visas' ? 'active' : ''}`}
              onClick={() => setActiveSection('visas')}
            >
              <i className="bx bx-credit-card-front"></i> Visa Packages
            </button>
            <button 
              className={`admin-nav-item ${activeSection === 'instagram' ? 'active' : ''}`}
              onClick={() => setActiveSection('instagram')}
            >
              <i className="bx bxl-instagram"></i> Instagram Gallery
            </button>
          </>
        )}
        {(userRole === 'super_admin' || userRole === 'blogger') && (
          <button 
            className={`admin-nav-item ${activeSection === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveSection('blogs')}
          >
            <i className="bx bx-news"></i> Blog Posts
          </button>
        )}
        {userRole === 'super_admin' && (
          <button 
            className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <i className="bx bx-group"></i> User Management
          </button>
        )}
        <button 
          className="admin-nav-item"
          onClick={onLogout}
          style={{ marginTop: 'auto', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}
        >
          <i className="bx bx-log-out"></i> Logout
        </button>
      </aside>

      {/* Main Configurations Dashboard */}
      <main className="admin-main">
        <div className="admin-header">
          <h2>Website Content Manager</h2>
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={isSaving}
          >
            <i className="bx bx-save" style={{ fontSize: '18px' }}></i>
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* 1. GENERAL INFORMATION SETTINGS */}
        {activeSection === 'general' && (
          <section>
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Website Services Toggle</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Enable Visa Services</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    Toggle Visa Services across the entire website. If disabled, all Visa pages, links, home sections, and mentions will be completely hidden.
                  </p>
                </div>
                <label className="admin-switch">
                  <input 
                    type="checkbox" 
                    checked={localContent.visaEnabled !== false}
                    onChange={(e) => setLocalContent(prev => ({
                      ...prev,
                      visaEnabled: e.target.checked
                    }))}
                  />
                  <span className="admin-switch-slider"></span>
                </label>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Office &amp; Contact Inquiries</h3>
              </div>
              <div className="admin-grid">
                <div className="admin-input-group">
                  <label>Support Phone Line</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.contact?.phone || ''} 
                    onChange={(e) => handleContactChange('phone', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Phone URI String (Dial String)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.contact?.phoneCall || ''} 
                    onChange={(e) => handleContactChange('phoneCall', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Support Email Address</label>
                  <input 
                    type="email" 
                    className="admin-input" 
                    value={localContent.contact?.email || ''} 
                    onChange={(e) => handleContactChange('email', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>WhatsApp Number (e.g. +971 50 173 7277)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.contact?.whatsapp || ''} 
                    onChange={(e) => handleContactChange('whatsapp', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                  <label>WhatsApp Welcome Message</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.contact?.whatsappMessage || ''} 
                    onChange={(e) => handleContactChange('whatsappMessage', e.target.value)} 
                    placeholder="e.g. Hello SkyRush, I need Schengen appointment help."
                  />
                </div>
              </div>
              <div className="admin-input-group" style={{ marginTop: '15px' }}>
                <label>Physical Address (Footer &amp; Contact Page)</label>
                <textarea 
                  rows="3"
                  className="admin-input" 
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  value={localContent.contact?.address || ''} 
                  onChange={(e) => handleContactChange('address', e.target.value)} 
                />
              </div>
              <div className="admin-input-group" style={{ marginTop: '15px' }}>
                <label>Web3Forms Access Key</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={localContent.contact?.web3formsAccessKey || ''} 
                  onChange={(e) => handleContactChange('web3formsAccessKey', e.target.value)} 
                  placeholder="e.g. 12345678-abcd-1234-abcd-1234567890ab"
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Register at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)', fontWeight: 600 }}>web3forms.com</a> to get your free access key.
                </p>
              </div>
            </div>
            
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>About Us Overview Section</h3>
              </div>
              <div className="admin-grid">
                <div className="admin-input-group">
                  <label>Section Title Tag</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.about?.tag || ''} 
                    onChange={(e) => setLocalContent(prev => {
                      const copy = { ...prev };
                      copy.about.tag = e.target.value;
                      return copy;
                    })}
                  />
                </div>
                <div className="admin-input-group">
                  <label>Customer Statistics Counter</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.about?.stats || ''} 
                    onChange={(e) => setLocalContent(prev => {
                      const copy = { ...prev };
                      copy.about.stats = e.target.value;
                      return copy;
                    })}
                  />
                </div>
              </div>
              <div className="admin-input-group" style={{ marginTop: '15px' }}>
                <label>About Heading Title Text</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={localContent.about?.title || ''} 
                  onChange={(e) => setLocalContent(prev => {
                    const copy = { ...prev };
                    copy.about.title = e.target.value;
                    return copy;
                  })}
                />
              </div>
            </div>
          </section>
        )}

        {/* 2. HERO SLIDERS CONFIG */}
        {activeSection === 'sliders' && (
          <section>
            {localContent.sliders?.map((slide, idx) => (
              <div className="admin-card" key={slide.id}>
                <div className="admin-card-header">
                  <h3>Slide #{idx + 1} ({slide.tag})</h3>
                </div>
                <div className="admin-grid">
                  <div className="admin-input-group">
                    <label>Destination Tag</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={slide.tag} 
                      onChange={(e) => handleSliderChange(idx, 'tag', e.target.value)} 
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Slide Title Text</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={slide.title} 
                      onChange={(e) => handleSliderChange(idx, 'title', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="admin-input-group" style={{ marginTop: '15px' }}>
                  <label>Slider Subtitle Paragraph</label>
                  <textarea 
                    rows="2"
                    className="admin-input" 
                    style={{ fontFamily: 'inherit', resize: 'vertical' }}
                    value={slide.text} 
                    onChange={(e) => handleSliderChange(idx, 'text', e.target.value)} 
                  />
                </div>
                <div className="admin-grid" style={{ marginTop: '15px' }}>
                  <div className="admin-input-group">
                    <label>CTA Button Content</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={slide.btnText} 
                      onChange={(e) => handleSliderChange(idx, 'btnText', e.target.value)} 
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Slide Background Image URL</label>
                    <input 
                      type="text" 
                      className="admin-input" 
                      value={slide.image} 
                      onChange={(e) => handleSliderChange(idx, 'image', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 3. TOUR PACKAGES EDITOR */}
        {activeSection === 'tours' && (
          <section>
            {/* Search and Add Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
                <i className="bx bx-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94a3b8' }}></i>
                <input 
                  type="text" 
                  className="admin-input" 
                  placeholder="Search packages by 5-digit code (#58392), title, or location..." 
                  value={tourSearchQuery}
                  onChange={(e) => setTourSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px', background: '#fff', borderRadius: '10px' }}
                />
                {tourSearchQuery && (
                  <button 
                    type="button"
                    onClick={() => setTourSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <i className="bx bx-x-circle" style={{ fontSize: '18px' }}></i>
                  </button>
                )}
              </div>
              <button onClick={addTour} className="add-btn" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="bx bx-plus" style={{ fontSize: '18px' }}></i> Add New Tour Package
              </button>
            </div>
            
            {(localContent.tours || [])
              .map((tour, originalIdx) => ({ tour, originalIdx }))
              .filter(({ tour }) => {
                if (!tourSearchQuery.trim()) return true;
                const q = tourSearchQuery.toLowerCase().trim().replace(/^#/, '');
                const code = getTourPackageCode(tour);
                const codeMatch = code.toLowerCase().includes(q);
                const titleMatch = tour.title && tour.title.toLowerCase().includes(q);
                const locationMatch = tour.location && tour.location.toLowerCase().includes(q);
                const countryMatch = tour.country && tour.country.toLowerCase().includes(q);
                return codeMatch || titleMatch || locationMatch || countryMatch;
              })
              .map(({ tour, originalIdx: idx }) => {
                const isExpanded = !!expandedTours[tour.id];
                const packageCodeVal = getTourPackageCode(tour);
                return (
                  <div className="admin-card" key={tour.id} style={{ transition: 'all 0.3s ease-in-out' }}>
                    <div 
                      className="admin-card-header" 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        cursor: 'pointer', 
                        userSelect: 'none',
                        borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none',
                        paddingBottom: isExpanded ? '12px' : '0px',
                        marginBottom: isExpanded ? '20px' : '0px'
                      }} 
                      onClick={() => toggleTourExpand(tour.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <i className={`bx ${isExpanded ? 'bx-chevron-up-circle' : 'bx-chevron-down-circle'}`} style={{ fontSize: '22px', color: 'var(--orange)' }}></i>
                        <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                            ID: #{packageCodeVal}
                          </span>
                          <span>{tour.title}</span>
                          <span style={{ fontWeight: 400, color: '#64748b', fontSize: '13px' }}>
                            ({tour.location || 'Destination'} · Duration: {tour.duration || 'N/A'})
                          </span>
                        </h3>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          onClick={() => toggleTourExpand(tour.id)} 
                          className="add-btn" 
                          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: isExpanded ? '#475569' : '#0f172a' }}
                        >
                          {isExpanded ? 'Collapse' : 'Edit Details'}
                        </button>
                        <button 
                          onClick={() => deleteTour(idx)} 
                          className="delete-btn" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          <i className="bx bx-trash" style={{ marginRight: '4px' }}></i> Delete
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div>
                        <div className="admin-grid">
                          <div className="admin-input-group">
                            <label style={{ color: '#2563eb', fontWeight: 600 }}>
                              <i className="bx bx-purchase-tag-alt" style={{ marginRight: '4px' }}></i> Unique Package Code (Admin 5-Digit ID)
                            </label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={packageCodeVal} 
                              readOnly 
                              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#0f172a', fontWeight: 700, letterSpacing: '1px' }} 
                            />
                          </div>
                          <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                            <label>Tour Package Title</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={tour.title} 
                              onChange={(e) => handleTourChange(idx, 'title', e.target.value)} 
                            />
                          </div>
                        </div>

                        <div className="admin-grid" style={{ marginTop: '15px' }}>
                          <div className="admin-input-group">
                            <label>Destination Country</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={tour.country || ''} 
                              onChange={(e) => handleTourChange(idx, 'country', e.target.value)}
                              placeholder="e.g. Kazakhstan"
                            />
                          </div>
                          <div className="admin-input-group">
                            <label>City / Location (e.g. Almaty, Yerevan)</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={tour.location} 
                              onChange={(e) => handleTourChange(idx, 'location', e.target.value)} 
                            />
                          </div>
                      </div>
                      
                      <div className="admin-grid" style={{ marginTop: '15px' }}>
                        <div className="admin-input-group">
                          <label>Tour Type / Category</label>
                          <select 
                            className="admin-input" 
                            value={tour.tourType || 'Family'} 
                            onChange={(e) => handleTourChange(idx, 'tourType', e.target.value)}
                          >
                            <option value="Family">Family</option>
                            <option value="Romantic">Romantic</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Honeymoon">Honeymoon</option>
                            <option value="Group Tour">Group Tour</option>
                            <option value="Wildlife">Wildlife</option>
                            <option value="Budget">Budget</option>
                          </select>
                        </div>
                        <div className="admin-input-group">
                          <label>Hotel Stay Category</label>
                          <select 
                            className="admin-input" 
                            value={tour.hotelCategory || '4-Star Hotel'} 
                            onChange={(e) => handleTourChange(idx, 'hotelCategory', e.target.value)}
                          >
                            <option value="3-Star Hotel">3-Star Hotel</option>
                            <option value="4-Star Hotel">4-Star Hotel</option>
                            <option value="5-Star Luxury">5-Star Luxury</option>
                            <option value="Boutique Stay">Boutique Stay</option>
                            <option value="Resort">Resort</option>
                          </select>
                        </div>
                        <div className="admin-input-group">
                          <label>Number of Days</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={tour.days || ''} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent((prev) => {
                                const copy = { ...prev };
                                copy.tours[idx].days = val;
                                const n = copy.tours[idx].nights || '';
                                copy.tours[idx].duration = n ? `${val} Days - ${n} Nights` : `${val} Days`;
                                return copy;
                              });
                            }} 
                            placeholder="e.g. 5"
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Number of Nights</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={tour.nights || ''} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setLocalContent((prev) => {
                                const copy = { ...prev };
                                copy.tours[idx].nights = val;
                                const d = copy.tours[idx].days || '';
                                copy.tours[idx].duration = d ? `${d} Days - ${val} Nights` : `${val} Nights`;
                                return copy;
                              });
                            }} 
                            placeholder="e.g. 4"
                          />
                        </div>
                      </div>

                      <div className="admin-grid" style={{ marginTop: '15px' }}>
                        <div className="admin-input-group">
                          <label>Regular Price (Compulsory, e.g. د.إ3,400)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={tour.price || ''} 
                            onChange={(e) => handleTourChange(idx, 'price', e.target.value)} 
                            required
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Offer Price (Optional, e.g. د.إ2,800)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={tour.offerPrice || ''} 
                            onChange={(e) => handleTourChange(idx, 'offerPrice', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Package Card Image URL</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={tour.image} 
                            onChange={(e) => handleTourChange(idx, 'image', e.target.value)} 
                          />
                        </div>
                      </div>

                      {/* Tour Collage Photos (Minimum 3, Maximum 4 Uploads) */}
                      <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div>
                            <label style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'block' }}>
                              📸 Tour Collage Photos (Min 3, Max 4 Uploads)
                            </label>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              Upload between 3 and 4 photo URLs. The collage grid will automatically adapt its layout.
                            </span>
                          </div>
                          {(!tour.gallery || tour.gallery.length < 4) ? (
                            <button 
                              type="button" 
                              className="add-btn"
                              style={{ padding: '6px 14px', fontSize: '12px', backgroundColor: '#3b82f6', color: '#ffffff' }}
                              onClick={() => {
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  const gal = copy.tours[idx].gallery ? [...copy.tours[idx].gallery] : [copy.tours[idx].image || '', '', ''];
                                  if (gal.length < 4) {
                                    gal.push('');
                                  }
                                  copy.tours[idx].gallery = gal;
                                  return copy;
                                });
                              }}
                            >
                              <i className="bx bx-plus" style={{ marginRight: '4px' }}></i> Add 4th Photo
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="delete-btn"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                              onClick={() => {
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  const gal = copy.tours[idx].gallery ? [...copy.tours[idx].gallery] : [];
                                  if (gal.length > 3) {
                                    gal.pop();
                                  }
                                  copy.tours[idx].gallery = gal;
                                  return copy;
                                });
                              }}
                            >
                              <i className="bx bx-trash" style={{ marginRight: '4px' }}></i> Remove 4th Photo
                            </button>
                          )}
                        </div>

                        {/* Always render inputs for photos (min 3, max 4) */}
                        {Array.from({ length: Math.max(3, Math.min(4, (tour.gallery?.length || 3))) }).map((_, gIdx) => {
                          const galArray = tour.gallery || [tour.image || '', '', ''];
                          const currentVal = galArray[gIdx] || '';
                          return (
                            <div key={gIdx} className="admin-input-group" style={{ marginBottom: '12px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                                {gIdx === 0 ? 'Photo 1 (Main Featured Photo)' : gIdx === 1 ? 'Photo 2 (Middle View)' : gIdx === 2 ? 'Photo 3 (Property / Landscape View)' : 'Photo 4 (Optional 4th View)'}
                              </label>
                              <input 
                                type="text" 
                                className="admin-input" 
                                value={currentVal} 
                                placeholder={`Enter Image URL for Photo ${gIdx + 1}`}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setLocalContent((prev) => {
                                    const copy = { ...prev };
                                    const gal = copy.tours[idx].gallery ? [...copy.tours[idx].gallery] : [copy.tours[idx].image || '', '', ''];
                                    while (gal.length < Math.max(3, gIdx + 1)) {
                                      gal.push('');
                                    }
                                    gal[gIdx] = val;
                                    copy.tours[idx].gallery = gal;
                                    if (gIdx === 0) {
                                      copy.tours[idx].image = val;
                                    }
                                    return copy;
                                  });
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Inclusion Summary Dropdowns */}
                      <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>

                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                          Highlights Inclusion Summary (Drop-downs)
                        </label>
                        <div className="admin-grid" style={{ gap: '15px' }}>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Transfer Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.transfer ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.transfer = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Stay Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.stay ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.stay = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Breakfast Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.breakfast ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.breakfast = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Lunch Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.lunch ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.lunch = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Dinner Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.dinner ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.dinner = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Sightseeing Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.sightseeing ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.sightseeing = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Guide Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.guide ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.guide = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Flight Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.flight ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.flight = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                          <div className="admin-input-group">
                            <label style={{ fontSize: '12px' }}>Visa Included</label>
                            <select 
                              className="admin-input"
                              value={tour.inclusionsSummary?.visa ? 'yes' : 'no'}
                              onChange={(e) => {
                                const val = e.target.value === 'yes';
                                setLocalContent((prev) => {
                                  const copy = { ...prev };
                                  if (!copy.tours[idx].inclusionsSummary) copy.tours[idx].inclusionsSummary = {};
                                  copy.tours[idx].inclusionsSummary.visa = val;
                                  return copy;
                                });
                              }}
                            >
                              <option value="no">Not Included</option>
                              <option value="yes">Included</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="admin-input-group" style={{ marginTop: '15px' }}>
                        <label>Package Overview Description</label>
                        <textarea 
                          rows="3"
                          className="admin-input" 
                          style={{ fontFamily: 'inherit', resize: 'vertical' }}
                          value={tour.overview || ''} 
                          onChange={(e) => handleTourChange(idx, 'overview', e.target.value)} 
                        />
                      </div>

                      {/* Technical Specifications */}
                      <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Technical Specifications
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px' }}>
                          (List specifications like Lift Capacity, Working Height, Machine Weight, etc.)
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(tour.inclusions || []).map((inclusion, incIdx) => (
                            <div key={incIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input 
                                type="text" 
                                className="admin-input" 
                                style={{ flex: 1 }}
                                value={inclusion} 
                                onChange={(e) => handleTourArrayChange(idx, 'inclusions', incIdx, e.target.value)} 
                              />
                              <button 
                                type="button" 
                                onClick={() => removeTourArrayItem(idx, 'inclusions', incIdx)}
                                className="delete-btn"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <div>
                            <button 
                              type="button" 
                              onClick={() => addTourArrayItem(idx, 'inclusions')} 
                              className="add-btn" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#22c55e' }}
                            >
                              <i className="bx bx-plus" style={{ marginRight: '4px' }}></i> Add Inclusion Item
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* What's Excluded */}
                      <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Standard Features &amp; Options
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px' }}>
                          (List features such as Solid Tires, Extension Platforms, Alarm Beacons, etc.)
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(tour.exclusions || []).map((exclusion, excIdx) => (
                            <div key={excIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input 
                                type="text" 
                                className="admin-input" 
                                style={{ flex: 1 }}
                                value={exclusion} 
                                onChange={(e) => handleTourArrayChange(idx, 'exclusions', excIdx, e.target.value)} 
                              />
                              <button 
                                type="button" 
                                onClick={() => removeTourArrayItem(idx, 'exclusions', excIdx)}
                                className="delete-btn"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <div>
                            <button 
                              type="button" 
                              onClick={() => addTourArrayItem(idx, 'exclusions')} 
                              className="add-btn" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#22c55e' }}
                            >
                              <i className="bx bx-plus" style={{ marginRight: '4px' }}></i> Add Exclusion Item
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Itinerary */}
                      <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '12px' }}>
                          Key Operational Systems &amp; Technical Highlights
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {(tour.itinerary || []).map((dayObj, dayIdx) => (
                            <div key={dayIdx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--orange)' }}>Day #{dayIdx + 1} Planning</span>
                                <button 
                                  type="button" 
                                  onClick={() => removeItineraryDay(idx, dayIdx)}
                                  className="delete-btn"
                                  style={{ padding: '4px 8px', fontSize: '11px' }}
                                >
                                  Remove Day
                                </button>
                              </div>
                              
                              <div className="admin-grid" style={{ gap: '10px' }}>
                                <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                                  <label style={{ fontSize: '11px' }}>Day Label (e.g. Day 1)</label>
                                  <input 
                                    type="text" 
                                    className="admin-input" 
                                    style={{ padding: '8px 12px' }}
                                    value={dayObj.day || ''} 
                                    onChange={(e) => handleItineraryChange(idx, dayIdx, 'day', e.target.value)} 
                                  />
                                </div>
                                <div className="admin-input-group" style={{ marginBottom: '8px' }}>
                                  <label style={{ fontSize: '11px' }}>Activity Title</label>
                                  <input 
                                    type="text" 
                                    className="admin-input" 
                                    style={{ padding: '8px 12px' }}
                                    value={dayObj.title || ''} 
                                    onChange={(e) => handleItineraryChange(idx, dayIdx, 'title', e.target.value)} 
                                  />
                                </div>
                              </div>
                              
                              <div className="admin-input-group" style={{ marginBottom: '0px', marginTop: '4px' }}>
                                <label style={{ fontSize: '11px' }}>Activity Description</label>
                                <textarea 
                                  rows="2"
                                  className="admin-input" 
                                  style={{ fontFamily: 'inherit', resize: 'vertical', padding: '8px 12px' }}
                                  value={dayObj.description || ''} 
                                  onChange={(e) => handleItineraryChange(idx, dayIdx, 'description', e.target.value)} 
                                />
                              </div>
                            </div>
                          ))}
                          <div>
                            <button 
                              type="button" 
                              onClick={() => addItineraryDay(idx)} 
                              className="add-btn" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#0f172a' }}
                            >
                              <i className="bx bx-plus" style={{ marginRight: '4px' }}></i> Add Itinerary Day
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* SEO Settings Section */}
                      <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                          <i className="bx bx-search-alt" style={{ marginRight: '4px' }}></i> SEO Metadata Configuration
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                          Optimize search engine index snippet values (Custom Title and Meta Description).
                        </span>
                        <div className="admin-grid" style={{ gap: '15px' }}>
                          <div className="admin-input-group">
                            <label>SEO Meta Title (Title Tag)</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={tour.seoTitle || ''} 
                              placeholder="e.g. Custom Tour Title - Duration | Skyrush Tourism"
                              onChange={(e) => handleTourChange(idx, 'seoTitle', e.target.value)} 
                            />
                          </div>
                          <div className="admin-input-group">
                            <label>SEO Meta Description</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={tour.seoDescription || ''} 
                              placeholder="e.g. Book custom itineraries for Georgia & Armenia starting at د.إ3,100 per person..."
                              onChange={(e) => handleTourChange(idx, 'seoDescription', e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* 4. VISA PACKAGES CONFIG */}
        {activeSection === 'visas' && (
          <section>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <button onClick={addVisa} className="add-btn">
                <i className="bx bx-plus"></i> Add New Visa Package
              </button>
            </div>
            
            {localContent.visas?.map((visa, idx) => {
              const isExpanded = !!expandedVisas[visa.id];
              return (
                <div className="admin-card" key={visa.id} style={{ transition: 'all 0.3s ease-in-out' }}>
                  <div 
                    className="admin-card-header"
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      userSelect: 'none',
                      borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none',
                      paddingBottom: isExpanded ? '12px' : '0px',
                      marginBottom: isExpanded ? '20px' : '0px'
                    }}
                    onClick={() => toggleVisaExpand(visa.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className={`bx ${isExpanded ? 'bx-chevron-up-circle' : 'bx-chevron-down-circle'}`} style={{ fontSize: '22px', color: 'var(--orange)' }}></i>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>Visa Package: {visa.title}</span>
                        <span style={{ fontWeight: 400, color: '#64748b', fontSize: '13px' }}>
                          (From {visa.countryFrom || 'Any'} to {visa.countryTo || 'Any'} · Stay: {visa.stay || 'N/A'})
                        </span>
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button" 
                        onClick={() => toggleVisaExpand(visa.id)} 
                        className="add-btn" 
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: isExpanded ? '#475569' : '#0f172a' }}
                      >
                        {isExpanded ? 'Collapse' : 'Edit Details'}
                      </button>
                      <button onClick={() => deleteVisa(idx)} className="delete-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        <i className="bx bx-trash" style={{ marginRight: '4px' }}></i> Delete
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div>
                      <div className="admin-grid">
                        <div className="admin-input-group">
                          <label>Visa Package Title</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={visa.title} 
                            onChange={(e) => handleVisaChange(idx, 'title', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Departure Country (e.g. Philippines)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. Philippines"
                            value={visa.countryFrom || ''} 
                            onChange={(e) => handleVisaChange(idx, 'countryFrom', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Destination Country (e.g. Dubai (UAE))</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. Dubai (UAE)"
                            value={visa.countryTo || ''} 
                            onChange={(e) => handleVisaChange(idx, 'countryTo', e.target.value)} 
                          />
                        </div>
                      </div>

                      <div className="admin-grid" style={{ marginTop: '15px' }}>
                        <div className="admin-input-group">
                          <label>Minimum Stay (Days)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. 60"
                            value={visa.minDays || ''} 
                            onChange={(e) => handleVisaChange(idx, 'minDays', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Maximum Stay (Days)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. 90"
                            value={visa.maxDays || ''} 
                            onChange={(e) => handleVisaChange(idx, 'maxDays', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Calculated Stay Duration (e.g. 60 - 90 Days)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={visa.stay || ''} 
                            onChange={(e) => handleVisaChange(idx, 'stay', e.target.value)} 
                            placeholder="e.g. 60 - 90 Days"
                          />
                        </div>
                      </div>

                      <div className="admin-grid" style={{ marginTop: '15px' }}>
                        <div className="admin-input-group">
                          <label>Visa Type / Category</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. Travel Documentation Consultation"
                            value={visa.type} 
                            onChange={(e) => handleVisaChange(idx, 'type', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Regular Price (Compulsory, e.g. د.إ2,399)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={visa.price || ''} 
                            onChange={(e) => handleVisaChange(idx, 'price', e.target.value)} 
                            required
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Offer Price (Optional, e.g. د.إ1,999)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={visa.offerPrice || ''} 
                            onChange={(e) => handleVisaChange(idx, 'offerPrice', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Featured Image URL</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            placeholder="e.g. https://skyrushtourism.com/wp-content/uploads/..."
                            value={visa.image || ''} 
                            onChange={(e) => handleVisaChange(idx, 'image', e.target.value)} 
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '25px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '10px' }}>
                          Visa Package Description &amp; Requirements Details (HTML format supported)
                        </label>
                        <ClassicEditor
                          value={visa.description || ''}
                          onChange={(val) => handleVisaChange(idx, 'description', val)}
                          placeholder="Provide details about requirements, necessary documents, guarantor clearance criteria, etc..."
                        />
                      </div>

                      {/* SEO Settings Section */}
                      <div style={{ marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', display: 'block', marginBottom: '4px' }}>
                          <i className="bx bx-search-alt" style={{ marginRight: '4px' }}></i> SEO Metadata Configuration
                        </label>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                          Optimize search engine index snippet values (Custom Title and Meta Description).
                        </span>
                        <div className="admin-grid" style={{ gap: '15px' }}>
                          <div className="admin-input-group">
                            <label>SEO Meta Title (Title Tag)</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={visa.seoTitle || ''} 
                              placeholder="e.g. Visa Consultancy - Visa Name | Skyrush Tourism"
                              onChange={(e) => handleVisaChange(idx, 'seoTitle', e.target.value)} 
                            />
                          </div>
                          <div className="admin-input-group">
                            <label>SEO Meta Description</label>
                            <input 
                              type="text" 
                              className="admin-input" 
                              value={visa.seoDescription || ''} 
                              placeholder="e.g. Professional visa consultancy, application documentation, and appointment support..."
                              onChange={(e) => handleVisaChange(idx, 'seoDescription', e.target.value)} 
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* 5. BLOG POSTS EDITOR */}
        {activeSection === 'blogs' && (
          <section>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
              <button onClick={addBlog} className="add-btn">
                <i className="bx bx-plus"></i> Add New Blog Post
              </button>
            </div>
            
            {(localContent.blogs || []).map((blog, idx) => {
              const isExpanded = !!expandedBlogs[blog.id];
              return (
                <div className="admin-card" key={blog.id} style={{ transition: 'all 0.3s ease-in-out' }}>
                  <div 
                    className="admin-card-header" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      userSelect: 'none',
                      borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none',
                      paddingBottom: isExpanded ? '12px' : '0px',
                      marginBottom: isExpanded ? '20px' : '0px'
                    }} 
                    onClick={() => toggleBlogExpand(blog.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <i className={`bx ${isExpanded ? 'bx-chevron-up-circle' : 'bx-chevron-down-circle'}`} style={{ fontSize: '22px', color: 'var(--orange)' }}></i>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{blog.title}</span>
                        <span style={{ fontWeight: 400, color: '#64748b', fontSize: '13px' }}>
                          (By {blog.author || 'Unknown'} · {blog.date || 'No Date'} · {blog.readTime || '3 Min Read'})
                        </span>
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button" 
                        onClick={() => toggleBlogExpand(blog.id)} 
                        className="add-btn" 
                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: isExpanded ? '#475569' : '#0f172a' }}
                      >
                        {isExpanded ? 'Collapse' : 'Edit Post'}
                      </button>
                      <button 
                        onClick={() => deleteBlog(idx)} 
                        className="delete-btn" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <i className="bx bx-trash" style={{ marginRight: '4px' }}></i> Delete
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div>
                      {/* Main Metadata Grid */}
                      <div className="admin-grid">
                        <div className="admin-input-group">
                          <label>Article Title</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={blog.title} 
                            onChange={(e) => handleBlogChange(idx, 'title', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Author</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={blog.author} 
                            onChange={(e) => handleBlogChange(idx, 'author', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Published Date (e.g. Dec 2, 2025)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={blog.date} 
                            onChange={(e) => handleBlogChange(idx, 'date', e.target.value)} 
                          />
                        </div>
                      </div>

                      <div className="admin-grid" style={{ marginTop: '15px' }}>
                        <div className="admin-input-group">
                          <label>Estimated Read Time (e.g. 5 Min Read)</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={blog.readTime} 
                            onChange={(e) => handleBlogChange(idx, 'readTime', e.target.value)} 
                          />
                        </div>
                        <div className="admin-input-group">
                          <label>Featured Image URL</label>
                          <input 
                            type="text" 
                            className="admin-input" 
                            value={blog.image} 
                            onChange={(e) => handleBlogChange(idx, 'image', e.target.value)} 
                          />
                        </div>
                        {blog.image && (
                          <div className="admin-input-group" style={{ alignItems: 'flex-start' }}>
                            <label>Featured Image Preview</label>
                            <img 
                              src={blog.image} 
                              alt="Featured Preview" 
                              style={{ height: '42px', borderRadius: '6px', border: '1px solid #cbd5e1', objectFit: 'cover', maxWidth: '120px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="admin-input-group" style={{ marginTop: '15px' }}>
                        <label>Short Excerpt (For card snippet summary)</label>
                        <textarea 
                          rows="2"
                          className="admin-input" 
                          style={{ fontFamily: 'inherit', resize: 'vertical' }}
                          value={blog.excerpt || ''} 
                          onChange={(e) => handleBlogChange(idx, 'excerpt', e.target.value)} 
                        />
                                         {/* Rich Text Classic Editor Section */}
                      <div style={{ marginTop: '25px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '10px' }}>
                          Article Content Body
                        </label>
                        <ClassicEditor
                          value={blog.content || ''}
                          onChange={(val) => handleBlogChange(idx, 'content', val)}
                          placeholder="Start writing your beautiful travel blog post here..."
                        />
                      </div>     </div>

                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* 6. INSTAGRAM GALLERY CONFIGURATION */}
        {activeSection === 'instagram' && (
          <section>
            {/* Instagram Feed Header Settings */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Instagram Feed Header Settings</h3>
              </div>
              <div className="admin-grid">
                <div className="admin-input-group">
                  <label>Section Tag Pill</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.instagram?.tag || ''} 
                    onChange={(e) => handleInstagramHeaderChange('tag', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Instagram Handle (with @)</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.instagram?.handle || ''} 
                    onChange={(e) => handleInstagramHeaderChange('handle', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Follow Profile URL</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.instagram?.url || ''} 
                    onChange={(e) => handleInstagramHeaderChange('url', e.target.value)} 
                  />
                </div>
                <div className="admin-input-group">
                  <label>Follow Button Text</label>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={localContent.instagram?.btnText || ''} 
                    onChange={(e) => handleInstagramHeaderChange('btnText', e.target.value)} 
                  />
                </div>
              </div>
              <div className="admin-input-group" style={{ marginTop: '15px' }}>
                <label>Section Description / Subtitle</label>
                <textarea 
                  rows="2"
                  className="admin-input" 
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  value={localContent.instagram?.subtitle || ''} 
                  onChange={(e) => handleInstagramHeaderChange('subtitle', e.target.value)} 
                />
              </div>
            </div>

            {/* Instagram Posts List */}
            <div className="admin-card">
              <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Gallery Posts List</h3>
                <button 
                  type="button" 
                  className="add-btn"
                  onClick={handleAddInstagramPost}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                >
                  <i className="bx bx-plus"></i> Add New Post
                </button>
              </div>
              
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                The Home Page displays the posts in a responsive 6-card grid. Make sure to have exactly 6 posts for a balanced layout.
              </p>

              <div className="admin-items-list">
                {localContent.instagram?.posts?.map((post, idx) => (
                  <div className="admin-item-card" key={post.id || idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>Post #{idx + 1}</strong>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveInstagramPost(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}
                      >
                        <i className="bx bx-trash"></i> Delete Post
                      </button>
                    </div>

                    <div className="admin-grid">
                      <div className="admin-input-group">
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={post.image || ''} 
                          onChange={(e) => handleInstagramPostChange(idx, 'image', e.target.value)} 
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Instagram Post URL</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={post.url || ''} 
                          onChange={(e) => handleInstagramPostChange(idx, 'url', e.target.value)} 
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Likes Count (e.g. 2.4k)</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={post.likes || ''} 
                          onChange={(e) => handleInstagramPostChange(idx, 'likes', e.target.value)} 
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Comments Count (e.g. 184)</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={post.comments || ''} 
                          onChange={(e) => handleInstagramPostChange(idx, 'comments', e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="admin-grid" style={{ marginTop: '10px', alignItems: 'center' }}>
                      <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Caption Text</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={post.caption || ''} 
                          onChange={(e) => handleInstagramPostChange(idx, 'caption', e.target.value)} 
                        />
                      </div>
                      <div className="admin-input-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '22px' }}>
                          <input 
                            type="checkbox" 
                            checked={!!post.isVideo} 
                            onChange={(e) => handleInstagramPostChange(idx, 'isVideo', e.target.checked)} 
                          />
                          <span>Is Video/Reel (Displays video icon on hover)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. USER ACCOUNTS MANAGEMENT */}
        {activeSection === 'users' && userRole === 'super_admin' && (
          <section>
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Add New User Account</h3>
              </div>
              
              {userError && (
                <div style={{
                  background: '#fee2e2',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  border: '1px solid #fca5a5'
                }}>
                  {userError}
                </div>
              )}

              <form onSubmit={handleAddUser}>
                <div className="admin-grid">
                  <div className="admin-input-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      className="admin-input"
                      placeholder="e.g. travel_editor"
                      value={newUsername} 
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      className="admin-input"
                      placeholder="Choose password"
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-input-group">
                    <label>Role</label>
                    <select 
                      className="admin-input"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="blogger">Blogging Editor (blogger)</option>
                      <option value="tour_visa">Tour &amp; Visa Manager (tour_visa)</option>
                      <option value="super_admin">Master Admin (super_admin)</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button type="submit" className="add-btn">
                    <i className="bx bx-user-plus" style={{ marginRight: '4px' }}></i> Create User Account
                  </button>
                </div>
              </form>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3>Active Portal User Accounts</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="user-management-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '13px' }}>
                      <th style={{ padding: '12px 8px', fontWeight: 700 }}>Username</th>
                      <th style={{ padding: '12px 8px', fontWeight: 700 }}>Portal Access Role</th>
                      <th style={{ padding: '12px 8px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => {
                      const displayRole = user.role === 'super_admin' 
                        ? 'Master Admin (super_admin)' 
                        : user.role === 'tour_visa' 
                          ? 'Tour & Visa Manager (tour_visa)' 
                          : 'Blogging Editor (blogger)';
                      
                      return (
                        <tr key={user.username} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#1e293b' }}>
                          <td style={{ padding: '14px 8px', fontWeight: 600 }}>{user.username}</td>
                          <td style={{ padding: '14px 8px' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              fontSize: '11px', 
                              fontWeight: 700,
                              background: user.role === 'super_admin' ? '#dbeafe' : user.role === 'tour_visa' ? '#fef3c7' : '#dcfce7',
                              color: user.role === 'super_admin' ? '#1e40af' : user.role === 'tour_visa' ? '#92400e' : '#166534'
                            }}>
                              {displayRole}
                            </span>
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                            {user.username === 'admin' ? (
                              <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Protected System Account</span>
                            ) : (
                              <button 
                                onClick={() => handleDeleteUser(user.username)}
                                className="delete-btn"
                                style={{ padding: '4px 10px', fontSize: '12px' }}
                              >
                                <i className="bx bx-trash"></i> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
