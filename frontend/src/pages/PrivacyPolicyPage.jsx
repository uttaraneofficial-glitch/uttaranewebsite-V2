import React, { useState, useEffect } from 'react';

const PrivacyPolicyPage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch('/api/public/privacy-policy');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data.content || 'No privacy policy content available.');
      } catch (err) {
        setError('Failed to load privacy policy: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) return <div className="container py-8 contrast-text-light">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="privacy-policy-page py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 contrast-text-light">Privacy Policy</h1>
          <div 
            className="privacy-policy-content contrast-text-light prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;