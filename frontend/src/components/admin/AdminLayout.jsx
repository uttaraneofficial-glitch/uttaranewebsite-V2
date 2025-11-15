import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // Optionally verify token with backend
      try {
        // If you want to verify the token with the backend, you can do it here
        // const response = await fetch('/api/auth/verify', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // if (!response.ok) throw new Error('Invalid token');
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear the access token from localStorage
        localStorage.removeItem('accessToken');
        // Redirect to login page
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the token and redirect
      localStorage.removeItem('accessToken');
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="admin-layout flex h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
      {/* Sidebar */}
      <div className="sidebar w-64 shadow-md flex flex-col border-r border-red-500" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #e53935 100%)' }}>
        <div className="p-4 border-b border-red-500">
          <h1 className="text-xl font-bold text-red-500 admin-sidebar-text">Admin Panel</h1>
          <p className="text-xs contrast-text-gray admin-sidebar-text">Content Management</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin') && !['/admin/companies', '/admin/videos', '/admin/candidates', '/admin/ngo-posts', '/admin/mkstudio-posts', '/admin/about', '/admin/settings', '/admin/users'].some(path => isActive(path))
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin') && !['/admin/companies', '/admin/videos', '/admin/candidates', '/admin/ngo-posts', '/admin/mkstudio-posts', '/admin/about', '/admin/settings', '/admin/users'].some(path => isActive(path)) 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/companies" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/companies')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/companies') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Companies
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/videos" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/videos')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/videos') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.586-4.586A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Videos
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/candidates" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/candidates')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/candidates') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Candidates
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/ngo-posts" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/ngo-posts')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/ngo-posts') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  NGO Posts
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/mkstudio-posts" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/mkstudio-posts')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/mkstudio-posts') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  MK Studio
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/about" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/about')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/about') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About Me
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/settings" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/settings')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/settings') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className={`block py-3 px-4 rounded-lg transition ${
                  isActive('/admin/users')
                    ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                    : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                }`}
                style={isActive('/admin/users') 
                  ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                  : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Management
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-red-500">
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 text-left rounded-lg contrast-text-gray hover:bg-gray-800 transition flex items-center admin-sidebar-text btn-hover-effect"
            style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        <header className="shadow-sm p-4 border-b border-red-500" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)' }}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold admin-header-text">
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/companies' && 'Companies Management'}
              {location.pathname === '/admin/videos' && 'Videos Management'}
              {location.pathname === '/admin/candidates' && 'Candidates Management'}
              {location.pathname === '/admin/ngo-posts' && 'NGO Posts Management'}
              {location.pathname === '/admin/mkstudio-posts' && 'MK Studio Management'}
              {location.pathname === '/admin/about' && 'About Content'}
              {location.pathname === '/admin/settings' && 'Site Settings'}
              {location.pathname === '/admin/users' && 'User Management'}
            </h2>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg flex items-center contrast-text-light btn-hover-effect"
              style={{ background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;