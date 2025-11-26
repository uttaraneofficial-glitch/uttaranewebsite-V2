import React from 'react';

// Skeleton Card Component
export const SkeletonCard = () => (
  <div
    className="company-card rounded-lg shadow-md p-6 border border-red-500 animate-pulse"
    style={{
      background:
        'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)',
    }}
  >
    <div className="company-logo flex items-center justify-center w-16 h-16 rounded-full mb-4 overflow-hidden border border-red-500 bg-gray-800"></div>
    <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-800 rounded w-full mb-1"></div>
    <div className="h-4 bg-gray-800 rounded w-5/6"></div>
  </div>
);

// Skeleton Text Component
export const SkeletonText = ({ lines = 3, width = 'full' }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-gray-800 rounded ${
          index === lines - 1 ? 'w-4/5' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

// Skeleton Video Card Component
export const SkeletonVideo = () => (
  <div className="video-card rounded-lg overflow-hidden border border-red-500 animate-pulse">
    <div className="relative h-48 bg-gray-800"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-800 rounded w-3/4"></div>
      <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      <div className="h-4 bg-gray-800 rounded w-1/3"></div>
    </div>
  </div>
);

// Skeleton Hero Component
export const SkeletonHero = () => (
  <section className="hero-section relative py-32 md:py-48 animate-pulse">
    <div className="absolute inset-0 bg-gray-900"></div>
    <div className="container relative z-10 text-center">
      <div className="h-12 bg-gray-800 rounded w-3/4 mx-auto mb-6"></div>
      <div className="h-6 bg-gray-800 rounded w-1/2 mx-auto mb-8"></div>
      <div className="flex justify-center space-x-6">
        <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
        <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
        <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
      </div>
    </div>
  </section>
);

// Skeleton Company Detail Header
export const SkeletonCompanyHeader = () => (
  <div
    className="rounded-lg shadow-md p-6 mb-8 border border-red-500 animate-pulse"
    style={{
      background:
        'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%)',
    }}
  >
    <div className="flex items-start mb-6">
      <div className="rounded-full w-16 h-16 bg-gray-800 mr-4"></div>
      <div className="flex-1 space-y-3">
        <div className="h-8 bg-gray-800 rounded w-1/3"></div>
        <div className="h-4 bg-gray-800 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

// Skeleton NGO Post
export const SkeletonNgoPost = () => (
  <div className="rounded-lg overflow-hidden shadow-md border border-red-500 animate-pulse">
    <div className="h-48 bg-gray-800"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-800 rounded w-full"></div>
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
    </div>
  </div>
);

// Main Skeleton Loader Component
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard />;
      case 'video':
        return <SkeletonVideo />;
      case 'hero':
        return <SkeletonHero />;
      case 'text':
        return <SkeletonText />;
      case 'companyHeader':
        return <SkeletonCompanyHeader />;
      case 'ngoPost':
        return <SkeletonNgoPost />;
      default:
        return <SkeletonCard />;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;
