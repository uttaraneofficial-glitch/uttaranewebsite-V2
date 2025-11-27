import React, { useState, useEffect } from 'react';

const TermsOfServicePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(''); // Added this line to define 'content' state

  useEffect(() => {
    const fetchTermsOfService = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/terms-of-service`);
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

  if (loading)
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );

  return (
    <div className="terms-of-service-page min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      ></div>

      <main className="w-full relative z-10 pt-20">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              Terms of Service
            </h1>
            <div
              className="terms-of-service-content text-gray-300 prose prose-lg prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
