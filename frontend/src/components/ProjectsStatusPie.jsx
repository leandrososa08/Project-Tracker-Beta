import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProjectsStatusPie({ data }) {
  const chartData = data.map(p => ({ name: p.title, value: p.progress }));
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088fe'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="value" data={chartData} outerRadius={80} label>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
