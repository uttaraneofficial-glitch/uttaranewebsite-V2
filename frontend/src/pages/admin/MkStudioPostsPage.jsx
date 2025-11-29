import React, { useState, useEffect } from 'react';

const MkStudioPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    youtubeId: '',
    title: '',
    description: '',
    publishedAt: new Date().toISOString().split('T')[0], // Keep consistent format
    thumbnail: '', // Add thumbnail field
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Add thumbnail preview state

  useEffect(() => {
    fetchPosts();
  }, []);

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

  // Function to extract YouTube ID from various URL formats
  const extractYouTubeId = url => {
    if (!url) return '';

    // If it's already a simple ID (no slashes), return as is
    if (!url.includes('/') && !url.includes('\\')) {
      return url;
    }

    // Handle various YouTube URL formats
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^#&?]{11})/;
    const match = url.match(regExp);

    if (match && match[1]) {
      return match[1];
    }

    // Handle YouTube channel URLs (like the one mentioned in the issue)
    const channelRegExp =
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_]+)/;
    const channelMatch = url.match(channelRegExp);

    if (channelMatch) {
      // For channel URLs, we can't extract a video ID, so we should show an error
      // But for now, let's just return the original URL to avoid breaking things
      return url;
    }

    // If we can't parse it, return the original
    return url;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    let finalValue = value;

    // Special handling for YouTube ID field
    if (name === 'youtubeId') {
      finalValue = extractYouTubeId(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate YouTube ID
    if (!formData.youtubeId) {
      setError('YouTube ID is required');
      return;
    }

    try {
      const url = editingPost
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/mkstudio-posts/${editingPost.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/admin/mkstudio-posts`;

      const method = editingPost ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('youtubeId', formData.youtubeId);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('publishedAt', formData.publishedAt);

      // Check if we have a file in the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formDataToSend.append('image', fileInput.files[0]);
      } else if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          // Content-Type is automatically set for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and refresh data
      setFormData({
        youtubeId: '',
        title: '',
        description: '',
        publishedAt: new Date().toISOString().split('T')[0],
        thumbnail: '', // Reset thumbnail
      });
      setThumbnailPreview(null); // Reset thumbnail preview
      setEditingPost(null);
      setShowForm(false);
      fetchPosts();
      setError(null);
    } catch (err) {
      setError('Failed to save MK Studio post: ' + err.message);
    }
  };

  const handleEdit = post => {
    setFormData({
      youtubeId: post.youtubeId,
      title: post.title,
      description: post.description || '',
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      thumbnail: post.thumbnail || '', // Add thumbnail
    });
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (
      !window.confirm('Are you sure you want to delete this MK Studio post?')
    ) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/mkstudio-posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchPosts();
    } catch (err) {
      setError('Failed to delete MK Studio post: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      youtubeId: '',
      title: '',
      description: '',
      publishedAt: new Date().toISOString().split('T')[0],
      thumbnail: '', // Reset thumbnail
    });
    setThumbnailPreview(null); // Reset thumbnail preview
    setEditingPost(null);
    setShowForm(false);
    setError(null);
  };

  const handleImageUpload = async file => {
    if (!file) return;

    // In a real implementation, we would upload to Cloudinary here
    // For now, we'll just create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        thumbnail: reader.result, // In real implementation, this would be the Cloudinary URL
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const getThumbnail = post => {
    // Use thumbnail if available, otherwise fallback to YouTube thumbnail
    if (post.thumbnail) {
      return post.thumbnail;
    }
    if (post.youtubeId) {
      return `https://img.youtube.com/vi/${post.youtubeId}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mkstudio-posts-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MK Studio Posts Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add MK Studio Post
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 contrast-text-light">
            {editingPost ? 'Edit MK Studio Post' : 'Add New MK Studio Post'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  YouTube ID or URL
                </label>
                <input
                  type="text"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  placeholder="e.g., dQw4w9WgXcQ or https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  required
                />
                <p className="text-xs contrast-text-gray mt-1">
                  Enter either a YouTube video ID or full YouTube URL
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Thumbnail
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 rounded bg-gray-700 contrast-text-light hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {editingPost ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                  Published Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={getThumbnail(post)}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium contrast-text-light">
                      {post.title}
                    </div>
                    {post.description && (
                      <div className="text-sm contrast-text-gray">
                        {post.description.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm contrast-text-light">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MkStudioPostsPage;
