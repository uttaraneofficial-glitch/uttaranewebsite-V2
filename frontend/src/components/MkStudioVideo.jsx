import React, { useState, useEffect } from 'react';

const MkStudioVideo = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const response = await fetch('/api/public/mkstudio-latest');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideo(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load latest video: ' + err.message);
        setLoading(false);
      }
    };

    fetchLatestVideo();
  }, []);

  // Function to validate if a string looks like a YouTube ID
  const isValidYouTubeId = (id) => {
    if (!id) return false;
    // YouTube video IDs are 11 characters long and contain only specific characters
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  const getThumbnail = (post) => {
    // Use thumbnail if available, otherwise fallback to YouTube thumbnail
    if (post.thumbnail) {
      return post.thumbnail;
    }
    if (post.youtubeId && isValidYouTubeId(post.youtubeId)) {
      return `https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  };

  // Function to get the correct YouTube URL
  const getYouTubeUrl = (youtubeId) => {
    if (isValidYouTubeId(youtubeId)) {
      return `https://www.youtube.com/watch?v=${youtubeId}`;
    }
    // If it looks like a URL already, return as is
    if (youtubeId && (youtubeId.startsWith('http://') || youtubeId.startsWith('https://'))) {
      return youtubeId;
    }
    // Fallback
    return 'https://www.youtube.com';
  };

  if (loading) return <div className="text-center py-8">Loading latest video...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!video) return <div className="text-center py-8">No videos available</div>;

  return (
    <div className="mkstudio-video bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
        {video.thumbnail || (video.youtubeId && isValidYouTubeId(video.youtubeId)) ? (
          <div className="absolute top-0 left-0 w-full h-full">
            <img 
              src={getThumbnail(video)} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a 
                href={getYouTubeUrl(video.youtubeId)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No thumbnail available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold">{video.title}</h3>
        {video.description && (
          <p className="text-gray-600 mt-2">{video.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {new Date(video.publishedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default MkStudioVideo;