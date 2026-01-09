
'use client';

import { useState, useEffect } from 'react';
import { columns, HarpIncident } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { FileDown, ListFilter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import IncidentsByLocationChart from '@/components/incidents-by-location-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHarpIncidents } from '@/lib/data-loader';
import { format } from 'date-fns';

export default function HarpDataPage() {
  const [data, setData] = useState<HarpIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const incidentData = await getHarpIncidents();
        const formattedData = incidentData.map((item: any) => ({
          ...item,
          harpId: item.harpid,
          carriedOutBy: item.carriedoutby,
          employeeType: item.employeetype,
          employeeName: item.employeename,
          employeeId: item.employeeid,
          employeeDepartment: item.employeedepartment,
          otherObservation: item.otherobservation,
          date: new Date(item.date),
        }));
        setData(formattedData as HarpIncident[]);
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
        'HARP ID', 'Date', 'Location', 'Department', 'Employee Name', 'Hazard', 'Risk'
    ];
    
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            item.harpId,
            format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss'),
            `"${item.location.replace(/"/g, '""')}"`,
            `"${item.department.replace(/"/g, '""')}"`,
            `"${item.employeeName.replace(/"/g, '""')}"`,
            `"${item.hazard.replace(/"/g, '""')}"`,
            `"${item.risk.replace(/"/g, '""')}"`,
        ].join(','))
    ].join('\n');


     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'harp_incidents.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (loading) {
        return <div className="text-center p-8">Loading incidents...</div>;
    }
    return <DataTable columns={columns} data={data} filterColumn="harpId" filterPlaceholder="Filter by HARP ID..." />;
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HARP List</h1>
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
                    <CardTitle>Incidents by Location</CardTitle>
                </CardHeader>
                <CardContent>
                    <IncidentsByLocationChart data={data} />
                </CardContent>
            </Card>
        
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>All Incidents</CardTitle>
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
