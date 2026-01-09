
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

export default function BbsDataPage() {
  const [data, setData] = useState<BbsObservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const observationData = await getBbsObservations();
        // The data loader already formats the data, so we just need to parse the date
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
    // This is a placeholder for the export functionality.
    alert('Export functionality is not implemented yet.');
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
