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
  const [heroLoading, setHeroLoading] = useState(true);
  const [companiesLoading, setCompaniesLoading] = useState(true);
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
        console.error('Failed to load companies:', err);
        // Don't set main error state here to avoid blocking hero
      } finally {
        setCompaniesLoading(false);
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
      } finally {
        setHeroLoading(false);
      }
    };

    fetchCompanies();
    fetchHeroContent();
  }, []);

  const getCompanyThumbnail = company => {
    return company.thumbnail || null;
  };

  if (error)
    return (
      <div className="container py-8 text-red-500 text-center">
        Error: {error}
      </div>
    );

  return (
    <div className="homepage bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      {heroLoading ? (
        <SkeletonHero />
      ) : (
        <section className="hero-section relative pt-14 md:pt-0 md:min-h-screen flex flex-col md:block overflow-hidden">
          {/* Background / Image Container */}
          <div className="relative w-full h-auto md:absolute md:inset-0 md:h-full z-0 bg-black">
            {heroContent.imageUrl ? (
              <>
                <img
                  src={heroContent.imageUrl}
                  alt="Hero Background"
                  className="w-full h-auto md:h-full object-contain md:object-cover animate-scaleIn"
                  style={{ animationDuration: '1.5s' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black"></div>
              </>
            ) : (
              <div className="w-full h-64 md:h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
            )}
            {/* Animated Particles/Glow - Hidden on mobile to reduce clutter, visible on desktop */}
            <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="hidden md:block absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 pt-14 md:pt-0 z-10 container mx-auto px-4 flex items-end md:items-center justify-center text-center pb-8 md:pb-0">
            <div className="animate-fadeInUp w-full">
              {/* Tagline removed as per user request */}

              <h1 className="text-xs md:text-7xl font-extrabold mb-1 md:mb-2 tracking-tight leading-tight text-white whitespace-nowrap md:whitespace-normal">
                {heroContent.headline || 'Find Your Dream Job'}
                <span className="text-red-500 inline md:block ml-1 md:ml-0 md:mt-0.5">
                  In Tech & Beyond
                </span>
              </h1>

              {heroContent.description && (
                <p className="text-[10px] md:text-xl text-gray-300 mb-1 md:mb-4 w-full md:max-w-2xl mx-auto leading-relaxed px-1 md:px-0">
                  {heroContent.description
                    .split(/(#MakeInINDIA)/g)
                    .map((part, index) =>
                      part === '#MakeInINDIA' ? (
                        <span key={index} className="text-red-500 font-bold block md:inline mt-0.5 md:mt-0">
                          {part}
                        </span>
                      ) : (
                        <span key={index}>{part}</span>
                      )
                    )}
                </p>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-row items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
                <Link
                  to="/company"
                  className="px-2.5 py-1 md:px-6 md:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] text-[9px] md:text-sm"
                >
                  Explore Companies
                </Link>
                <Link
                  to="/about"
                  className="px-2.5 py-1 md:px-6 md:py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold backdrop-blur-sm transition-all hover:border-white/30 text-[9px] md:text-sm"
                >
                  Learn More
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-3 md:gap-6">
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
                            className="w-4 h-4 md:w-6 md:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        )}
                        {platform === 'instagram' && (
                          <svg
                            className="w-4 h-4 md:w-6 md:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                          </svg>
                        )}
                        {platform === 'twitter' && (
                          <svg
                            className="w-4 h-4 md:w-6 md:h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        )}
                        {platform === 'linkedin' && (
                          <svg
                            className="w-4 h-4 md:w-6 md:h-6"
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
      )} <LogoBar />

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      {/* Featured Companies */}
      {/* Featured Companies */}
      <section className="companies-section py-2 md:py-16 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                Reviewed Companies
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Discover opportunities at top-tier tech giants
              </p>
            </div>
            <Link
              to="/company"
              className="group flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 font-semibold transition-all md:bg-transparent md:px-0 md:py-0 md:text-red-500 md:hover:text-red-400"
            >
              View All Companies
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {companiesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-8">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-8">
              {companies.map(company => (
                <Link
                  to={`/company/${company.slug}`}
                  key={company.id}
                  className="group flex flex-col gap-1.5 md:gap-3 cursor-pointer"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden bg-gray-900 border border-white/5 group-hover:rounded-none transition-all duration-200">
                    {getCompanyThumbnail(company) ? (
                      <img
                        src={getCompanyThumbnail(company)}
                        alt={company.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                        <span className="text-2xl md:text-4xl font-bold text-white/20">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* Info Section */}
                  <div className="flex gap-2 md:gap-3 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                            {company.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-white/90 truncate">
                        {company.name}
                      </h3>
                      <div className="text-gray-400 text-xs md:text-sm mt-0 md:mt-1 flex flex-col">
                        <span className="hover:text-white transition-colors truncate">
                          {company.industry || 'Technology'}
                        </span>
                        <span className="text-[10px] md:text-xs mt-0.5 hidden md:block">
                          View Interview Experiences
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      <InstructorSection />

      <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent my-2"></div>

      {/* NGO Section */}
      <section className="ngo-posts-section py-2 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-red-900/10 to-black pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                NGO Community Feed
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Latest updates and stories from the community
              </p>
            </div>
            <Link
              to="/ngo"
              className="group flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 font-semibold transition-all md:bg-transparent md:px-0 md:py-0 md:text-red-500 md:hover:text-red-400"
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
        <div className="container mx-auto px-4">
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
