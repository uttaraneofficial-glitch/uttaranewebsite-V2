import React, { useState, useEffect } from 'react';
import './LogoBar.css';

const LogoBar = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try the new optimized endpoint first
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/candidates`, { cache: 'no-store' });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setCandidates(data.data);
            return;
          }
        }

        // Fallback: If the new endpoint fails (e.g., backend mismatch), fetch companies and extract candidates
        console.warn('Primary candidates endpoint failed, falling back to companies endpoint.');
        const fallbackResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/companies`, { cache: 'no-store' });

        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          if (Array.isArray(data.data)) {
            // Extract candidates from companies and flatten the array
            const allCandidates = data.data.flatMap(company =>
              (company.candidates || []).map(candidate => ({
                ...candidate,
                company: {
                  name: company.name,
                  logoUrl: company.logoUrl,
                  thumbnail: company.thumbnail,
                  slug: company.slug
                }
              }))
            );
            setCandidates(allCandidates);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  // Duplicate candidates for seamless looping
  const duplicatedCandidates = [...candidates, ...candidates];

  return (
    <div
      className="logo-bar-container py-4 md:py-8"
      style={{
        background:
          'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #e53935 100%)',
      }}
    >
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-6 md:mb-10 contrast-text-light">
          Placed Candidates
        </h2>

        {/* Responsive horizontal layout for candidate profile cards with continuous scrolling loop */}
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll">
            {duplicatedCandidates.map((candidate, index) => (
              <div
                key={`${candidate.id}-${index}`}
                className="candidate-card rounded-xl p-4 flex flex-col items-center justify-center flex-shrink-0 mx-3 border border-red-500 card-hover-effect"
                style={{
                  minWidth: '160px',
                  background:
                    'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)',
                }}
              >
                {/* Company Logo at the top */}
                <div className="mb-3">
                  <div
                    className="rounded-full w-10 h-10 flex items-center justify-center shadow-sm overflow-hidden border border-red-500"
                    style={{
                      background:
                        'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                    }}
                  >
                    {candidate.company.thumbnail ||
                      candidate.company.logoUrl ? (
                      <img
                        src={
                          candidate.company.thumbnail ||
                          candidate.company.logoUrl
                        }
                        alt={candidate.company.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="contrast-text-light font-bold text-base">
                        {candidate.company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Circular profile picture in the middle */}
                <div className="mb-3">
                  <div
                    className="rounded-full w-16 h-16 flex items-center justify-center shadow-md overflow-hidden border-2 border-red-500"
                    style={{
                      background:
                        'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                    }}
                  >
                    {candidate.profileImageUrl ? (
                      <img
                        src={candidate.profileImageUrl}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="contrast-text-light font-bold text-xl">
                        {candidate.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Person's name at the bottom */}
                <div className="text-center">
                  <p className="text-sm font-semibold contrast-text-light">
                    {candidate.name}
                  </p>
                  {candidate.roleOffered && (
                    <p className="text-xs text-red-400 mt-0.5">
                      {candidate.roleOffered}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoBar;
