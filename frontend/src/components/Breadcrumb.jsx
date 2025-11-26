import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <nav
      className="flex items-center space-x-2 text-sm mb-6"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-500 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.link && index !== items.length - 1 ? (
            <Link
              to={item.link}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? 'text-red-500 font-medium'
                  : 'text-gray-400'
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
