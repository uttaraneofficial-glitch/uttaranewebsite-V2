import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NgoPostsGrid from '../components/NgoPostsGrid';
import MkStudioVideo from '../components/MkStudioVideo';
import LogoBar from '../components/LogoBar';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonLoader';
import InstructorSection from '../components/InstructorSection';

// Add a function to test if the image URL is valid
const testImageUrl = url => {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const Homepage = () => {
  const [companies, setCompanies] = useState([]);
  const [heroContent, setHeroContent] = useState({
    tagline: 'Welcome to Our Platform',
    headline: '',
    description: '',
    imageUrl: '',
    socialLinks: {
      youtube: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/companies`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Show only top 6 companies on homepage
        setCompanies(data.data.slice(0, 6));
      } catch (err) {
        setError('Failed to load companies: ' + err.message);
      }
    };

    const fetchHeroContent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/hero`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Process image URL - allow data URLs for uploaded images
        let imageUrl = (data.imageUrl || '').replace(/^"|"$/g, '').trim();

        // Additional cleaning for escaped quotes
        imageUrl = imageUrl.replace(/\\"/g, '"').replace(/"/g, '');

        // Final validation to ensure we're not using an empty or invalid URL
        if (imageUrl && imageUrl.trim() === '') {
          imageUrl = '';
        }

        // Additional validation to ensure the URL doesn't have extra quotes
        if (imageUrl && (imageUrl.startsWith('"') || imageUrl.endsWith('"'))) {
          imageUrl = imageUrl.replace(/^"|"$/g, '');
        }

        // Test if the image URL is actually valid by loading it
        if (imageUrl) {
          testImageUrl(imageUrl).then(isValid => {
            if (!isValid) {
              console.warn(
                'Image URL failed to load, using fallback:',
                imageUrl
              );
              imageUrl = '';
            }
          });
        }

        setHeroContent({
          tagline: data.tagline || 'Welcome to Our Platform',
          headline: data.headline || '',
          description: data.description || '',
          imageUrl: imageUrl, // Use the processed imageUrl
          socialLinks: data.socialLinks || {
            youtube: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
        });
      } catch (err) {
        console.error('Fetch hero content error:', err);
        // Set default values if fetch fails
        setHeroContent({
          tagline: 'Welcome to Our Platform',
          headline: '',
          description: '',
          imageUrl: '',
          socialLinks: {
            youtube: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          },
        });
      }
    };

    Promise.all([fetchCompanies(), fetchHeroContent()]).then(() => {
      setLoading(false);
    });
  }, []);



  if (loading)
    return (
      <div className="homepage bg-black min-h-screen">
        <SkeletonHero />
        <section className="companies-section py-6 md:py-16">
          <div className="container">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-12 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );

  if (error)
    return (
      <div className="container py-8 text-red-500 text-center">
        Error: {error}
      </div>
    );

  return (
    <div className="homepage bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-section relative min-h-[50vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-black">
          {heroContent.imageUrl ? (
            <>
              <img
                src={heroContent.imageUrl}
                alt="Hero Background"
                className="w-full h-full object-contain object-top mt-16 md:mt-0 animate-scaleIn"
                style={{ animationDuration: '1.5s' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black md:from-black/70 md:via-black/50 md:to-black"></div>
            </>
          ) : (
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
          )}
          {/* Animated Particles/Glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 text-center px-4 pt-16 md:pt-0">
          <div className="animate-fadeInUp">
            {/* Tagline removed as per user request */}

            <h1 className="text-xl md:text-7xl font-extrabold mb-2 tracking-tight leading-tight text-white">
              {heroContent.headline || 'Find Your Dream Job'}
              <span className="text-red-500 block mt-0.5">
                In Tech & Beyond
              </span>
            </h1>

            {heroContent.description && (
              <p className="text-xs md:text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                {heroContent.description
                  .split(/(#MakeInINDIA)/g)
                  .map((part, index) =>
                    part === '#MakeInINDIA' ? (
                      <span key={index} className="text-red-500 font-bold">
                        {part}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-row items-center justify-center gap-3 mb-6">
              <Link
                to="/company"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] text-xs"
              >
                Explore Companies
              </Link>
              <Link
                to="/about"
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold backdrop-blur-sm transition-all hover:border-white/30 text-xs"
              >
                Learn More
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-6">
              {Object.entries(heroContent.socialLinks).map(
                ([platform, url]) =>
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110"
                      aria-label={platform}
                    >
                      {platform === 'youtube' && (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      )}
                      {platform === 'instagram' && (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                      {platform === 'twitter' && (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      )}
                      {platform === 'linkedin' && (
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      )}
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
      </section>

      <LogoBar />

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      {/* Featured Companies */}
      <section className="companies-section py-6 md:py-16 relative">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">
                Reviewed Companies
              </h2>
              <p className="text-gray-400">
                Discover opportunities at top-tier tech giants
              </p>
            </div>
            <Link
              to="/company"
              className="group flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              View All Companies
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
            {companies.map(company => (
              <div
                key={company.id}
                className="glass-card rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 group"
              >
                <Link to={`/company/${company.slug}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg group-hover:border-red-500/50 transition-colors">
                      {company.thumbnail || company.logoUrl ? (
                        <img
                          src={company.thumbnail || company.logoUrl}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-2xl font-bold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">
                        {company.name}
                      </h3>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        Tech Giant
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {company.shortBio ||
                      'Explore interview experiences and preparation guides for this company.'}
                  </p>
                  <div className="flex items-center text-sm text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Read Experiences →
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      <InstructorSection />

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      {/* NGO Section */}
      <section className="ngo-posts-section py-6 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-900/10 to-black pointer-events-none"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">
                NGO Community Feed
              </h2>
              <p className="text-gray-400">
                Latest updates and stories from the community
              </p>
            </div>
            <Link
              to="/ngo"
              className="group flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              View All Posts
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          <NgoPostsGrid />
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      {/* Video Section */}
      <section className="video-section py-6 md:py-16 bg-black">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">
                Latest from MK Studio
              </h2>
              <p className="text-gray-400">
                Expert insights and video tutorials
              </p>
            </div>
            <Link
              to="/mkstudio"
              className="group flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              View All Videos
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
          <MkStudioVideo />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
