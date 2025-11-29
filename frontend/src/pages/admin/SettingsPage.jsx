import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../utils/uploadImage';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    hero_tagline: '',
    hero_headline: '',
    hero_description: '',
    hero_image_url: '',
    navbar_logo_url: '',
    primary_color: '#e53935',
    social_youtube: '',
    social_instagram: '',
    social_twitter: '',
    social_linkedin: '',
    instructor_name: '',
    instructor_title: '',
    instructor_bio: '',
    instructor_image_url: '',
    instructor_social_linkedin: '',
    instructor_social_twitter: '',
    instructor_social_instagram: '',
    instructor_company_logos: '',
    mkstudio_channel_name: '',
    mkstudio_channel_tagline: '',
    mkstudio_subscribe_url: '',
    mkstudio_channel_image: '',
  });

  // State for loading, saving, and messages
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State for image previews
  const [logoPreview, setLogoPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [instructorImagePreview, setInstructorImagePreview] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const keys = Object.keys(settings);
      const newSettings = { ...settings };

      for (const key of keys) {
        if (key === 'primary_color') continue;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/site-content/${key}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.value) {
            newSettings[key] = data.data.value;

            // Set previews for images
            if (key === 'navbar_logo_url') setLogoPreview(data.data.value);
            if (key === 'hero_image_url') setImagePreview(data.data.value);
            if (key === 'instructor_image_url')
              setInstructorImagePreview(data.data.value);
          }
        }
      }

      setSettings(newSettings);
    } catch (err) {
      setError('Failed to load settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // State for file objects
  const [files, setFiles] = useState({});

  const handleImageUpload = (file, fieldName, setPreview) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Store the file object
    setFiles(prev => ({
      ...prev,
      [fieldName]: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      setPreview(imageDataUrl);
      // We don't update settings[fieldName] with base64 anymore for upload
      // but we keep it for preview consistency if needed
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e, fieldName, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      handleImageUpload(file, fieldName, setPreview);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      // First, upload any pending images
      const updatedSettings = { ...settings };
      const fileKeys = Object.keys(files);

      for (const key of fileKeys) {
        if (files[key]) {
          try {
            const imageUrl = await uploadImage(files[key]);
            updatedSettings[key] = imageUrl;
          } catch (uploadErr) {
            throw new Error(`Failed to upload image for ${key}: ${uploadErr.message}`);
          }
        }
      }

      // Now save all settings with updated URLs
      const keys = Object.keys(updatedSettings);

      for (const key of keys) {
        // Skip primary_color as it's not in DB yet or handled differently
        if (key === 'primary_color') continue;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/site-content/${key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ value: updatedSettings[key] }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${key}`);
        }
      }

      // Update local state with new URLs and clear files
      setSettings(updatedSettings);
      setFiles({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;

  return (
    <div className="settings-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">
          Site Settings
        </h1>
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
        {/* Appearance Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">
            Appearance & Hero
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Navbar Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  handleFileChange(e, 'navbar_logo_url', setLogoPreview)
                }
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 mb-2"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="h-12 object-contain bg-black p-2 rounded"
                />
              )}
            </div>
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
                rows="3"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Hero Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  handleFileChange(e, 'hero_image_url', setImagePreview)
                }
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 mb-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Hero Preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>

        {/* Instructor Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">
            Instructor Section
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Instructor Name
              </label>
              <input
                type="text"
                name="instructor_name"
                value={settings.instructor_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Instructor Title
              </label>
              <input
                type="text"
                name="instructor_title"
                value={settings.instructor_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Instructor Bio
              </label>
              <textarea
                name="instructor_bio"
                value={settings.instructor_bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Instructor Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  handleFileChange(
                    e,
                    'instructor_image_url',
                    setInstructorImagePreview
                  )
                }
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 mb-2"
              />
              {instructorImagePreview && (
                <img
                  src={instructorImagePreview}
                  alt="Instructor Preview"
                  className="w-32 h-32 object-cover rounded-full border-2 border-red-500"
                />
              )}
            </div>

            <h3 className="text-md font-medium contrast-text-light mt-4">
              Instructor Social Links
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="instructor_social_linkedin"
                value={settings.instructor_social_linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn URL"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
              <input
                type="text"
                name="instructor_social_twitter"
                value={settings.instructor_social_twitter}
                onChange={handleInputChange}
                placeholder="Twitter URL"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
              <input
                type="text"
                name="instructor_social_instagram"
                value={settings.instructor_social_instagram}
                onChange={handleInputChange}
                placeholder="Instagram URL"
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>

            <h3 className="text-md font-medium contrast-text-light mt-4">
              Company Logos (JSON Array)
            </h3>
            <textarea
              name="instructor_company_logos"
              value={settings.instructor_company_logos}
              onChange={handleInputChange}
              rows="3"
              placeholder='["url1", "url2"]'
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light font-mono text-xs"
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 contrast-text-light">
            Platform Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                YouTube
              </label>
              <input
                type="text"
                name="social_youtube"
                value={settings.social_youtube}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="social_instagram"
                value={settings.social_instagram}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="social_twitter"
                value={settings.social_twitter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium contrast-text-gray mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="social_linkedin"
                value={settings.social_linkedin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
