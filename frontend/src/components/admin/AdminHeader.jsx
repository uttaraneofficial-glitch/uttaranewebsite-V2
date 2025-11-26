import React, { useState, useEffect } from 'react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bg-[#0f0f0f] border-b border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="hidden md:block">
          <h2 className="text-white font-medium">Overview</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center relative"
        >
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 absolute left-3" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 w-64 transition-all"
          />
        </form>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors relative"
          >
            <BellIcon className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f0f0f]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-white font-medium">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors"
                    >
                      <p className="text-sm text-gray-300">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Trigger */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-transparent hover:ring-red-500/50 transition-all">
          A
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
