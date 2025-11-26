import React, { useState, useEffect } from 'react';

const NgoPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async file => {
    if (!file) return;

    // In a real implementation, we would upload to Cloudinary here
    // For now, we'll just create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({
        ...prev,
        imageUrl: reader.result, // In real implementation, this would be the Cloudinary URL
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

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const url = editingPost
        ? `/api/admin/ngo-posts/${editingPost.id}`
        : '/api/admin/ngo-posts';

      const method = editingPost ? 'PUT' : 'POST';

      const requestBody = {
        ...formData,
      };

      // Only include postedAt for new posts, not updates
      if (!editingPost) {
        requestBody.postedAt = new Date().toISOString();
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and refresh data
      setFormData({
        imageUrl: '',
        caption: '',
      });
      setImagePreview(null);
      setEditingPost(null);
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      setError('Failed to save NGO post: ' + err.message);
    }
  };

  const handleEdit = post => {
    setFormData({
      imageUrl: post.imageUrl,
      caption: post.caption || '',
    });
    setImagePreview(post.imageUrl);
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this NGO post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ngo-posts/${id}`, {
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
      setError('Failed to delete NGO post: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      imageUrl: '',
      caption: '',
    });
    setImagePreview(null);
    setEditingPost(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="ngo-posts-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NGO Posts Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add NGO Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingPost ? 'Edit NGO Post' : 'Add New NGO Post'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image for the NGO post
                  </p>
                </div>
                {imagePreview && (
                  <div className="w-32 h-32 border rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-white bg-gray-800"
                rows="3"
                placeholder="Enter a caption for the post"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : editingPost ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'NGO post'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-700 text-sm mb-2">
                  {post.caption?.substring(0, 100)}
                  {post.caption && post.caption.length > 100 ? '...' : ''}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {post.postedAt
                    ? new Date(post.postedAt).toLocaleDateString()
                    : 'N/A'}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NgoPostsPage;
