import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Fetch logo URL from the hero content API
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/hero`);
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logoUrl || '');
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
      }
    };

    fetchLogo();
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/company', label: 'Companies' },
    { path: '/ngo', label: 'NGO Feed' },
    { path: '/mkstudio', label: 'MK Studio' },
    { path: '/about', label: 'About' },
  ];

  const isActive = path => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                AH
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-tight">
                Uttarane<span className="text-red-500">.com</span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5">
                By Akshay C Hangaragi
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white hover:text-red-400 transition-colors relative ${isActive(link.path) ? 'text-red-500' : ''
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-black ${isMenuOpen ? 'max-h-96 pb-4 border-b border-gray-800' : 'max-h-0'
            }`}
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white hover:text-red-400 transition-colors py-2 ${isActive(link.path) ? 'text-red-500 font-semibold' : ''
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
