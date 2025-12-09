
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { parseISO } from 'date-fns';

interface Observation {
  location: string;
  [key: string]: any;
}

interface BbsObservationsByLocationChartProps {
  data: Observation[];
}

const COLORS = ["#FF6363", "#FFB366", "#FFFF66", "#66FF66", "#66B2FF", "#6666FF", "#B266FF", "#FF66FF"];

export default function BbsObservationsByLocationChart({ data }: BbsObservationsByLocationChartProps) {
  const observationsByLocation = data.reduce((acc, observation) => {
    acc[observation.location] = (acc[observation.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(observationsByLocation).map((location, index) => ({
    name: location,
    total: observationsByLocation[location],
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="total">
            <LabelList dataKey="total" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
