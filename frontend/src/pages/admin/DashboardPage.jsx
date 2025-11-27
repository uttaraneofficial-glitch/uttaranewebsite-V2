import React, { useState, useEffect } from 'react';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  VideoCameraIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import StatCard from '../../components/admin/StatCard';
import ContentGrowthChart from '../../components/admin/charts/ContentGrowthChart';
import UserGrowthChart from '../../components/admin/charts/UserGrowthChart';
import CompanyDistributionChart from '../../components/admin/charts/CompanyDistributionChart';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        };

        const [statsRes, chartsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/stats`, { headers }),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/charts`, { headers }),
        ]);

        if (!statsRes.ok || !chartsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const statsJson = await statsRes.json();
        const chartsJson = await chartsRes.json();

        setStats(statsJson.data);
        setChartData(chartsJson.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-400">Loading dashboard...</div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const statCards = [
    {
      title: 'Total Companies',
      value: stats?.companies?.value || 0,
      icon: BuildingOffice2Icon,
      trend: stats?.companies?.trend,
      trendValue: stats?.companies?.trendValue,
      color: 'blue',
    },
    {
      title: 'Total Candidates',
      value: stats?.candidates?.value || 0,
      icon: UserGroupIcon,
      trend: stats?.candidates?.trend,
      trendValue: stats?.candidates?.trendValue,
      color: 'green',
    },
    {
      title: 'Total Videos',
      value: stats?.videos?.value || 0,
      icon: VideoCameraIcon,
      trend: stats?.videos?.trend,
      trendValue: stats?.videos?.trendValue,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: stats?.users?.value || 0,
      icon: UserPlusIcon,
      trend: stats?.users?.trend,
      trendValue: stats?.users?.trendValue,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex gap-2">
          <select className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Growth - Full Width on Mobile, Half on Desktop */}
          <div className="lg:col-span-2">
            <ContentGrowthChart data={chartData.contentGrowth} />
          </div>

          {/* User Growth */}
          <UserGrowthChart data={chartData.userGrowth} />

          {/* Company Distribution */}
          <CompanyDistributionChart data={chartData.companyDistribution} />
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                  <UserPlusIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    New candidate registered
                  </p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                New User
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
