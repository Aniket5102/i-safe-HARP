
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { columns, HarpIncident } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { FileDown, ListFilter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HarpDataPage() {
  const [data, setData] = useState<HarpIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) {
      // Firestore is not yet available, do nothing.
      return;
    }

    setLoading(true);
    const incidentsCollection = collection(firestore, 'harp-incidents');
    const unsubscribe = onSnapshot(incidentsCollection as Query<DocumentData>, (snapshot) => {
      const incidentsData = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          date: docData.date?.toDate ? docData.date.toDate() : new Date(docData.date),
        } as HarpIncident;
      });
      setData(incidentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching HARP incidents: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HARP List</h1>
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
                    <p className="text-sm text-muted-foreground">Total Records : {data.length}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    Filters
                    </Button>
                </div>
            </div>
          {loading ? (
            <div className="text-center p-8">Loading incidents...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
