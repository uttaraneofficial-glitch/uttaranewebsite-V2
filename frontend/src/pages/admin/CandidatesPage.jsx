import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    profileImageUrl: '',
    linkedinUrl: '',
    companyId: '',
  });
  const [companies, setCompanies] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCompanies(data.data || []);
      } catch (err) {
        console.error('Failed to load companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch candidates
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCandidates(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load candidates: ' + err.message);
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

  // Handle file upload for thumbnail
  const handleFileUpload = async file => {
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      // We don't set formData.profileImageUrl here anymore as we'll send the file
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const url = editingCandidate
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates/${editingCandidate.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates`;

      const method = editingCandidate ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('companyId', formData.companyId);
      if (formData.linkedinUrl) formDataToSend.append('linkedinUrl', formData.linkedinUrl);

      // Append other optional fields if they exist in formData (though current form doesn't seem to have them)
      // If you add inputs for them later, make sure to append them here.

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      } else if (formData.profileImageUrl) {
        formDataToSend.append('profileImageUrl', formData.profileImageUrl);
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
        name: '',
        profileImageUrl: '',
        linkedinUrl: '',
        companyId: '',
      });
      setThumbnailPreview(null);
      setSelectedFile(null);
      setEditingCandidate(null);
      setShowForm(false);
      fetchCandidates();
    } catch (err) {
      setError('Failed to save candidate: ' + err.message);
    }
  };

  const handleEdit = candidate => {
    setFormData({
      name: candidate.name,
      profileImageUrl: candidate.profileImageUrl || '',
      linkedinUrl: candidate.linkedinUrl || '',
      companyId: candidate.companyId || '',
    });
    setThumbnailPreview(candidate.profileImageUrl || null);
    setSelectedFile(null);
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDelete = async candidate => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/candidates/${candidate.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchCandidates();
    } catch (err) {
      setError('Failed to delete candidate: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      profileImageUrl: '',
      linkedinUrl: '',
      companyId: '',
    });
    setThumbnailPreview(null);
    setSelectedFile(null);
    setEditingCandidate(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Candidate',
      sortable: true,
      render: candidate => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
            <img
              className="w-full h-full object-cover"
              src={
                candidate.profileImageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`
              }
              alt={candidate.name}
              onError={e => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`;
              }}
            />
          </div>
          <span className="font-medium text-white">{candidate.name}</span>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      render: candidate => (
        <span className="text-gray-300 bg-gray-800 px-2 py-1 rounded text-xs">
          {candidate.company?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'linkedinUrl',
      label: 'LinkedIn',
      render: candidate =>
        candidate.linkedinUrl ? (
          <a
            href={candidate.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs bg-blue-500/10 px-2 py-1 rounded"
          >
            View Profile
          </a>
        ) : (
          <span className="text-gray-500 text-xs">N/A</span>
        ),
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400">Loading candidates...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      {showForm ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
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
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Profile Image
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
                      name="profileImageUrl"
                      value={formData.profileImageUrl}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      placeholder="Or enter image URL"
                    />
                  </div>
                  {(thumbnailPreview || formData.profileImageUrl) && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={thumbnailPreview || formData.profileImageUrl}
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
                {editingCandidate ? 'Update Candidate' : 'Create Candidate'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <DataTable
          title="Candidates"
          columns={columns}
          data={candidates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search candidates..."
          actions={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlusIcon className="w-4 h-4" />
              Add Candidate
            </button>
          }
        />
      )}
    </div>
  );
};

export default CandidatesPage;
