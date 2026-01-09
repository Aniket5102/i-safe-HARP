
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { getBbsObservations } from '@/lib/data-loader';

type BbsObservation = {
    id: string;
    [key: string]: any;
};

export default function BbsObservationDetailsPage() {
  const [observation, setObservation] = useState<BbsObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    async function loadData() {
        if (id) {
            const observationData = await getBbsObservations();
            const foundObservation = observationData.find((obs: any) => obs.id === id);
            if (foundObservation) {
                // The data from the loader is already formatted with Date objects in the `data` property
                setObservation(foundObservation);
            }
        }
        setLoading(false);
    }
    loadData();
  }, [id]);

  const renderValue = (value: any) => {
    if (value instanceof Date && isValid(value)) {
      return format(value, 'PPP p');
    }
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if(typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return value.toString();
  }
  
  const displayOrder = [
    'observerName', 'location', 'observationDate', 'taskObserved', 
    'properUseOfPPE', 'bodyPositioning', 'toolAndEquipmentHandling', 'comments'
  ];

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        )
    }
    if (observation) {
        const incidentData = (observation as any).data;
        const sortedEntries = displayOrder
            .map(key => ([key, incidentData[key]]))
            .filter(([, value]) => value !== undefined);

        const remainingEntries = Object.entries(incidentData)
            .filter(([key]) => !displayOrder.map(k => k.toLowerCase()).includes(key.toLowerCase()) && key !== 'id');

        const allEntries = [...sortedEntries, ...remainingEntries];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {allEntries.map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return (
                    <div key={key} className="grid grid-cols-2 items-center">
                        <strong className="text-muted-foreground">{label}:</strong>
                        <span>{renderValue(value)}</span>
                    </div>
                )
            })}
          </div>
        )
    }
    return <p className="text-center text-muted-foreground">Observation not found.</p>;
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">BBS Observation Details</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Observation ID: {loading ? 'Loading...' : id}</CardTitle>
            <CardDescription>
              Detailed information for the selected BBS observation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
