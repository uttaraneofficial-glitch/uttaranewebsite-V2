import React, { useState, useEffect } from 'react';
import './LogoBar.css';

const LogoBar = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Fetch companies and their candidates from API
    const fetchData = async () => {
      try {
        // Fetch companies
        const companiesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/companies`);
        if (!companiesResponse.ok) {
          throw new Error(`HTTP error! status: ${companiesResponse.status}`);
        }
        const companiesData = await companiesResponse.json();

        // Collect all candidates from all companies
        const allCandidates = [];
        const seenCandidates = new Set();

        for (const company of companiesData.data) {
          try {
            // Fetch videos for this company which include candidate information
            const videosResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/public/companies/${company.slug}/videos`
            );
            if (videosResponse.ok) {
              const videosData = await videosResponse.json();
              // Extract candidates from videos (filter out null candidates)
              const companyCandidates = videosData.data
                .map(video => video.candidate)
                .filter(candidate => candidate !== null)
                .filter(candidate => {
                  // Deduplicate based on name
                  if (seenCandidates.has(candidate.name)) return false;
                  seenCandidates.add(candidate.name);
                  return true;
                })
                .map(candidate => ({
                  ...candidate,
                  company: {
                    name: company.name,
                    logoUrl: company.logoUrl,
                    thumbnail: company.thumbnail,
                  },
                }));
              allCandidates.push(...companyCandidates);
            }
          } catch (err) {
            console.error(
              'Error fetching videos for company:',
              company.name,
              err
            );
          }
        }

        setCandidates(allCandidates);
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
