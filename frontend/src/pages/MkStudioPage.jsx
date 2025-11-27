import React, { useState, useEffect } from 'react';
import { SkeletonVideo } from '../components/SkeletonLoader';
import VideoModal from '../components/VideoModal';
import EmptyState from '../components/EmptyState';

const MkStudioPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/mkstudio-posts`);
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
  const isValidYouTubeId = id => {
    if (!id) return false;
    // YouTube video IDs are 11 characters long and contain only specific characters
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  const getThumbnail = post => {
    // Use thumbnail if available, otherwise fallback to YouTube thumbnail
    if (post.thumbnail) {
      return post.thumbnail;
    }
    if (post.youtubeId && isValidYouTubeId(post.youtubeId)) {
      return `https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  };

  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="mkstudio-page min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      ></div>

      <main className="w-full relative z-10 pt-20">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white animate-fadeInUp">
            MK Studio Videos
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonVideo key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedVideo(post)}
                >
                  <div className="relative pb-[56.25%] h-0 overflow-hidden">
                    <img
                      src={getThumbnail(post)}
                      alt={post.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all">
                      <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {post.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No MK Studio videos available yet." />
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default MkStudioPage;
