
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

interface Incident {
  date: Date;
  [key: string]: any;
}

interface IncidentsByMonthChartProps {
  data: Incident[];
}

export default function IncidentsByMonthChart({ data }: IncidentsByMonthChartProps) {
  const incidentsByMonth = data.reduce((acc, incident) => {
    const month = format(new Date(incident.date), 'yyyy-MM');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(incidentsByMonth)
    .sort()
    .map(month => ({
      name: format(parseISO(`${month}-01`), 'MMM yy'),
      incidents: incidentsByMonth[month],
    }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
             contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))' 
            }} 
            cursor={{fill: 'hsl(var(--accent))'}}
          />
          <Legend />
          <Area type="monotone" dataKey="incidents" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
