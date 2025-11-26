import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlayIcon } from '@heroicons/react/24/solid';
import VideoModal from '../components/VideoModal';

const CompanyDetailPage = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Videos');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchCompanyAndVideos = async () => {
      try {
        // Fetch company details
        const companyResponse = await fetch(`/api/public/companies/${slug}`);
        if (!companyResponse.ok) {
          throw new Error(`HTTP error! status: ${companyResponse.status}`);
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.data);

        // Fetch videos for this company
        const videosResponse = await fetch(
          `/api/public/companies/${slug}/videos`
        );
        if (!videosResponse.ok) {
          throw new Error(`HTTP error! status: ${videosResponse.status}`);
        }
        const videosData = await videosResponse.json();
        setVideos(videosData.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load company data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndVideos();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex bg-black min-h-screen text-white">
        <main className="flex-1 w-full p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-800 rounded-xl"></div>
            <div className="h-32 bg-gray-800 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!company) return <div className="text-white p-8">Company not found</div>;

  return (
    <div className="flex bg-black min-h-screen text-white">
      <main className="flex-1 w-full">
        {/* Channel Banner */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
          {company.bannerUrl ? (
            <img
              src={company.bannerUrl}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/50" />
          )}
        </div>

        {/* Channel Header */}
        <div className="px-8 py-6 md:px-12 md:py-8 bg-black">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-black bg-gray-800 flex-shrink-0 -mt-12 md:-mt-16 relative z-10">
              {company.logoUrl || company.thumbnail ? (
                <img
                  src={company.logoUrl || company.thumbnail}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                  {company.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <div className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <span>@{company.slug}</span>
                <span>•</span>
                <span>{videos.length} videos</span>
                <span>•</span>
                <span>{company.industry || 'Tech Company'}</span>
              </div>
              <p className="text-gray-400 mt-2 max-w-2xl line-clamp-2">
                {company.shortBio ||
                  `Watch exclusive interview experiences and preparation guides for ${company.name}.`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b border-gray-800 overflow-x-auto scrollbar-hide mb-8">
            {['Videos', 'Candidate Info', 'About'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {videos.map(video => (
                <div
                  key={video.id}
                  className="group cursor-pointer flex flex-col gap-3"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : video.youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <PlayIcon className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      10:00
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex gap-3 items-start">
                    <div className="flex flex-col">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight group-hover:text-white/90">
                        {video.title}
                      </h3>
                      <div className="text-gray-400 text-xs mt-1">
                        <span>{video.views || '1.2K'} views</span>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {video.roundType && (
                        <span className="text-xs text-gray-500 mt-0.5 bg-gray-900 w-fit px-1 rounded">
                          {video.roundType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No videos available for this company yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'Candidate Info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const uniqueCandidates = Array.from(
                  new Map(
                    videos
                      .filter(v => v.candidate)
                      .map(v => [v.candidate.id, v.candidate])
                  ).values()
                );

                if (uniqueCandidates.length === 0) {
                  return (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      No candidate information available for this company.
                    </div>
                  );
                }

                return uniqueCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/50 transition-colors flex flex-col items-center text-center"
                  >
                    <img
                      src={
                        candidate.profileImageUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`
                      }
                      alt={candidate.name}
                      className="w-24 h-24 rounded-full border-4 border-gray-800 object-cover mb-4"
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`;
                      }}
                    />

                    <h3 className="text-xl font-bold text-white mb-6">
                      {candidate.name}
                    </h3>

                    {candidate.linkedinUrl && (
                      <a
                        href={candidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                ));
              })()}
            </div>
          )}

          {activeTab === 'About' && (
            <div className="max-w-3xl text-gray-300 leading-relaxed">
              <h3 className="text-xl font-bold text-white mb-4">Description</h3>
              <p>
                {company.description ||
                  company.shortBio ||
                  'No detailed description available.'}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Stats
                  </h4>
                  <div className="border-t border-gray-800 py-3">
                    Joined {new Date(company.createdAt).toLocaleDateString()}
                  </div>
                  <div className="border-t border-gray-800 py-3">
                    {videos.length} videos
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.youtubeId}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default CompanyDetailPage;
