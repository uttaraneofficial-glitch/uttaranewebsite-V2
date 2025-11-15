import React, { useState, useEffect } from 'react';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    branch: '',
    graduationYear: '',
    roleOffered: '',
    packageOffered: '',
    profileImageUrl: '',
    quote: '',
    linkedinUrl: '',
    companyId: ''
  });
  const [companies, setCompanies] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Add thumbnail preview state

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/admin/companies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
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
      setLoading(false);
    } catch (err) {
      setError('Failed to load candidates: ' + err.message);
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

  // Handle file upload for thumbnail
  const handleFileUpload = async (file) => {
    if (!file) return;

    // In a real implementation, you would upload to Cloudinary or another service
    // For now, we'll create a preview and store the file data
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      setFormData(prev => ({
        ...prev,
        profileImageUrl: reader.result // In real implementation, this would be the Cloudinary URL
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCandidate 
        ? `/api/admin/candidates/${editingCandidate.id}` 
        : '/api/admin/candidates';
      
      const method = editingCandidate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          ...formData,
          graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : null
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Reset form and refresh data
      setFormData({
        name: '',
        college: '',
        branch: '',
        graduationYear: '',
        roleOffered: '',
        packageOffered: '',
        profileImageUrl: '',
        quote: '',
        linkedinUrl: '',
        companyId: ''
      });
      setThumbnailPreview(null); // Reset thumbnail preview
      setEditingCandidate(null);
      setShowForm(false);
      fetchCandidates();
    } catch (err) {
      setError('Failed to save candidate: ' + err.message);
    }
  };

  const handleEdit = (candidate) => {
    setFormData({
      name: candidate.name,
      college: candidate.college || '',
      branch: candidate.branch || '',
      graduationYear: candidate.graduationYear || '',
      roleOffered: candidate.roleOffered || '',
      packageOffered: candidate.packageOffered || '',
      profileImageUrl: candidate.profileImageUrl || '',
      quote: candidate.quote || '',
      linkedinUrl: candidate.linkedinUrl || '',
      companyId: candidate.companyId || ''
    });
    setThumbnailPreview(candidate.profileImageUrl || null); // Set thumbnail preview for editing
    setEditingCandidate(candidate);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/candidates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
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
      college: '',
      branch: '',
      graduationYear: '',
      roleOffered: '',
      packageOffered: '',
      profileImageUrl: '',
      quote: '',
      linkedinUrl: '',
      companyId: ''
    });
    setThumbnailPreview(null); // Reset thumbnail preview
    setEditingCandidate(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6 contrast-text-light">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">Candidate Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Add New Candidate
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 contrast-text-light">
            {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Company *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
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
                  College
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  min="1900"
                  max="2100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Role Offered
                </label>
                <input
                  type="text"
                  name="roleOffered"
                  value={formData.roleOffered}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Package Offered
                </label>
                <input
                  type="text"
                  name="packageOffered"
                  value={formData.packageOffered}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Quote
                </label>
                <textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                    />
                    <p className="text-xs contrast-text-gray mt-1">Upload a profile image</p>
                  </div>
                  {(thumbnailPreview || formData.profileImageUrl) && (
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={thumbnailPreview || formData.profileImageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md mt-2 bg-gray-700 contrast-text-light"
                  placeholder="Or enter image URL"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {editingCandidate ? 'Update' : 'Create'}
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
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Role & Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                College
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={candidate.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`}
                        alt={candidate.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`;
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium contrast-text-light">{candidate.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">{candidate.company?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-light">{candidate.roleOffered}</div>
                  <div className="text-sm contrast-text-gray">{candidate.packageOffered}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm contrast-text-light">
                  <div>{candidate.college}</div>
                  {candidate.graduationYear && (
                    <div className="text-xs contrast-text-gray">({candidate.graduationYear})</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(candidate)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="text-center py-8 contrast-text-gray">
            No candidates found. Add a new candidate to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;