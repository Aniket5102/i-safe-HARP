
'use client';

import { useState, useEffect } from 'react';
import { columns, BbsObservation } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { FileDown, ListFilter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getBbsObservations } from '@/lib/data-loader';
import BbsObservationsByLocationChart from '@/components/bbs-observations-by-location-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function BbsDataPage() {
  const [data, setData] = useState<BbsObservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const observationData = await getBbsObservations();
        const formattedData = observationData.map((item: any) => ({
            ...item,
            data: {
                ...item.data,
                observationDate: new Date(item.data.observationDate),
            },
        }));
        setData(formattedData as BbsObservation[]);
        setLoading(false);
    }
    loadData();
  }, []);

  const handleExport = () => {
    if (data.length === 0) {
        alert('No data to export.');
        return;
    }

    const headers = [
        'ID', 'Observer Name', 'Location', 'Observation Date', 'Task Observed', 
        'Proper Use of PPE', 'Body Positioning', 'Tool and Equipment Handling'
    ];
    
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            item.id,
            `"${item.data.observerName.replace(/"/g, '""')}"`,
            `"${item.data.location.replace(/"/g, '""')}"`,
            format(new Date(item.data.observationDate), 'yyyy-MM-dd HH:mm:ss'),
            `"${item.data.taskObserved.replace(/"/g, '""')}"`,
            item.data.properUseOfPPE,
            item.data.bodyPositioning,
            item.data.toolAndEquipmentHandling,
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bbs_observations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (loading) {
        return <div className="text-center p-8">Loading observations...</div>;
    }
    return <DataTable columns={columns} data={data} filterColumn="id" filterPlaceholder="Filter by Observation ID..." />;
  }

  const chartObservationData = data.map(d => d.data);

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">BBS Observation List</h1>
          <div className="flex items-center gap-2">
            <Link href="/" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </header>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Observations by Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <BbsObservationsByLocationChart data={chartObservationData} />
                </CardContent>
            </Card>
        
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>All Observations</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                            <ListFilter className="mr-2 h-4 w-4" />
                            Filters
                            </Button>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 pt-4">
                        <p className="text-sm text-muted-foreground">Total Records : {loading ? '...' : data.length}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
