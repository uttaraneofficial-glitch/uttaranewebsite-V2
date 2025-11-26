import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const VideosPage = () => {
  const [companies, setCompanies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [formData, setFormData] = useState({
    companyId: '',
    youtubeId: '',
    title: '',
    roundType: 'Technical',
    publishedAt: new Date().toISOString().split('T')[0],
    thumbnail: '',
    candidateId: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const roundTypes = ['HR', 'Technical', 'Communication', 'Aptitude', 'GD'];

  useEffect(() => {
    fetchCompanies();
    fetchVideos();
    fetchCandidates();
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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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
      const response = await fetch('/api/admin/videos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanyChange = e => {
    const companyId = e.target.value;

    setFormData(prev => ({
      ...prev,
      companyId,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const url = editingVideo
        ? `/api/admin/videos/${editingVideo.id}`
        : '/api/admin/videos';

      const method = editingVideo ? 'PUT' : 'POST';

      const requestData = {
        ...formData,
        publishedAt: formData.publishedAt
          ? new Date(formData.publishedAt).toISOString()
          : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setFormData({
        companyId: '',
        youtubeId: '',
        title: '',
        roundType: 'Technical',
        publishedAt: new Date().toISOString().split('T')[0],
        candidateId: '',
      });
      setEditingVideo(null);
      setShowForm(false);
      fetchVideos();
    } catch (err) {
      setError('Failed to save video: ' + err.message);
    }
  };

  const handleEdit = video => {
    setFormData({
      companyId: video.companyId,
      youtubeId: video.youtubeId || '',
      title: video.title,
      roundType: video.roundType || 'Technical',
      publishedAt: video.publishedAt
        ? new Date(video.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      candidateId: video.candidateId || '',
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleDelete = async video => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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
      thumbnail: '',
      candidateId: '',
    });
    setThumbnailPreview(null);
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          thumbnail: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getThumbnail = video => {
    if (video.thumbnail) return video.thumbnail;
    if (video.youtubeId)
      return `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
    return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: video => (
        <div className="w-24 h-14 rounded overflow-hidden bg-gray-800">
          <img
            src={getThumbnail(video)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: video => (
        <span
          className="font-medium text-white block max-w-xs truncate"
          title={video.title}
        >
          {video.title}
        </span>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: video => (
        <span className="text-gray-300 bg-gray-800 px-2 py-1 rounded text-xs">
          {companies.find(c => c.id === video.companyId)?.name || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'candidate',
      label: 'Candidate',
      render: video => {
        const candidate = candidates.find(c => c.id === video.candidateId);
        return candidate ? (
          <span className="text-gray-300 text-sm">{candidate.name}</span>
        ) : (
          <span className="text-gray-500 text-xs">N/A</span>
        );
      },
    },
    {
      key: 'roundType',
      label: 'Round',
      sortable: true,
      render: video => (
        <span className="text-xs font-medium px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {video.roundType || 'N/A'}
        </span>
      ),
    },
    {
      key: 'publishedAt',
      label: 'Published',
      sortable: true,
      render: video =>
        video.publishedAt
          ? new Date(video.publishedAt).toLocaleDateString()
          : 'N/A',
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400">Loading videos...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      {showForm ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {editingVideo ? 'Edit Video' : 'Add New Video'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                >
                  <option value="" className="bg-gray-800">
                    Select a company
                  </option>
                  {companies.map(company => (
                    <option
                      key={company.id}
                      value={company.id}
                      className="bg-gray-800"
                    >
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Candidate
                </label>
                <select
                  name="candidateId"
                  value={formData.candidateId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="" className="bg-gray-800">
                    Select a candidate (optional)
                  </option>
                  {candidates
                    .filter(
                      candidate =>
                        !formData.companyId ||
                        candidate.companyId === formData.companyId
                    )
                    .map(candidate => (
                      <option
                        key={candidate.id}
                        value={candidate.id}
                        className="bg-gray-800"
                      >
                        {candidate.name} ({candidate.roleOffered || 'No role'})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  YouTube ID
                </label>
                <input
                  type="text"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g., dQw4w9WgXcQ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Round Type
                </label>
                <select
                  name="roundType"
                  value={formData.roundType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  {roundTypes.map(type => (
                    <option key={type} value={type} className="bg-gray-800">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Published Date
                </label>
                <input
                  type="date"
                  name="publishedAt"
                  value={formData.publishedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Thumbnail
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      placeholder="Or enter thumbnail URL"
                    />
                  </div>
                  {thumbnailPreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {editingVideo ? 'Update Video' : 'Create Video'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <DataTable
          title="Videos"
          columns={columns}
          data={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search videos..."
          actions={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <VideoCameraIcon className="w-4 h-4" />
              Add Video
            </button>
          }
        />
      )}
    </div>
  );
};

export default VideosPage;
