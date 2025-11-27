import React, { useState, useEffect } from 'react';

const MkStudioVideo = () => {
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/mkstudio-latest`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideo(data.data);
        setChannel(data.channel);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load latest video: ' + err.message);
        setLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  const isValidYouTubeId = id => {
    if (!id) return false;
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  const getThumbnail = post => {
    if (post.thumbnail) return post.thumbnail;
    if (post.youtubeId && isValidYouTubeId(post.youtubeId)) {
      return `https://img.youtube.com/vi/${post.youtubeId}/maxresdefault.jpg`;
    }
    return 'https://via.placeholder.com/1280x720?text=No+Thumbnail';
  };

  const getYouTubeUrl = youtubeId => {
    if (isValidYouTubeId(youtubeId))
      return `https://www.youtube.com/watch?v=${youtubeId}`;
    if (
      youtubeId &&
      (youtubeId.startsWith('http://') || youtubeId.startsWith('https://'))
    )
      return youtubeId;
    return 'https://www.youtube.com';
  };

  if (loading)
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-[#0f0f0f] rounded-xl border border-gray-800 animate-pulse">
        <div className="h-64 bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-8 bg-gray-800 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      </div>
    );

  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!video)
    return (
      <div className="text-center py-8 text-gray-500">No videos available</div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* YouTube Channel Header Style */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-black p-[2px]">
            {channel?.imageUrl ? (
              <img
                src={channel.imageUrl}
                alt={channel.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                {channel?.name
                  ? channel.name.substring(0, 2).toUpperCase()
                  : 'MK'}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {channel?.name || 'MK Studio'}
            </h3>
            <p className="text-gray-400 text-xs">
              {channel?.tagline || 'Official Channel'}
            </p>
          </div>
        </div>
        <a
          href={channel?.subscribeUrl || 'https://www.youtube.com/@MKStudio'}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#cc0000] hover:bg-[#ff0000] text-white text-sm font-semibold px-6 py-2 rounded-full transition-colors uppercase tracking-wide"
        >
          Subscribe
        </a>
      </div>

      {/* Main Video Card */}
      <div className="group relative bg-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800 hover:border-red-900/50 transition-all duration-300 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Thumbnail Section */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={getThumbnail(video)}
              alt={video.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <a
                href={getYouTubeUrl(video.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
              LATEST UPLOAD
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              New Video
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight line-clamp-2 group-hover:text-red-500 transition-colors">
              {video.title}
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {video.description ||
                'Watch the latest interview experience and learn from the best. Click to watch full video on YouTube.'}
            </p>

            <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {new Date(video.publishedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <a
                href={getYouTubeUrl(video.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm font-semibold hover:text-red-500 transition-colors flex items-center gap-2"
              >
                Watch Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MkStudioVideo;
