import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  VideoCameraIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  PlayIcon, 
  InformationCircleIcon, 
  CogIcon, 
  UserIcon
} from '@heroicons/react/24/outline';

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
    // Special case for dashboard - it should be active when on /admin and no other specific route is active
    if (path === '/admin') {
      return location.pathname === path && !menuItems.some(item => 
        item.path !== '/admin' && location.pathname.startsWith(item.path)
      );
    }
    
    // For all other routes, check if the current path starts with the menu item path
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: HomeIcon },
    { name: 'Companies', path: '/admin/companies', icon: BuildingOfficeIcon },
    { name: 'Videos', path: '/admin/videos', icon: VideoCameraIcon },
    { name: 'Candidates', path: '/admin/candidates', icon: UserGroupIcon },
    { name: 'NGO Posts', path: '/admin/ngo-posts', icon: DocumentTextIcon },
    { name: 'MK Studio', path: '/admin/mkstudio-posts', icon: PlayIcon },
    { name: 'About Content', path: '/admin/about', icon: InformationCircleIcon },
    { name: 'Privacy Policy', path: '/admin/privacy-policy', icon: DocumentTextIcon },
    { name: 'Terms of Service', path: '/admin/terms-of-service', icon: DocumentTextIcon },
    { name: 'Contact Settings', path: '/admin/contact-settings', icon: DocumentTextIcon },
    { name: 'Site Settings', path: '/admin/settings', icon: CogIcon },
    { name: 'Users', path: '/admin/users', icon: UserIcon },
  ];

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
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`block py-3 px-4 rounded-lg transition ${
                    isActive(item.path) 
                      ? 'contrast-text-light font-medium admin-sidebar-text btn-hover-effect' 
                      : 'contrast-text-gray hover:bg-gray-800 admin-sidebar-text'
                  }`}
                  style={isActive(item.path) 
                    ? { background: 'linear-gradient(135deg, #e53935 0%, #c62828 100%)' } 
                    : { background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.3) 100%)' }}
                >
                  <span className="flex items-center">
                    {item.icon ? (
                      <item.icon className="w-5 h-5 mr-3" />
                    ) : (
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
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
              {location.pathname === '/admin/privacy-policy' && 'Privacy Policy'}
              {location.pathname === '/admin/terms-of-service' && 'Terms of Service'}
              {location.pathname === '/admin/contact-settings' && 'Contact Settings'}
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