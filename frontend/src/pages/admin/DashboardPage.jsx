import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    companies: 0,
    videos: 0,
    ngoPosts: 0,
    mkStudioPosts: 0,
    users: 1
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch companies count
      const companiesResponse = await fetch('/api/public/companies');
      const companiesData = await companiesResponse.json();
      
      // Fetch videos count
      // For now we'll use a placeholder, in real implementation we would have an endpoint
      const videosCount = 0;
      
      // Fetch NGO posts count
      const ngoResponse = await fetch('/api/public/ngo-posts');
      const ngoData = await ngoResponse.json();
      
      // Fetch MK Studio posts count
      const mkStudioResponse = await fetch('/api/public/mkstudio-posts');
      const mkStudioData = await mkStudioResponse.json();
      
      setStats({
        companies: companiesData.data?.length || 0,
        videos: videosCount,
        ngoPosts: ngoData.data?.length || 0,
        mkStudioPosts: mkStudioData.data?.length || 0,
        users: 1 // Default admin user
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // In a real implementation, you would fetch actual activity data from your API
      // For now, we'll use mock data
      setRecentActivity([
        {
          id: 1,
          action: 'New company added',
          description: 'TechCorp was added to the platform',
          time: '2 hours ago',
          type: 'company'
        },
        {
          id: 2,
          action: 'Video uploaded',
          description: 'New interview video for Google',
          time: '5 hours ago',
          type: 'video'
        },
        {
          id: 3,
          action: 'NGO post created',
          description: 'Community support initiative',
          time: '1 day ago',
          type: 'ngo'
        },
        {
          id: 4,
          action: 'MK Studio post',
          description: 'New podcast episode published',
          time: '2 days ago',
          type: 'mkstudio'
        }
      ]);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const getIconForActivity = (type) => {
    switch (type) {
      case 'company':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.586-4.586A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'ngo':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'mkstudio':
        return (
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) return <div className="p-4 contrast-text-light">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6 contrast-text-light">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-900 p-3 mr-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-sm contrast-text-gray">Companies</p>
              <p className="text-2xl font-bold contrast-text-light">{stats.companies}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="rounded-full bg-red-900 p-3 mr-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.586-4.586A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm contrast-text-gray">Videos</p>
              <p className="text-2xl font-bold contrast-text-light">{stats.videos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full bg-green-900 p-3 mr-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm contrast-text-gray">NGO Posts</p>
              <p className="text-2xl font-bold contrast-text-light">{stats.ngoPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-900 p-3 mr-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm contrast-text-gray">MK Studio</p>
              <p className="text-2xl font-bold contrast-text-light">{stats.mkStudioPosts}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 contrast-text-light">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/companies" className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-900 p-2 mr-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="font-medium contrast-text-light">Add Company</span>
              </div>
            </a>
            <a href="/admin/videos" className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
              <div className="flex items-center">
                <div className="rounded-full bg-red-900 p-2 mr-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="font-medium contrast-text-light">Add Video</span>
              </div>
            </a>
            <a href="/admin/ngo-posts" className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
              <div className="flex items-center">
                <div className="rounded-full bg-green-900 p-2 mr-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="font-medium contrast-text-light">Add NGO Post</span>
              </div>
            </a>
            <a href="/admin/mkstudio-posts" className="block p-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-900 p-2 mr-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="font-medium contrast-text-light">Add MK Studio</span>
              </div>
            </a>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 contrast-text-light">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="mt-1 mr-3">
                  {getIconForActivity(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium contrast-text-light">{activity.action}</p>
                  <p className="text-sm contrast-text-gray">{activity.description}</p>
                  <p className="text-xs contrast-text-gray mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;