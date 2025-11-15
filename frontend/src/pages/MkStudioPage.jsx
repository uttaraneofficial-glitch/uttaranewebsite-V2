import React, { useState, useEffect } from 'react';

const MkStudioPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/public/mkstudio-posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load MK Studio posts: ' + err.message);
        setLoading(false);
      }
    };

    fetchPosts();
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

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="mkstudio-page py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">MK Studio Videos</h1>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative pb-[56.25%] h-0">
                  <img 
                    src={getThumbnail(post)} 
                    alt={post.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href={getYouTubeUrl(post.youtubeId)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  {post.description && (
                    <p className="text-gray-600 text-sm mb-3">{post.description}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No MK Studio videos available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MkStudioPage;