import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon,
  title = 'No data found',
  message = "There's nothing here yet.",
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full w-24 h-24 flex items-center justify-center mb-6 bg-gray-800 border-2 border-red-500">
        {icon || (
          <svg
            className="w-12 h-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <h3 className="text-2xl font-bold contrast-text-light mb-2">{title}</h3>
      <p className="text-gray-400 text-center max-w-md mb-6">{message}</p>

      {actionLabel &&
        (actionLink || onAction) &&
        (actionLink ? (
          <Link
            to={actionLink}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors btn-hover-effect"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors btn-hover-effect"
          >
            {actionLabel}
          </button>
        ))}
    </div>
  );
};

export default EmptyState;
