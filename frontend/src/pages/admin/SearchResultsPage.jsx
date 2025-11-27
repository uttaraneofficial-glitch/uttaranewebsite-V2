import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState({
    companies: [],
    candidates: [],
    videos: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.data);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading)
    return <div className="p-8 text-center text-gray-400">Searching...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Search Results for "{query}"
      </h1>

      {/* Companies */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BuildingOffice2Icon className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-white">Companies</h2>
        </div>
        {results.companies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.companies.map(company => (
              <div
                key={company.id}
                className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-lg"
              >
                <h3 className="text-white font-medium">{company.name}</h3>
                <p className="text-gray-500 text-sm">{company.slug}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No companies found.</p>
        )}
      </section>

      {/* Candidates */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <UserGroupIcon className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-white">Candidates</h2>
        </div>
        {results.candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.candidates.map(candidate => (
              <div
                key={candidate.id}
                className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-lg flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                  <img
                    src={
                      candidate.profileImageUrl ||
                      `https://ui-avatars.com/api/?name=${candidate.name}`
                    }
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{candidate.name}</h3>
                  <p className="text-gray-500 text-sm">
                    {candidate.company?.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No candidates found.</p>
        )}
      </section>

      {/* Videos */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <VideoCameraIcon className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-white">Videos</h2>
        </div>
        {results.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.videos.map(video => (
              <div
                key={video.id}
                className="bg-[#1a1a1a] border border-gray-800 p-4 rounded-lg"
              >
                <h3 className="text-white font-medium truncate">
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm">{video.company?.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No videos found.</p>
        )}
      </section>
    </div>
  );
};

export default SearchResultsPage;
