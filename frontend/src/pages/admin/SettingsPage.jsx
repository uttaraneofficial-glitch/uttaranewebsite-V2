import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    hero_tagline: '',
    hero_headline: '',
    hero_description: '',
    hero_image_url: '',
    primary_color: '#e53935',
    social_youtube: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch all individual site content keys
      const [
        taglineResponse,
        headlineResponse,
        descriptionResponse,
        imageResponse,
        youtubeResponse,
        instagramResponse,
        twitterResponse,
        linkedinResponse
      ] = await Promise.all([
        fetch('/api/admin/site-content/hero_tagline'),
        fetch('/api/admin/site-content/hero_headline'),
        fetch('/api/admin/site-content/hero_description'),
        fetch('/api/admin/site-content/hero_image_url'),
        fetch('/api/admin/site-content/social_youtube'),
        fetch('/api/admin/site-content/social_instagram'),
        fetch('/api/admin/site-content/social_twitter'),
        fetch('/api/admin/site-content/social_linkedin')
      ]);

      const taglineData = await taglineResponse.json();
      const headlineData = await headlineResponse.json();
      const descriptionData = await descriptionResponse.json();
      const imageData = await imageResponse.json();
      const youtubeData = await youtubeResponse.json();
      const instagramData = await instagramResponse.json();
      const twitterData = await twitterResponse.json();
      const linkedinData = await linkedinResponse.json();

      const newSettings = {
        hero_tagline: taglineData.data?.value || '',
        hero_headline: headlineData.data?.value || '',
        hero_description: descriptionData.data?.value || '',
        hero_image_url: imageData.data?.value || '',
        primary_color: '#e53935', // Default color
        social_youtube: youtubeData.data?.value || '',
        social_instagram: instagramData.data?.value || '',
        social_twitter: twitterData.data?.value || '',
        social_linkedin: linkedinData.data?.value || ''
      };

      setSettings(newSettings);
      
      // Only set image preview if we have an image URL and it's not already set
      // This prevents overriding a newly uploaded image preview
      if (imageData.data?.value && (!imagePreview || imagePreview !== imageData.data?.value)) {
        setImagePreview(imageData.data?.value);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load settings: ' + err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    console.log('Handling image upload for file:', file.name, file.type, file.size);

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // For now, we'll convert to data URL and save it
    // In a production environment, you would upload to a service like Cloudinary
    const reader = new FileReader();
    reader.onloadstart = () => {
      // Show a loading state if needed
      console.log('Starting to read image file...');
    };
    
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      
      // Check if the data URL is too large
      if (typeof imageDataUrl === 'string' && imageDataUrl.length > 10 * 1024 * 1024) { // 10MB limit
        setError('Image is too large. Please select a smaller image.');
        return;
      }
      
      console.log('Image data URL generated, length:', imageDataUrl?.length);
      setImagePreview(imageDataUrl);
      setSettings(prev => ({
        ...prev,
        hero_image_url: imageDataUrl
      }));
      
      // Log the updated settings
      console.log('Updated settings with image URL');
    };
    
    reader.onerror = () => {
      setError('Failed to read the image file. Please try another image.');
      console.error('FileReader error:', reader.error);
    };
    
    reader.readAsDataURL(file);
  };

  // Effect to sync imagePreview with hero_image_url when settings change
  useEffect(() => {
    if (settings.hero_image_url && !imagePreview) {
      console.log('Syncing image preview from settings:', settings.hero_image_url);
      setImagePreview(settings.hero_image_url);
    }
    // Also sync when hero_image_url changes and is different from current preview
    else if (settings.hero_image_url && imagePreview && settings.hero_image_url !== imagePreview) {
      console.log('Updating image preview from settings change:', settings.hero_image_url);
      setImagePreview(settings.hero_image_url);
    }
  }, [settings.hero_image_url, imagePreview]);
  
  // Effect to clear imagePreview when hero_image_url is cleared
  useEffect(() => {
    if (!settings.hero_image_url) {
      console.log('Clearing image preview');
      setImagePreview(null);
    }
  }, [settings.hero_image_url]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File input changed, selected file:', file);
    
    if (file) {
      // Clear any previous errors
      setError(null);
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    
    // Debug log to see what we're sending
    console.log('Saving hero image URL:', settings.hero_image_url);
    console.log('Saving all settings:', settings);
    
    try {
      // Save hero tagline
      const taglineResponse = await fetch('/api/admin/site-content/hero_tagline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.hero_tagline })
      });
      
      if (!taglineResponse.ok) {
        throw new Error(`Failed to save hero tagline`);
      }
      
      // Save hero headline
      const headlineResponse = await fetch('/api/admin/site-content/hero_headline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.hero_headline })
      });
      
      if (!headlineResponse.ok) {
        throw new Error(`Failed to save hero headline`);
      }
      
      // Save hero description
      const descriptionResponse = await fetch('/api/admin/site-content/hero_description', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.hero_description })
      });
      
      if (!descriptionResponse.ok) {
        throw new Error(`Failed to save hero description`);
      }
      
      // Save hero image URL
      // Check if the image data is too large
      if (settings.hero_image_url && settings.hero_image_url.length > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Hero image is too large. Please select a smaller image.');
      }
      
      const imageResponse = await fetch('/api/admin/site-content/hero_image_url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.hero_image_url })
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to save hero image`);
      }
      
      // Save social links
      const youtubeResponse = await fetch('/api/admin/site-content/social_youtube', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.social_youtube })
      });
      
      if (!youtubeResponse.ok) {
        throw new Error(`Failed to save YouTube link`);
      }
      
      const instagramResponse = await fetch('/api/admin/site-content/social_instagram', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.social_instagram })
      });
      
      if (!instagramResponse.ok) {
        throw new Error(`Failed to save Instagram link`);
      }
      
      const twitterResponse = await fetch('/api/admin/site-content/social_twitter', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.social_twitter })
      });
      
      if (!twitterResponse.ok) {
        throw new Error(`Failed to save Twitter link`);
      }
      
      const linkedinResponse = await fetch('/api/admin/site-content/social_linkedin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: settings.social_linkedin })
      });
      
      if (!linkedinResponse.ok) {
        throw new Error(`Failed to save LinkedIn link`);
      }
      
      setSuccess(true);
      // Don't re-fetch settings immediately after saving to preserve the preview
      // The preview is already set in the state, so we don't need to fetch it again
      setTimeout(() => {
        setSuccess(false);
        // Remove the automatic re-fetch to preserve the preview
        // fetchSettings(); // Re-fetch settings to ensure consistency
      }, 3000);
    } catch (err) {
      setError('Failed to save settings: ' + err.message);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;

  return (
    <div className="settings-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">Site Settings</h1>
        <div className="flex space-x-2">
          <button 
            onClick={fetchSettings}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-6">
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">Appearance</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Hero Tagline
              </label>
              <input
                type="text"
                name="hero_tagline"
                value={settings.hero_tagline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                placeholder="Enter hero tagline"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                name="hero_headline"
                value={settings.hero_headline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                placeholder="Enter hero headline"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Hero Description
              </label>
              <textarea
                name="hero_description"
                value={settings.hero_description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                placeholder="Enter hero description"
                rows="3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Hero Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  />
                  <p className="text-xs contrast-text-gray mt-1">Upload a hero image</p>
                </div>
                {(imagePreview || settings.hero_image_url) && (
                  <div className="w-24 h-24 border rounded-md overflow-hidden">
                    <img 
                      src={imagePreview || settings.hero_image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Handle image load errors
                        console.error('Preview image failed to load:', e);
                        e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  name="hero_image_url"
                  value={settings.hero_image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  placeholder="Or enter image URL"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Primary Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  name="primary_color"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  className="w-12 h-12 border border-gray-600 rounded-md cursor-pointer bg-gray-700"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={handleInputChange}
                  name="primary_color"
                  className="w-32 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">Preview</h2>
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{ 
                backgroundImage: settings.hero_image_url ? `url("${settings.hero_image_url}")` : 'none',
                backgroundColor: settings.primary_color || '#e53935'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center px-4">
                  <h2 className="text-3xl font-bold contrast-text-light mb-2">
                    {settings.hero_headline || settings.hero_tagline || 'Your Hero Headline Here'}
                  </h2>
                  <p className="text-xl contrast-text-light">
                    {settings.hero_description || 'Your hero description here'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800">
              <h3 className="font-semibold text-lg mb-2 contrast-text-light">Social Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm contrast-text-gray mb-1">YouTube</label>
                  <input
                    type="text"
                    name="social_youtube"
                    value={settings.social_youtube}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    placeholder="https://youtube.com/"
                  />
                </div>
                <div>
                  <label className="block text-sm contrast-text-gray mb-1">Instagram</label>
                  <input
                    type="text"
                    name="social_instagram"
                    value={settings.social_instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    placeholder="https://instagram.com/"
                  />
                </div>
                <div>
                  <label className="block text-sm contrast-text-gray mb-1">Twitter</label>
                  <input
                    type="text"
                    name="social_twitter"
                    value={settings.social_twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    placeholder="https://twitter.com/"
                  />
                </div>
                <div>
                  <label className="block text-sm contrast-text-gray mb-1">LinkedIn</label>
                  <input
                    type="text"
                    name="social_linkedin"
                    value={settings.social_linkedin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    placeholder="https://linkedin.com/"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;