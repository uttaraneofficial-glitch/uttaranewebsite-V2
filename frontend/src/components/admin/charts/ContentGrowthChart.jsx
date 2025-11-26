import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ContentGrowthChart = ({ data }) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Content Growth</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                color: '#F3F4F6',
              }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="videos"
              stroke="#EF4444"
              activeDot={{ r: 8 }}
              name="Videos"
            />
            <Line
              type="monotone"
              dataKey="candidates"
              stroke="#3B82F6"
              name="Candidates"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentGrowthChart;
