
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';

interface Observation {
  properUseOfPPE: 'safe' | 'at-risk' | 'n/a';
  bodyPositioning: 'safe' | 'at-risk' | 'n/a';
  toolAndEquipmentHandling: 'safe' | 'at-risk' | 'n/a';
  [key: string]: any;
}

interface BbsObservationsStatusChartProps {
  data: Observation[];
}

export default function BbsObservationsStatusChart({ data }: BbsObservationsStatusChartProps) {

  const statusCounts = data.reduce((acc, obs) => {
    if (obs.properUseOfPPE !== 'n/a') {
        acc.properUseOfPPE[obs.properUseOfPPE] = (acc.properUseOfPPE[obs.properUseOfPPE] || 0) + 1;
    }
    if (obs.bodyPositioning !== 'n/a') {
        acc.bodyPositioning[obs.bodyPositioning] = (acc.bodyPositioning[obs.bodyPositioning] || 0) + 1;
    }
    if (obs.toolAndEquipmentHandling !== 'n/a') {
        acc.toolAndEquipmentHandling[obs.toolAndEquipmentHandling] = (acc.toolAndEquipmentHandling[obs.toolAndEquipmentHandling] || 0) + 1;
    }
    return acc;
  }, {
      properUseOfPPE: {} as Record<string, number>,
      bodyPositioning: {} as Record<string, number>,
      toolAndEquipmentHandling: {} as Record<string, number>,
  });
  
  const chartData = [
      {
          name: 'Proper Use of PPE',
          safe: statusCounts.properUseOfPPE.safe || 0,
          'at-risk': statusCounts.properUseOfPPE['at-risk'] || 0,
      },
      {
          name: 'Body Positioning',
          safe: statusCounts.bodyPositioning.safe || 0,
          'at-risk': statusCounts.bodyPositioning['at-risk'] || 0,
      },
      {
          name: 'Tool & Equipment Handling',
          safe: statusCounts.toolAndEquipmentHandling.safe || 0,
          'at-risk': statusCounts.toolAndEquipmentHandling['at-risk'] || 0,
      }
  ];

  return (
    <div style={{ width: '100%', height: 400 }}>
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
          <Legend />
          <Bar dataKey="safe" fill="#66FF66" name="Safe">
             <LabelList dataKey="safe" position="top" />
          </Bar>
          <Bar dataKey="at-risk" fill="#FF6363" name="At-Risk">
            <LabelList dataKey="at-risk" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
