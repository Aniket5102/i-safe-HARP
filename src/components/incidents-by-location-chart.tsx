
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface Incident {
  location: string;
  [key: string]: any;
}

interface IncidentsByLocationChartProps {
  data: Incident[];
}

export default function IncidentsByLocationChart({ data }: IncidentsByLocationChartProps) {
  const incidentsByLocation = data.reduce((acc, incident) => {
    acc[incident.location] = (acc[incident.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(incidentsByLocation).map((location) => ({
    name: location,
    total: incidentsByLocation[location],
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))' 
            }} 
            cursor={{fill: 'hsl(var(--accent))'}}
          />
          <Bar dataKey="total" fill="hsl(var(--primary))">
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
