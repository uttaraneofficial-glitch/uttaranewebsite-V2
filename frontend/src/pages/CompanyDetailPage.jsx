import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CompanyDetailPage = () => {
  const { slug } = useParams(); // Changed back to slug
  const [company, setCompany] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRound, setSelectedRound] = useState("All");
  const [availableRounds, setAvailableRounds] = useState([]);

  useEffect(() => {
    const fetchCompanyAndVideos = async () => {
      try {
        // Fetch company details
        const companyResponse = await fetch(`/api/public/companies/${slug}`); // Changed back to slug
        if (!companyResponse.ok) {
          throw new Error(`HTTP error! status: ${companyResponse.status}`);
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.data);

        // Fetch videos for this company with candidate information
        const videosResponse = await fetch(`/api/public/companies/${slug}/videos`); // Changed back to slug
        if (!videosResponse.ok) {
          throw new Error(`HTTP error! status: ${videosResponse.status}`);
        }
        const videosData = await videosResponse.json();
        setVideos(videosData.data);

        // Extract unique round types
        const rounds = [...new Set(videosData.data.map(video => video.roundType).filter(Boolean))];
        setAvailableRounds(rounds);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load company data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndVideos();
  }, [slug]);

  // Filter videos based on selected round
  const filteredVideos = selectedRound === "All" 
    ? videos 
    : videos.filter(video => video.roundType === selectedRound);

  if (loading) return <div className="container py-8 contrast-text-light">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;
  if (!company) return <div className="container py-8 contrast-text-light">Company not found</div>;

  return (
    <div className="company-detail-page py-8" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
      <div className="container">
        <div className="rounded-lg shadow-md p-6 mb-8 border border-red-500 card-hover-effect" style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)' }}>
          <div className="flex items-start mb-6">
            <div className="rounded-full w-16 h-16 flex items-center justify-center mr-4 overflow-hidden border border-red-500" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
              {company.thumbnail || company.logoUrl ? (
                <img 
                  src={company.thumbnail || company.logoUrl} 
                  alt={company.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="contrast-text-light font-bold text-xl">
                  {company.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold contrast-text-light">{company.name}</h1>
              <p className="contrast-text-gray mt-2">{company.shortBio}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg shadow-md p-6 border border-red-500 card-hover-effect" style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)' }}>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedRound("All")}
              className={`px-4 py-2 rounded-full transition ${
                selectedRound === "All"
                  ? "contrast-text-light font-medium btn-hover-effect"
                  : "contrast-text-gray hover:bg-gray-700"
              }`}
              style={selectedRound === "All" ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } : { background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' }}
            >
              All
            </button>
            {availableRounds.map((round) => (
              <button
                key={round}
                onClick={() => setSelectedRound(round)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedRound === round
                    ? "contrast-text-light font-medium btn-hover-effect"
                    : "contrast-text-gray hover:bg-gray-700"
                }`}
                style={selectedRound === round ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } : { background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' }}
              >
                {round}
              </button>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold mb-4 mt-8 contrast-text-light">
            {selectedRound === "All" ? "All Interview Videos" : `${selectedRound} Round Videos`}
          </h2>
          {filteredVideos.length > 0 ? (
            <div className="video-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVideos.map((video) => (
                <div key={video.id} className="video-card rounded-lg overflow-hidden border border-red-500 card-hover-effect">
                  <div className="relative h-48 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : video.youtubeId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="rounded-full w-16 h-16 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 contrast-text-gray" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full w-12 h-12 flex items-center justify-center opacity-80 btn-hover-effect" style={{ background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 contrast-text-light" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold contrast-text-light">{video.title}</h3>
                    {video.roundType && (
                      <p className="contrast-text-gray text-sm mt-1">{video.roundType} Interview</p>
                    )}
                    {video.publishedAt && (
                      <p className="text-gray-500 text-xs mt-1">
                        Published: {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                    
                    {/* Candidate Information */}
                    {video.candidate && (
                      <div className="flex items-center mt-4 rounded-lg p-3 border border-red-500 card-hover-effect" style={{ background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%)' }}>
                        <img
                          src={video.candidate.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.candidate.name)}&background=random`}
                          alt={video.candidate.name}
                          className="w-12 h-12 rounded-full border-2 border-red-500 mr-3 object-cover"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.candidate.name)}&background=random`;
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold contrast-text-light">{video.candidate.name}</h4>
                          <p className="contrast-text-gray text-sm">
                            {video.candidate.college}
                            {video.candidate.graduationYear && ` (${video.candidate.graduationYear})`}
                          </p>
                          <p className="text-red-400 text-sm">
                            {video.candidate.roleOffered} — {video.candidate.packageOffered}
                          </p>
                          {video.candidate.quote && (
                            <p className="contrast-text-gray text-xs italic mt-1">"{video.candidate.quote}"</p>
                          )}
                          {video.candidate.linkedinUrl && (
                            <a
                              href={video.candidate.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 text-xs underline hover:text-red-400 mt-1 inline-block link-hover-effect"
                            >
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg p-8 text-center border border-red-500 card-hover-effect" style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)' }}>
              <p className="contrast-text-gray">No videos available for this company yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailPage;