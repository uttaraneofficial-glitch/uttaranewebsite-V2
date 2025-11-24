import React, { useState, useEffect } from 'react';

const ContactSettingsPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContactEmail();
  }, []);

  const fetchContactEmail = async () => {
    try {
      const response = await fetch('/api/admin/site-content/contact_email', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contact email`);
      }
      
      const data = await response.json();
      setEmail(data.data?.value || 'akshaytech01@gmail.com');
    } catch (err) {
      setError('Failed to load contact email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/site-content/contact_email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          key: 'contact_email',
          value: email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update contact email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update contact email');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 contrast-text-light">Contact Settings</h2>
          <p className="contrast-text-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 contrast-text-light">Contact Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="contactEmail" className="block text-sm font-medium contrast-text-gray mb-2">
              Contact Email Address
            </label>
            <input
              type="email"
              id="contactEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter contact email address"
            />
            <p className="mt-2 text-sm contrast-text-gray">
              This email address will receive all messages sent through the contact form.
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900 text-green-100 rounded-md">
              Contact email updated successfully!
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-md font-medium text-white ${
                saving 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactSettingsPage;