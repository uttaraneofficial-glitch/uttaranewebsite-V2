import React, { useState, useEffect, useMemo } from 'react';

const NgoPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/public/ngo-posts');
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
    return posts.filter(post => 
      post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="ngo-posts-page py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">NGO Community Feed</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt="NGO post" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  {post.caption && (
                    <p className="text-gray-700">{post.caption}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(post.postedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? `No posts found matching "${searchTerm}"` : 'No NGO posts available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoPostsPage;