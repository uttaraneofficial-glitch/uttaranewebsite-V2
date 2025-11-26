import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/companies', label: 'Companies', icon: BuildingOffice2Icon },
    { path: '/admin/candidates', label: 'Candidates', icon: UserGroupIcon },
    { path: '/admin/videos', label: 'Videos', icon: VideoCameraIcon },
    { path: '/admin/ngo-posts', label: 'NGO Posts', icon: DocumentTextIcon },
    {
      path: '/admin/mkstudio-posts',
      label: 'MK Studio',
      icon: VideoCameraIcon,
    },
  ];

  const contentItems = [
    { path: '/admin/about', label: 'About Page', icon: DocumentTextIcon },
    {
      path: '/admin/privacy-policy',
      label: 'Privacy Policy',
      icon: ShieldCheckIcon,
    },
    {
      path: '/admin/terms-of-service',
      label: 'Terms of Service',
      icon: DocumentTextIcon,
    },
    {
      path: '/admin/contact-settings',
      label: 'Contact Settings',
      icon: EnvelopeIcon,
    },
  ];

  const isActive = path => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive(item.path)
          ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <item.icon
        className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}
      />
      <span className="font-medium">{item.label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                AH
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Admin<span className="text-red-500">Panel</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto lg:hidden text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Main Menu
              </h3>
              <div className="space-y-1">
                {menuItems.map(item => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Content Management
              </h3>
              <div className="space-y-1">
                {contentItems.map(item => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                System
              </h3>
              <div className="space-y-1">
                <NavItem
                  item={{
                    path: '/admin/settings',
                    label: 'Settings',
                    icon: Cog6ToothIcon,
                  }}
                />
                <NavItem
                  item={{
                    path: '/admin/users',
                    label: 'User Management',
                    icon: UserGroupIcon,
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-gray-800 bg-[#0a0a0a]">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@example.com
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                window.location.href = '/admin/login';
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
