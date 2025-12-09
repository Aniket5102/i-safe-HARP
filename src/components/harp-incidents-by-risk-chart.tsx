
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Incident {
  risk: string;
  [key: string]: any;
}

interface HarpIncidentsByRiskChartProps {
  data: Incident[];
}

const COLORS = {
  high: '#FF6363',
  Medium: '#FFB366',
  low: '#66FF66',
};

export default function HarpIncidentsByRiskChart({ data }: HarpIncidentsByRiskChartProps) {
  const incidentsByRisk = data.reduce((acc, incident) => {
    const riskLevel = incident.risk.toLowerCase();
    acc[riskLevel] = (acc[riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(incidentsByRisk).map(risk => ({
    name: risk.charAt(0).toUpperCase() + risk.slice(1),
    value: incidentsByRisk[risk],
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))' 
            }} 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
