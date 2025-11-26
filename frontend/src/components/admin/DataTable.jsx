import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  title,
  searchPlaceholder = 'Search...',
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data based on search
  const filteredData = data.filter(item =>
    Object.values(item).some(
      value =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // CSV Export
  const handleExport = () => {
    if (!data.length) return;

    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item =>
      columns
        .map(col => {
          const val = item[col.key];
          // Handle commas in data by wrapping in quotes
          return `"${val !== undefined && val !== null ? val : ''}"`;
        })
        .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700">
            <FunnelIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/50 border-b border-gray-800">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  className="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-gray-900"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowsUpDownIcon className="w-3 h-3" />}
                  </div>
                </th>
              ))}
              <th className="p-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-gray-800/50 transition-colors group"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-gray-900"
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key} className="p-4 text-sm text-gray-300">
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="p-8 text-center text-gray-500"
                >
                  No data found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/30">
        <div className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
          <span className="font-medium text-white">
            {Math.min(startIndex + itemsPerPage, sortedData.length)}
          </span>{' '}
          of <span className="font-medium text-white">{sortedData.length}</span>{' '}
          results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              if (
                i + 1 === 1 ||
                i + 1 === totalPages ||
                (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-red-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (
                i + 1 === currentPage - 2 ||
                i + 1 === currentPage + 2
              ) {
                return (
                  <span key={i} className="text-gray-600 px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
