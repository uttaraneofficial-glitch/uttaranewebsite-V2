import React, { useState, useEffect } from 'react';

const TermsOfServiceAdminPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTermsOfService();
  }, []);

  const fetchTermsOfService = async () => {
    try {
      const response = await fetch('/api/admin/site-content/terms_of_service', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch terms of service`);
      }
      
      const data = await response.json();
      setContent(data.data?.value || '');
    } catch (err) {
      setError('Failed to load terms of service: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/site-content/terms_of_service', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ value: content })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save terms of service`);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save terms of service: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;

  return (
    <div className="terms-of-service-admin">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">Terms of Service</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-6">
          Terms of service saved successfully!
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium contrast-text-gray mb-2">
            Terms of Service Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
            placeholder="Enter terms of service content (HTML allowed)"
          />
        </div>
      </div>
    </div>
  );
};

export default TermsOfServiceAdminPage;