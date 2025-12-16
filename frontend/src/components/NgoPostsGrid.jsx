import React, { useState, useEffect } from 'react';

const NgoPostsGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/ngo-posts`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load NGO posts: ' + err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return <div className="text-center py-8">Loading NGO posts...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="ngo-posts-grid pb-24 md:pb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={post.imageUrl}
              alt={post.caption || 'NGO post'}
              className="w-full h-40 md:h-48 object-cover"
              loading="lazy"
            />
            {post.caption && (
              <div className="p-4">
                <p className="text-gray-700">{post.caption}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(post.postedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NgoPostsGrid;
