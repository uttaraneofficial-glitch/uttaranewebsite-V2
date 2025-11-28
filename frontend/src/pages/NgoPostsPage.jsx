import React, { useState, useEffect, useMemo } from 'react';
import { SkeletonNgoPost } from '../components/SkeletonLoader';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

const NgoPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/ngo-posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load NGO posts: ' + err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term (in caption)
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter(
      post =>
        post.caption &&
        post.caption.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const handleSearch = term => {
    setSearchTerm(term);
  };

  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="ngo-posts-page min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      ></div>

      <main className="w-full relative z-10 pt-20">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-white animate-fadeInUp">
            NGO Community Feed
          </h1>

          {/* Search Bar */}
          <div
            className="mb-6 md:mb-12 animate-fadeInUp"
            style={{ animationDelay: '0.1s' }}
          >
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search posts..."
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonNgoPost key={i} />
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation pb-24 md:pb-0">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt="NGO post"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    {post.caption && (
                      <p className="text-gray-300 line-clamp-3 mb-3">
                        {post.caption}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(post.postedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message={
                searchTerm
                  ? `No posts found matching "${searchTerm}"`
                  : 'No NGO posts available yet.'
              }
              actionLabel={searchTerm ? 'Clear Search' : null}
              onAction={searchTerm ? () => setSearchTerm('') : null}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default NgoPostsPage;
