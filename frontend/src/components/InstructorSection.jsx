import React, { useState, useEffect } from 'react';

const InstructorSection = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/public/instructor');
        if (response.ok) {
          const data = await response.json();
          setContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch instructor content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return null; // Or a skeleton if preferred, but null is fine for now

  // Default fallback content if nothing is returned or fields are missing
  const {
    name = 'Akshay Hangaragi',
    title = 'Founder & Instructor',
    bio = 'Passionate about teaching and helping students crack their dream interviews.',
    imageUrl,
    socialLinks = {},
    companyLogos = [],
  } = content || {};

  return (
    <section className="instructor-section py-6 md:py-16 bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-left animate-slideInLeft">
            <div className="inline-block px-5 py-2 rounded-full bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
              Meet Your Instructor
            </div>
            <h2 className="text-4xl md:text-7xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              The Architect of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 drop-shadow-sm">
                Your Success
              </span>
            </h2>

            <div className="relative mb-10">
              <svg
                className="absolute -top-6 -left-6 w-12 h-12 text-red-600 opacity-20 transform -rotate-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H16.017C18.2261 5 20.017 6.79086 20.017 9V15C20.017 17.2091 18.2261 19 16.017 19H14.017V21ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H7.01697C9.22611 5 11.017 6.79086 11.017 9V15C11.017 17.2091 9.22611 19 7.01697 19H5.01697V21Z" />
              </svg>
              <p className="text-gray-300 text-xl leading-relaxed pl-6 border-l-4 border-red-600/80 italic font-light">
                {bio}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-400 text-sm">
                Find more about me on
              </span>
              <div className="flex gap-3">
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.689-.069 4.948-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Company Logos */}
            {companyLogos.length > 0 && (
              <div className="bg-gray-900 bg-opacity-50 rounded-xl p-4 border border-gray-800 backdrop-blur-sm">
                <p className="text-xs text-gray-500 mb-3 text-center uppercase tracking-wider">
                  Bringing work experience from
                </p>
                <div className="flex flex-wrap justify-center gap-6 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                  {companyLogos.map((logo, index) => (
                    <img
                      key={index}
                      src={logo}
                      alt="Company Logo"
                      className="h-6 object-contain"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 relative animate-slideInRight">
            <div className="relative z-10">
              {/* Orange/Red Circle Background */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-red-600 to-black rounded-full opacity-30 blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-b from-red-600 to-black rounded-full z-0"></div>

              {/* Instructor Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="relative z-10 w-full h-auto object-cover drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="relative z-10 w-full aspect-square bg-gray-800 rounded-full flex items-center justify-center text-gray-600">
                  No Image Available
                </div>
              )}

              {/* Floating Name Card */}
              <div className="absolute bottom-10 right-0 z-20 bg-gray-900 bg-opacity-90 backdrop-blur-md p-4 rounded-lg border border-gray-700 shadow-xl flex items-center gap-3 animate-bounce-slow">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{name}</h4>
                  <p className="text-xs text-gray-400">{title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
