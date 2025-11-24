import React, { useState, useEffect } from 'react';

const TermsOfServicePage = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTermsOfService = async () => {
      try {
        const response = await fetch('/api/public/terms-of-service');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data.content || 'No terms of service content available.');
      } catch (err) {
        setError('Failed to load terms of service: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsOfService();
  }, []);

  if (loading) return <div className="container py-8 contrast-text-light">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="terms-of-service-page py-16">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 contrast-text-light">Terms of Service</h1>
          <div 
            className="terms-of-service-content contrast-text-light prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;