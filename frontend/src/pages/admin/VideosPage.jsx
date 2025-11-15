import React, { useState, useEffect } from 'react';

const VideosPage = () => {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]); // Add candidates state
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [formData, setFormData] = useState({
    companyId: '',
    youtubeId: '',
    title: '',
    roundType: 'Technical',
    publishedAt: new Date().toISOString().split('T')[0],
    thumbnail: '', // Add thumbnail field
    candidateId: '' // Add candidateId field
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Add thumbnail preview state

  // Round type options
  const roundTypes = ['HR', 'Technical', 'Communication', 'Aptitude', 'GD'];

  useEffect(() => {
    fetchCompanies();
    fetchVideos();
    fetchCandidates(); // Fetch candidates
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/public/companies');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data.data);
    } catch (err) {
      console.error('Fetch companies error:', err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/admin/candidates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCandidates(data.data || []);
    } catch (err) {
      console.error('Fetch candidates error:', err);
    }
  };

  const fetchVideos = async () => {
    try {
      // For now, we'll fetch all videos
      // In a real implementation, we might want to fetch videos per company
      const response = await fetch('/api/admin/videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVideos(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load videos: ' + err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChange = (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setFormData(prev => ({
      ...prev,
      companyId
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingVideo 
        ? `/api/admin/videos/${editingVideo.id}` 
        : '/api/admin/videos';
      
      const method = editingVideo ? 'PUT' : 'POST';
      
      // Format the data properly
      const requestData = {
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // Reset form and refresh data
      setFormData({
        companyId: '',
        youtubeId: '',
        title: '',
        roundType: 'Technical',
        publishedAt: new Date().toISOString().split('T')[0],
        candidateId: '' // Reset candidateId
      });
      setEditingVideo(null);
      setShowForm(false);
      fetchVideos();
    } catch (err) {
      setError('Failed to save video: ' + err.message);
    }
  };

  const handleEdit = (video) => {
    setFormData({
      companyId: video.companyId,
      youtubeId: video.youtubeId || '',
      title: video.title,
      roundType: video.roundType || 'Technical',
      publishedAt: video.publishedAt ? new Date(video.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      candidateId: video.candidateId || '' // Add candidateId
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchVideos();
    } catch (err) {
      setError('Failed to delete video: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      companyId: '',
      youtubeId: '',
      title: '',
      roundType: 'Technical',
      publishedAt: new Date().toISOString().split('T')[0],
      thumbnail: '', // Reset thumbnail
      candidateId: '' // Reset candidateId
    });
    setThumbnailPreview(null); // Reset thumbnail preview
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // In a real implementation, we would upload to Cloudinary here
    // For now, we'll just create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        thumbnail: reader.result // In real implementation, this would be the Cloudinary URL
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const getThumbnail = (video) => {
    // Use thumbnail if available, otherwise fallback to YouTube thumbnail
    if (video.thumbnail) {
      return video.thumbnail;
    }
    if (video.youtubeId) {
      return `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
    }
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="videos-page admin-panel">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">Videos Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Add Video
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 contrast-text-light">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Company
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleCompanyChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  required
                >
                  <option value="" className="bg-red-600 text-white">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id} className="bg-red-600 text-white">
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Candidate
                </label>
                <select
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                >
                  <option value="" className="bg-red-600 text-white">Select a candidate (optional)</option>
                  {candidates
                    .filter(candidate => !formData.companyId || candidate.companyId === formData.companyId)
                    .map(candidate => (
                      <option key={candidate.id} value={candidate.id} className="bg-red-600 text-white">
                        {candidate.name} ({candidate.roleOffered || 'No role'})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  YouTube ID
                </label>
                <input
                  type="text"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  placeholder="e.g., dQw4w9WgXcQ"
                />
              </div>
              <div>
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
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Round Type
                </label>
                <select
                  name="roundType"
                  value={formData.roundType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                >
                  {roundTypes.map(type => (
                    <option key={type} value={type} className="bg-red-600 text-white">
                      {type}
                    </option>
                  ))}
                </select>
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
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    />
                    <p className="text-xs contrast-text-gray mt-1">Upload a custom thumbnail</p>
                  </div>
                  {thumbnailPreview && (
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md mt-2 bg-gray-700 contrast-text-light"
                  placeholder="Or enter thumbnail URL"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingVideo ? 'Update' : 'Create'}
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

      <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Round Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={getThumbnail(video)} 
                    alt={video.title} 
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium contrast-text-light">{video.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">
                    {companies.find(c => c.id === video.companyId)?.name || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">
                    {candidates.find(c => c.id === video.candidateId)?.name || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">{video.roundType || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">
                    {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(video)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
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
  );
};

export default VideosPage;