import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

    fetchCompanies();
  }, []);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.shortBio && company.shortBio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [companies, searchTerm]);

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

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="companies-page py-8">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">All Companies</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search companies..."
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
        
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map(company => (
              <div key={company.id} className="company-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <Link to={`/company/${company.slug}`}>
                  <div className="company-logo flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 overflow-hidden">
                    <img 
                      src={getCompanyThumbnail(company)} 
                      alt={company.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                  <p className="text-gray-600">{company.shortBio?.substring(0, 100)}...</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? `No companies found matching "${searchTerm}"` : 'No companies available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;