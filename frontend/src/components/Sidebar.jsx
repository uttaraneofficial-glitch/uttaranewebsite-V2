import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  BuildingOfficeIcon,
  HeartIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  BoltIcon,
  RectangleStackIcon,
  ClockIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  HeartIcon as HeartIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  BoltIcon as BoltIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  ClockIcon as ClockIconSolid,
  QueueListIcon as QueueListIconSolid,
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { path: '/', label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
    {
      path: '/mkstudio',
      label: 'Shorts',
      icon: BoltIcon,
      activeIcon: BoltIconSolid,
    }, // Using MK Studio as Shorts placeholder
    {
      path: '/company',
      label: 'Companies',
      icon: BuildingOfficeIcon,
      activeIcon: BuildingOfficeIconSolid,
    },
  ];

  const secondaryLinks = [
    {
      path: '/ngo',
      label: 'NGO Feed',
      icon: HeartIcon,
      activeIcon: HeartIconSolid,
    },
    {
      path: '/about',
      label: 'About',
      icon: InformationCircleIcon,
      activeIcon: InformationCircleIconSolid,
    },
  ];

  const libraryLinks = [
    {
      path: '#',
      label: 'Library',
      icon: RectangleStackIcon,
      activeIcon: RectangleStackIconSolid,
    },
    {
      path: '#',
      label: 'History',
      icon: ClockIcon,
      activeIcon: ClockIconSolid,
    },
    {
      path: '#',
      label: 'Subscriptions',
      icon: QueueListIcon,
      activeIcon: QueueListIconSolid,
    },
  ];

  const isActive = path => {
    if (path === '#' || path === '/mkstudio') return false; // Placeholder logic
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ link }) => {
    const active = isActive(link.path);
    const Icon = active ? link.activeIcon : link.icon;

    return (
      <Link
        to={link.path}
        className={`flex items-center px-4 py-2.5 mb-1 rounded-lg transition-colors ${
          active
            ? 'bg-red-600/10 text-red-500 font-medium'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Icon
          className={`w-6 h-6 mr-5 ${active ? 'text-red-500' : 'text-gray-400'}`}
        />
        <span className="text-sm tracking-wide">{link.label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 fixed top-16 left-0 bottom-0 bg-black border-r border-gray-800 z-40 overflow-y-auto custom-scrollbar">
      <div className="py-3 px-3">
        {mainLinks.map(link => (
          <NavItem key={link.label} link={link} />
        ))}

        <div className="my-3 border-t border-gray-800 mx-2"></div>

        {libraryLinks.map(link => (
          <NavItem key={link.label} link={link} />
        ))}

        <div className="my-3 border-t border-gray-800 mx-2"></div>

        <h3 className="px-4 py-2 text-sm font-semibold text-gray-400">
          Explore
        </h3>
        {secondaryLinks.map(link => (
          <NavItem key={link.label} link={link} />
        ))}
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <p className="text-xs text-gray-500 leading-relaxed">
          &copy; {new Date().getFullYear()} AH Interviews.
          <br />
          All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
