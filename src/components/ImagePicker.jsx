import React, { useState, useEffect, useRef } from 'react';

// Helper to crawl all image URLs inside a nested content object
function extractImagesFromContent(obj, accumulated = new Set()) {
  if (!obj) return accumulated;
  
  if (typeof obj === 'string') {
    const cleanStr = obj.trim();
    // Match common image formats or unsplash/Cloudinary URLs or base64 data URLs
    if (
      /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(cleanStr) ||
      cleanStr.startsWith('data:image/') ||
      (cleanStr.startsWith('http') && (cleanStr.includes('/photo-') || cleanStr.includes('cloudinary.com')))
    ) {
      accumulated.add(cleanStr);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImagesFromContent(item, accumulated));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(value => extractImagesFromContent(value, accumulated));
  }
  
  return accumulated;
}

const DEFAULT_GALLERY_IMAGES = [
  '/logo.png',
  '/Armenia_hero_1.jpg',
  '/Kazakhstan_hero_3.jpg',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80'
];

export default function ImagePicker({ value, onChange, label, content = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'upload', 'settings'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cloudinary credentials cached in localStorage
  const [cloudName, setCloudName] = useState(localStorage.getItem('cloudinary_cloud_name') || 'scuol2j1');
  const [uploadPreset, setUploadPreset] = useState(localStorage.getItem('cloudinary_preset') || 'skyrush_image_preset');
  const [isCloudinaryUnlocked, setIsCloudinaryUnlocked] = useState(false);
  
  // Custom uploaded images cached in localStorage
  const [uploadedImages, setUploadedImages] = useState(() => {
    try {
      const saved = localStorage.getItem('skyrush_uploaded_gallery');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Compile final list of gallery image tiles
  const getGalleryImages = () => {
    const crawled = Array.from(extractImagesFromContent(content));
    const combined = new Set([...DEFAULT_GALLERY_IMAGES, ...crawled, ...uploadedImages]);
    
    // Convert to array and filter out empty values
    let list = Array.from(combined).filter(img => img && img.trim() !== '');
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(img => img.toLowerCase().includes(q));
    }
    
    return list;
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('cloudinary_preset', uploadPreset.trim());
    alert('Settings saved successfully!');
    setActiveTab('upload');
  };

  const handleSelectImage = (imgUrl) => {
    onChange(imgUrl);
    setIsOpen(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    // If Cloudinary credentials are set up, perform live cloud upload
    if (cloudName.trim() && uploadPreset.trim()) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset.trim());

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          const secureUrl = data.secure_url;
          if (secureUrl) {
            // Save to local cache
            const nextList = [secureUrl, ...uploadedImages];
            setUploadedImages(nextList);
            localStorage.setItem('skyrush_uploaded_gallery', JSON.stringify(nextList));
            
            // Apply selected value
            handleSelectImage(secureUrl);
            return;
          }
        }
        throw new Error('Upload request failed. Please check credentials.');
      } catch (err) {
        console.error(err);
        setUploadError('Failed to upload to Cloudinary. Check your Cloud Name & Preset.');
        setUploading(false);
      }
    } else {
      // Fallback: Convert to Base64 data URL for local storage & zero-setup preview
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          const nextList = [base64data, ...uploadedImages];
          setUploadedImages(nextList);
          localStorage.setItem('skyrush_uploaded_gallery', JSON.stringify(nextList));
          
          handleSelectImage(base64data);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setUploadError('Failed to process image file.');
        setUploading(false);
      }
    }
  };

  return (
    <div className="admin-image-picker-wrapper" style={{ marginBottom: '20px' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', marginBottom: '8px', display: 'block' }}>{label}</label>}
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
        {/* Preview Thumbnail */}
        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#e2e8f0', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {value ? (
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <i className="bx bx-image" style={{ fontSize: '32px', color: '#94a3b8' }}></i>
          )}
        </div>

        {/* Input Details & Trigger Actions */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input 
            type="text" 
            className="admin-input" 
            placeholder="Select from gallery or enter URL..."
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: '12px', margin: 0, padding: '6px 12px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button" 
              className="add-btn" 
              onClick={() => setIsOpen(true)}
              style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="bx bx-images"></i> Browse Gallery / Upload
            </button>
            {value && (
              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => onChange('')}
                style={{ padding: '6px 12px', fontSize: '11px', color: '#ef4444', backgroundColor: '#fee2e2', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <i className="bx bx-trash"></i> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Gallery Selector Modal Dialog */}
      {isOpen && (
        <div className="media-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px', boxSizing: 'border-box' }}>
          <div className="media-modal-container" style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '800px', height: '620px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Select Image Asset</h3>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '24px', color: '#64748b', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
              <button 
                type="button"
                onClick={() => setActiveTab('gallery')}
                style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', border: 'none', background: 'transparent', borderBottom: activeTab === 'gallery' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'gallery' ? '#3b82f6' : '#64748b', cursor: 'pointer' }}
              >
                🖼 Gallery Grid
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('upload')}
                style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', border: 'none', background: 'transparent', borderBottom: activeTab === 'upload' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'upload' ? '#3b82f6' : '#64748b', cursor: 'pointer' }}
              >
                📤 Upload Image
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('settings')}
                style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '700', border: 'none', background: 'transparent', borderBottom: activeTab === 'settings' ? '3px solid #3b82f6' : '3px solid transparent', color: activeTab === 'settings' ? '#3b82f6' : '#64748b', cursor: 'pointer', marginLeft: 'auto' }}
              >
                ⚙ Cloudinary Settings
              </button>
            </div>

            {/* Modal Body Contents */}
            <div style={{ flex: '1', overflowY: 'auto', padding: '24px', boxSizing: 'border-box' }}>
              
              {/* Tab 1: Gallery Browse Grid */}
              {activeTab === 'gallery' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input 
                      type="text" 
                      className="admin-input" 
                      placeholder="Search gallery images..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '40px', fontSize: '13px', margin: 0 }}
                    />
                    <i className="bx bx-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94a3b8' }}></i>
                  </div>

                  <div style={{ flex: '1', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', paddingBottom: '10px' }}>
                    {getGalleryImages().map((img, idx) => {
                      const isSelected = value === img;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleSelectImage(img)}
                          style={{ 
                            position: 'relative', 
                            aspectRatio: '1', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            cursor: 'pointer', 
                            border: isSelected ? '4px solid #3b82f6' : '1px solid #cbd5e1',
                            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none',
                            transform: isSelected ? 'scale(0.96)' : 'none',
                            transition: 'all 0.2s ease',
                            background: '#f1f5f9'
                          }}
                          className="gallery-item-tile"
                        >
                          <img 
                            src={img} 
                            alt={`Gallery ${idx}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=200&auto=format&fit=crop';
                            }}
                          />
                          {isSelected && (
                            <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#3b82f6', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                              <i className="bx bx-check" style={{ fontSize: '16px', fontWeight: 'bold' }}></i>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {getGalleryImages().length === 0 && (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                        <i className="bx bx-search-alt" style={{ fontSize: '48px', marginBottom: '12px' }}></i>
                        <p style={{ margin: 0, fontSize: '14px' }}>No matches found in the gallery.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Upload File Component */}
              {activeTab === 'upload' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px', background: '#f8fafc', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => fileInputRef.current?.click()}>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  
                  <i className="bx bx-cloud-upload" style={{ fontSize: '72px', color: '#94a3b8', marginBottom: '16px' }}></i>
                  
                  {uploading ? (
                    <div>
                      <h4 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 8px 0' }}>Uploading Asset...</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Please wait while the image is compressed and stored.</p>
                    </div>
                  ) : (
                    <div>
                      <h4 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 8px 0' }}>Drag &amp; Drop or Click to Select</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Supports JPG, PNG, WEBP, or SVG formats.</p>
                      
                      {cloudName && uploadPreset ? (
                        <span style={{ display: 'inline-block', background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                          ⚡ CLOUDINARY UPLOADER ACTIVE
                        </span>
                      ) : (
                        <span style={{ display: 'inline-block', background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                          ⚠️ DIRECT FILE MODE (LOCAL BASE64 CONVERT)
                        </span>
                      )}
                    </div>
                  )}

                  {uploadError && (
                    <div style={{ marginTop: '20px', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="bx bx-error-circle"></i> {uploadError}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Cloudinary Credentials Config */}
              {activeTab === 'settings' && (
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '16px', color: '#0f172a', margin: 0, fontWeight: '800' }}>Connect Cloudinary Store</h4>
                    {!isCloudinaryUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          const pass = prompt('Warning: Modifying Cloudinary API credentials can disrupt image uploader operations across the site.\n\nPlease enter the admin password to unlock:');
                          if (pass === 'skyrush2026') {
                            setIsCloudinaryUnlocked(true);
                          } else if (pass !== null) {
                            alert('Incorrect password. Access denied.');
                          }
                        }}
                        style={{ padding: '4px 10px', fontSize: '11px', color: '#dc2626', backgroundColor: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <i className="bx bx-lock-alt"></i> Unlock Settings
                      </button>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="bx bx-lock-open-alt"></i> Unlocked
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', marginBottom: '24px' }}>
                    Connect your own Cloudinary storage account to store files permanently in the cloud (ideal for live hosting). To get started, sign up for a free account at Cloudinary and create an <strong>Unsigned Upload Preset</strong> in your settings.
                  </p>

                  <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="admin-input-group" style={{ margin: 0 }}>
                      <label>Cloud Name</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={cloudName} 
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. dxyz12345"
                        required
                        readOnly={!isCloudinaryUnlocked}
                        style={{ backgroundColor: !isCloudinaryUnlocked ? '#f1f5f9' : '#ffffff', color: !isCloudinaryUnlocked ? '#64748b' : '#0f172a' }}
                      />
                    </div>
                    <div className="admin-input-group" style={{ margin: 0 }}>
                      <label>Unsigned Upload Preset</label>
                      <input 
                        type="text" 
                        className="admin-input" 
                        value={uploadPreset} 
                        onChange={(e) => setUploadPreset(e.target.value)}
                        placeholder="e.g. skyrush_preset"
                        required
                        readOnly={!isCloudinaryUnlocked}
                        style={{ backgroundColor: !isCloudinaryUnlocked ? '#f1f5f9' : '#ffffff', color: !isCloudinaryUnlocked ? '#64748b' : '#0f172a' }}
                      />
                    </div>
                    {isCloudinaryUnlocked && (
                      <button 
                        type="submit" 
                        className="add-btn" 
                        style={{ padding: '10px 16px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Save Configuration
                      </button>
                    )}
                  </form>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
              <button 
                type="button" 
                className="outline-btn" 
                onClick={() => setIsOpen(false)}
                style={{ padding: '8px 16px', borderColor: '#cbd5e1', color: '#475569', borderRadius: '8px', background: '#ffffff', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
