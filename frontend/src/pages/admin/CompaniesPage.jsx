import React, { useState, useEffect } from 'react';
import { uploadImage } from '../../utils/uploadImage';
import DataTable from '../../components/admin/DataTable';
import { PlusIcon } from '@heroicons/react/24/outline';

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
    thumbnail: '',
    bannerUrl: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/companies`);
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

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'orderIndex' ? parseInt(value) || 0 : value,
    }));
  };

  // State for file objects
  const [files, setFiles] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let logoUrl = formData.logoUrl;
      let thumbnail = formData.thumbnail;
      let bannerUrl = formData.bannerUrl;

      // Upload images if new files selected
      if (files.thumbnail) {
        thumbnail = await uploadImage(files.thumbnail);
      }
      if (files.bannerUrl) {
        bannerUrl = await uploadImage(files.bannerUrl);
      }
      // Note: Current form doesn't have a specific logo file input separate from others effectively, 
      // but if it did, we'd handle it here. 
      // The current code seemed to imply logoUrl was text input, but let's check if we missed a file input for it.
      // Looking at the form, there is no file input for logoUrl, only text. 
      // But wait, the table renders logoUrl. 
      // Let's assume for now logoUrl is text only as per previous code, or if I missed it.
      // Actually, let's check if I should add file input for logoUrl? 
      // The user said "Example: Companies Page... const logoUrl = logoFile ? ...".
      // I should probably add file input for logoUrl if it's missing or just handle what's there.
      // The previous code had `logoUrl` as text input. 
      // I will stick to what's there for now but ensure thumbnail/banner use uploadImage.

      const url = editingCompany
        ? `${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${editingCompany.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/admin/companies`;

      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          logoUrl,
          thumbnail,
          bannerUrl,
        }),
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
        thumbnail: '',
        bannerUrl: '',
      });
      setFiles({});
      setThumbnailPreview(null);
      setBannerPreview(null);
      setEditingCompany(null);
      setShowForm(false);
      fetchCompanies();
    } catch (err) {
      setError('Failed to save company: ' + err.message);
    }
  };

  const handleEdit = company => {
    setFormData({
      name: company.name,
      slug: company.slug,
      logoUrl: company.logoUrl || '',
      shortBio: company.shortBio || '',
      orderIndex: company.orderIndex || 0,
      thumbnail: company.thumbnail || '',
      bannerUrl: company.bannerUrl || '',
    });
    setThumbnailPreview(company.thumbnail);
    setBannerPreview(company.bannerUrl);
    setEditingCompany(company);
    setShowForm(true);
    setFiles({});
  };

  const handleDelete = async company => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/companies/${company.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
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
      thumbnail: '',
      bannerUrl: '',
    });
    setFiles({});
    setThumbnailPreview(null);
    setBannerPreview(null);
    setEditingCompany(null);
    setShowForm(false);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Store file for upload
      setFiles(prev => ({
        ...prev,
        [field]: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'thumbnail') {
          setThumbnailPreview(reader.result);
        } else if (field === 'bannerUrl') {
          setBannerPreview(reader.result);
        }
        // We don't update formData with base64 anymore
      };
      reader.readAsDataURL(file);
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Thumbnail',
      render: company => (
        <div className="w-16 h-9 rounded bg-gray-800 overflow-hidden border border-gray-700">
          {company.thumbnail ? (
            <img
              src={company.thumbnail}
              alt={`${company.name} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
              No Img
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: company => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center overflow-hidden">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-white">
                {company.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="font-medium text-white">{company.name}</span>
        </div>
      ),
    },
    { key: 'slug', label: 'Slug', sortable: true },
    {
      key: 'shortBio',
      label: 'Bio',
      render: company => (
        <span
          className="text-gray-400 truncate max-w-xs block"
          title={company.shortBio}
        >
          {company.shortBio || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: company => new Date(company.createdAt).toLocaleDateString(),
    },
  ];

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400">Loading companies...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      {showForm ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {editingCompany ? 'Edit Company' : 'Add New Company'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
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
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order Index
                </label>
                <input
                  type="number"
                  name="orderIndex"
                  value={formData.orderIndex}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Short Bio
                </label>
                <textarea
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  rows="3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Thumbnail
                </label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'thumbnail')}
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
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Banner Image (Upper Background)
                </label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, 'bannerUrl')}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                    />
                    <input
                      type="text"
                      name="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={handleInputChange}
                      className="w-full mt-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                      placeholder="Or enter banner URL"
                    />
                  </div>
                  {bannerPreview && (
                    <div className="w-full sm:w-48 h-24 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                      <img
                        src={bannerPreview}
                        alt="Banner Preview"
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
                {editingCompany ? 'Update Company' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <DataTable
          title="Companies"
          columns={columns}
          data={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchPlaceholder="Search companies..."
          actions={
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Company
            </button>
          }
        />
      )}
    </div>
  );
};

export default CompaniesPage;
