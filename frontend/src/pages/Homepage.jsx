import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NgoPostsGrid from '../components/NgoPostsGrid';
import MkStudioVideo from '../components/MkStudioVideo';
import LogoBar from '../components/LogoBar';

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
      linkedin: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/public/companies');
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
        const response = await fetch('/api/public/hero');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Debug log to see what we're receiving
        console.log('Received hero content:', data);
        
        // Process image URL - allow data URLs for uploaded images
        // FIX: Remove extra quotes and trim whitespace
        let imageUrl = (data.imageUrl || '').replace(/^\"|\"$/g, '').trim();
        
        // Additional check to ensure the URL is valid
        if (imageUrl && (imageUrl.startsWith('data:image') || imageUrl.startsWith('http'))) {
          // Valid image URL, use as is
          console.log('Valid image URL detected:', imageUrl.substring(0, 100) + '...');
        } else if (imageUrl) {
          // If it doesn't start with expected prefixes, still attempt to use it
          console.log('Image URL does not start with expected prefix, but will attempt to use it:', imageUrl);
        } else {
          imageUrl = '';
          console.log('No valid image URL found, using fallback');
        }
        
        console.log('Final processed image URL:', imageUrl);
        
        // Additional validation to ensure the URL is properly formatted
        if (imageUrl && imageUrl.startsWith('data:image')) {
          // Ensure data URLs don't have extra quotes
          if (imageUrl.includes('"')) {
            console.warn('Image URL contains quotes, attempting to clean:', imageUrl);
            imageUrl = imageUrl.replace(/"/g, '');
          }
        }
        
        // Additional cleaning for escaped quotes
        imageUrl = imageUrl.replace(/\\"/g, '"').replace(/"/g, '');
        
        // Final validation to ensure we have a valid image URL
        if (imageUrl && imageUrl.startsWith('data:image') && imageUrl.length < 100) {
          // This might be a truncated URL, don't use it
          console.warn('Image URL appears to be truncated, not using it:', imageUrl);
          imageUrl = '';
        }
        
        // Additional validation to ensure the URL is not malformed
        if (imageUrl && imageUrl.includes(' ') && !imageUrl.startsWith('data:image')) {
          // URLs with spaces are likely invalid
          console.warn('Image URL contains spaces, likely invalid:', imageUrl);
          imageUrl = '';
        }
        
        // Additional validation to ensure the URL is not too long
        if (imageUrl && imageUrl.length > 1000000) {
          // This might be too large for the browser to handle
          console.warn('Image URL is too long, not using it:', imageUrl.length);
          imageUrl = '';
        }
        
        // Test the image URL to ensure it's valid
        if (imageUrl) {
          try {
            // For data URLs, we can't easily test them, so we'll just check if they start correctly
            if (imageUrl.startsWith('data:image')) {
              // Valid data URL
              console.log('Data URL appears valid');
            } else if (imageUrl.startsWith('http')) {
              // For HTTP URLs, we could test them, but we'll skip for now to avoid CORS issues
              console.log('HTTP URL detected, assuming valid');
            } else {
              // Unknown URL type
              console.warn('Unknown URL type, not using it:', imageUrl);
              imageUrl = '';
            }
          } catch (e) {
            console.warn('Error testing image URL, not using it:', imageUrl, e);
            imageUrl = '';
          }
        }
        
        // Additional validation to ensure data URLs have proper format
        if (imageUrl && imageUrl.startsWith('data:image')) {
          // Check if it has the proper data URL format
          const dataUrlRegex = /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/;
          if (!dataUrlRegex.test(imageUrl)) {
            // If it doesn't match the regex, it might still be valid if it's a partial match
            // Let's do a more lenient check
            if (!imageUrl.includes('base64,')) {
              console.warn('Data URL does not contain base64, not using it:', imageUrl);
              imageUrl = '';
            }
          }
          
          // Additional check for data URL length
          if (imageUrl.length < 1000) {
            console.warn('Data URL appears to be too short, not using it:', imageUrl.length);
            imageUrl = '';
          }
        }
        
        // Final validation to ensure we're not using an empty or invalid URL
        if (imageUrl && imageUrl.trim() === '') {
          imageUrl = '';
        }
        
        // Additional validation to ensure the URL doesn't have extra quotes
        if (imageUrl && (imageUrl.startsWith('"') || imageUrl.endsWith('"'))) {
          console.warn('Image URL has extra quotes, cleaning:', imageUrl);
          imageUrl = imageUrl.replace(/^"|"$/g, '');
        }
        
        // Additional validation to ensure the URL is properly encoded for CSS
        if (imageUrl && imageUrl.startsWith('data:image')) {
          // Make sure the data URL doesn't contain characters that need encoding
          try {
            // Test if the URL is properly formatted
            const testUrl = new URL(imageUrl);
            console.log('Image URL is properly formatted');
          } catch (e) {
            console.warn('Image URL needs encoding, attempting to encode:', imageUrl);
            // For data URLs, we don't need to encode them for CSS background-image
            // The issue is likely with the quotes, which we've already handled
          }
        }
        
        // Test if the image URL is actually valid by loading it
        if (imageUrl) {
          testImageUrl(imageUrl).then((isValid) => {
            if (!isValid) {
              console.warn('Image URL failed to load, using fallback:', imageUrl);
              imageUrl = '';
            } else {
              console.log('Image URL loaded successfully');
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
            linkedin: ''
          }
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
            linkedin: ''
          }
        });
      }
    };

    // Add error handling for image loading
    const handleImageError = (e) => {
      console.error('Hero image failed to load:', e);
      // Set a fallback background
      e.target.parentElement.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #e53935 100%)';
    };

    Promise.all([fetchCompanies(), fetchHeroContent()]).then(() => {
      setLoading(false);
    });
  }, []);

  // Add a function to test if the image URL is valid
  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  if (loading) return <div className="container py-8 contrast-text-light">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="homepage">
      <section className="hero-section relative py-32 md:py-48">
        {heroContent.imageUrl ? (
          <>
            <img
              src={heroContent.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black" 
              style={{ opacity: 0.3, zIndex: 1 }}
            ></div>
          </>
        ) : (
          <div 
            className="absolute inset-0" 
            style={{ 
              background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #e53935 100%)',
              zIndex: 1
            }}
          ></div>
        )}
        <div className="container relative z-10 text-center" style={{ zIndex: 2, position: 'relative' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 contrast-text-light drop-shadow-lg">
            {heroContent.headline || heroContent.tagline}
          </h1>
          {heroContent.description && (
            <p className="text-lg md:text-xl mb-8 contrast-text-light max-w-3xl mx-auto">
              {heroContent.description}
            </p>
          )}
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {heroContent.socialLinks.youtube && (
              <a 
                href={heroContent.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors btn-hover-effect bg-black bg-opacity-30 p-3 rounded-full"
                aria-label="YouTube"
                style={{ zIndex: 3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {heroContent.socialLinks.instagram && (
              <a 
                href={heroContent.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors btn-hover-effect bg-black bg-opacity-30 p-3 rounded-full"
                aria-label="Instagram"
                style={{ zIndex: 3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {heroContent.socialLinks.twitter && (
              <a 
                href={heroContent.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors btn-hover-effect bg-black bg-opacity-30 p-3 rounded-full"
                aria-label="Twitter"
                style={{ zIndex: 3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {heroContent.socialLinks.linkedin && (
              <a 
                href={heroContent.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors btn-hover-effect bg-black bg-opacity-30 p-3 rounded-full"
                aria-label="LinkedIn"
                style={{ zIndex: 3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      <LogoBar />

      <section className="companies-section py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold contrast-text-light">Featured Companies</h2>
            <Link to="/company" className="text-red-500 hover:text-red-400 font-medium link-hover-effect">
              View All Companies →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map(company => (
              <div key={company.id} className="company-card rounded-lg shadow-md p-6 hover:shadow-lg transition border border-red-500 card-hover-effect">
                <Link to={`/company/${company.slug}`}>
                  <div className="company-logo flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden border border-red-500" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
                    {company.thumbnail || company.logoUrl ? (
                      <img 
                        src={company.thumbnail || company.logoUrl} 
                        alt={company.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="contrast-text-light font-bold text-xl">{company.name.charAt(0)}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 contrast-text-light">{company.name}</h3>
                  <p className="contrast-text-gray">{company.shortBio?.substring(0, 100)}...</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ngo-posts-section py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold contrast-text-light">NGO Community Feed</h2>
            <Link to="/ngo" className="text-red-500 hover:text-red-400 font-medium link-hover-effect">
              View All Posts →
            </Link>
          </div>
          <NgoPostsGrid />
        </div>
      </section>

      <section className="video-section py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold contrast-text-light">Latest from MK Studio</h2>
            <Link to="/mkstudio" className="text-red-500 hover:text-red-400 font-medium link-hover-effect">
              View All Videos →
            </Link>
          </div>
          <MkStudioVideo />
        </div>
      </section>
    </div>
  )
}

export default Homepage;