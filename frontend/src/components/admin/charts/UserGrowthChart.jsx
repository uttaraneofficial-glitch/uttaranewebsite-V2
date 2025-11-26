import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const UserGrowthChart = ({ data }) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">
        User Growth (Last 7 Days)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              cursor={{ fill: '#374151', opacity: 0.4 }}
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                color: '#F3F4F6',
              }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar
              dataKey="users"
              fill="#10B981"
              name="New Users"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserGrowthChart;
