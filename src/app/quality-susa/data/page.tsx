
'use client';

import { useState, useEffect } from 'react';
import { columns, QualitySusaIncident } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { FileDown, ListFilter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QualitySusaDataPage() {
  const [data, setData] = useState<QualitySusaIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // DB removed, setting loading to false and data to empty array
    setLoading(false);
    setData([]);
  }, []);

  const renderContent = () => {
    if (loading) {
        return <div className="text-center p-8">Loading incidents...</div>;
    }
    return <DataTable columns={columns} data={data} filterColumn="susaId" filterPlaceholder="Filter by SUSA ID..." />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quality SUSA List</h1>
          <div className="flex items-center gap-2">
            <Link href="/apps" passHref>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </header>
        
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">Total Records : {loading ? '...' : data.length}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filters
                    </Button>
                </div>
            </div>
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
