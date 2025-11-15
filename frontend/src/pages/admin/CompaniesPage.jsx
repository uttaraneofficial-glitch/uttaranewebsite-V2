import React, { useState, useEffect } from 'react';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logoUrl: '',
    shortBio: '',
    orderIndex: 0,
    thumbnail: '' // Add thumbnail field
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // Add thumbnail preview state

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/public/companies');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load companies: ' + err.message);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCompany 
        ? `/api/admin/companies/${editingCompany.id}` 
        : '/api/admin/companies';
      
      const method = editingCompany ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Reset form and refresh data
      setFormData({
        name: '',
        slug: '',
        logoUrl: '',
        shortBio: '',
        orderIndex: 0,
        thumbnail: '' // Reset thumbnail
      });
      setThumbnailPreview(null); // Reset thumbnail preview
      setEditingCompany(null);
      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      setError('Failed to save company: ' + err.message);
    }
  };

  const handleEdit = (company) => {
    setFormData({
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl || '',
      shortBio: company.shortBio || '',
      orderIndex: company.orderIndex || 0,
      thumbnail: company.thumbnail || '' // Set thumbnail
    });
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      fetchCompanies();
    } catch (err) {
      setError('Failed to delete company: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      slug: '',
      logoUrl: '',
      shortBio: '',
      orderIndex: 0,
      thumbnail: '' // Reset thumbnail
    });
    setThumbnailPreview(null); // Reset thumbnail preview
    setEditingCompany(null);
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

  const getCompanyThumbnail = (company) => {
    // Use thumbnail if available, otherwise fallback to logoUrl
    if (company.thumbnail) {
      return company.thumbnail;
    }
    if (company.logoUrl) {
      return company.logoUrl;
    }
    return 'https://via.placeholder.com/100x100?text=Logo';
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="companies-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold contrast-text-light">Companies</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Add Company
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4 contrast-text-light">
            {editingCompany ? 'Edit Company' : 'Add New Company'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Name
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
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium contrast-text-gray mb-1">
                  Short Bio
                </label>
                <textarea
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 contrast-text-light"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
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
                {editingCompany ? 'Update' : 'Create'}
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Bio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium contrast-text-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium contrast-text-light">{company.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm contrast-text-gray">{company.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm contrast-text-gray">
                    {company.shortBio?.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
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

export default CompaniesPage;