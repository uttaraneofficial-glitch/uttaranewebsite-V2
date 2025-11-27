import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { SkeletonCard } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'FAANG',
    'Startups',
    'Service Based',
    'Product Based',
    'Fintech',
    'Unicorns',
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public/companies`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCompanies(data.data);
      } catch (err) {
        setError('Failed to load companies: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search term and category
  const filteredCompanies = useMemo(() => {
    let result = companies;

    if (searchTerm) {
      result = result.filter(
        company =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (company.shortBio &&
            company.shortBio.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Note: Since we don't have real categories in the data yet,
    // we'll just simulate filtering for demonstration if the user clicks a chip other than "All"
    if (selectedCategory !== 'All') {
      // result = result.filter(c => c.category === selectedCategory);
    }

    return result;
  }, [companies, searchTerm, selectedCategory]);

  const getCompanyThumbnail = company => {
    return company.thumbnail || null;
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white relative overflow-hidden">
      {/* Animated Particles/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/20 rounded-full blur-3xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      ></div>

      <main className="flex-1 w-full relative z-10">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Category Chips */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px - 4 py - 1.5 rounded - lg text - sm font - medium whitespace - nowrap transition - colors ${selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto md:mx-0">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search companies..."
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
              {filteredCompanies.map(company => (
                <Link
                  to={`/company/${company.slug}`}
                  key={company.id}
                  className="group flex flex-col gap-2 md:gap-3 cursor-pointer"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden bg-gray-900 border border-white/5 group-hover:rounded-none transition-all duration-200">
                    {getCompanyThumbnail(company) ? (
                      <img
                        src={getCompanyThumbnail(company)}
                        alt={company.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                        <span className="text-2xl md:text-4xl font-bold text-white/20">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* Info Section */}
                  <div className="flex gap-2 md:gap-3 items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                            {company.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-white/90 truncate">
                        {company.name}
                      </h3>
                      <div className="text-gray-400 text-xs md:text-sm mt-0.5 md:mt-1 flex flex-col">
                        <span className="hover:text-white transition-colors truncate">
                          {company.industry || 'Technology'}
                        </span>
                        <span className="text-[10px] md:text-xs mt-0.5 hidden md:block">
                          View Interview Experiences
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No companies found"
              message={
                searchTerm
                  ? `We couldn't find any companies matching "${searchTerm}".`
                  : 'No companies available yet.'
              }
              actionLabel={searchTerm ? 'Clear Search' : null}
              onAction={searchTerm ? () => setSearchTerm('') : null}
            />
          )}
        </div >
      </main >
    </div >
  );
};

export default CompaniesPage;
