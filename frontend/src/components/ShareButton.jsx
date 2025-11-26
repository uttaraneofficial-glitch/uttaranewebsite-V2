import React from 'react';

const ShareButton = ({ url, title }) => {
  const handleShare = async () => {
    const shareData = {
      title: title || 'AH Interviews',
      url: url || window.location.href,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(shareData.url);
      }
    } else {
      // Fallback to copy to clipboard
      copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text).then(() => {
      // Show a temporary notification
      const notification = document.createElement('div');
      notification.textContent = 'Link copied to clipboard!';
      notification.className =
        'fixed bottom-20 right-8 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.style.animation = 'fadeIn 0.3s ease-in-out';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
      aria-label="Share this page"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      Share
    </button>
  );
};

export default ShareButton;
