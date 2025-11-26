import React, { useState, useEffect } from 'react';
import { SkeletonHero, SkeletonText } from '../components/SkeletonLoader';

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/public/about');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContent(data.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load content: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Add a timeout to ensure loading doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!content) {
          setError('Content loading timed out. Please refresh the page.');
        }
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [loading, content]);

  if (loading)
    return (
      <div className="about-page py-24 min-h-screen bg-black">
        <div className="container">
          <SkeletonHero />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 animate-pulse"></div>
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="about-page py-24 min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      ></div>
      <div className="container">
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-white/10 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-8 text-white">About Us</h1>
          <div
            className="prose prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-red-500 prose-strong:text-white prose-p:text-gray-300"
            dangerouslySetInnerHTML={{
              __html:
                content?.html ||
                '<p>Welcome to our platform. We connect talented individuals with amazing companies.</p>',
            }}
          />

          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-white border-b border-gray-800 pb-4">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
              {content?.teamMembers && content.teamMembers.length > 0 ? (
                content.teamMembers.map(member => (
                  <div
                    key={member.id}
                    className="team-member text-center p-6 rounded-2xl glass-card border border-white/10 hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="rounded-full w-32 h-32 mx-auto mb-6 overflow-hidden border-4 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-red-500 font-bold text-3xl">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-xl text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-red-400 mb-4 font-medium">
                      {member.role}
                    </p>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-400">
                  No team members to display.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
