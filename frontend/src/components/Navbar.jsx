import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    // Fetch logo URL from the hero content API
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/public/hero');
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

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-red-500 hover:text-red-400 transition-colors">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10" />
            ) : (
              'AH Interviews'
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
            <Link to="/company" className="hover:text-red-400 transition-colors">Companies</Link>
            <Link to="/ngo" className="hover:text-red-400 transition-colors">NGO Feed</Link>
            <Link to="/mkstudio" className="hover:text-red-400 transition-colors">MK Studio</Link>
            <Link to="/about" className="hover:text-red-400 transition-colors">About</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/company" 
                className="hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              <Link 
                to="/ngo" 
                className="hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                NGO Feed
              </Link>
              <Link 
                to="/mkstudio" 
                className="hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                MK Studio
              </Link>
              <Link 
                to="/about" 
                className="hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;