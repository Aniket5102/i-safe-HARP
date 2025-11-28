
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

type HarpIncident = {
    id: string;
    [key: string]: any;
};

export default function HarpIncidentDetailsPage() {
  const [incident, setIncident] = useState<HarpIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchIncident = async () => {
      if (!firestore || !id) return;

      setLoading(true);
      try {
        const docRef = doc(firestore, 'harp-incidents', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          setIncident({
              id: docSnap.id,
              ...data,
              date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
          console.error("Error fetching incident:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [firestore, id]);

  const renderValue = (value: any) => {
    if (value instanceof Date) {
      return format(value, 'PPP');
    }
    if(typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return value?.toString() || 'N/A';
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HARP Incident Details</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Incident ID: {incident?.harpId || 'Loading...'}</CardTitle>
            <CardDescription>
              Detailed information for the selected HARP incident.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : incident ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                {Object.entries(incident).map(([key, value]) => {
                    if (key === 'id') return null; // Don't display the document id
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                    return (
                        <div key={key} className="grid grid-cols-2 items-center">
                            <strong className="text-muted-foreground">{label}:</strong>
                            <span>{renderValue(value)}</span>
                        </div>
                    )
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Incident not found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
