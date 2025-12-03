
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, isValid } from 'date-fns';

type QualitySusaIncident = {
    id: string;
    [key: string]: any;
};

export default function QualitySusaIncidentDetailsPage() {
  const [incident, setIncident] = useState<QualitySusaIncident | null>(null);
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
        const docRef = doc(firestore, 'quality-susa-incidents', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          
          const formattedData: DocumentData = {};
          for (const key in data) {
            // Check for Firestore Timestamp and convert to JS Date
            if (data[key] && typeof data[key].toDate === 'function') {
              formattedData[key] = data[key].toDate();
            } else {
              formattedData[key] = data[key];
            }
          }

          setIncident({
              id: docSnap.id,
              ...formattedData,
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

    if(firestore) {
      fetchIncident();
    }
  }, [firestore, id]);

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
  
  // Define a sensible order for displaying fields
  const displayOrder = [
    'bbqReferenceNumber', 'dateOfObservation', 'timeOfObservation', 'locationName', 
    'department', 'block', 'areaFloor', 'shift', 'observerName', 'observerType',
    'employeeId', 'designation', 'employeeDepartment', 'employeeBlock', 
    'sbtDbtOther', 'observationGoal', 'observedType', 'qualityKeyActivity', 
    'qualityActName', 'isActComplied', 'descriptionOfAct', 'keyQualityBehaviour', 
    'susaStatus', 'createdAt'
  ];

  const renderContent = () => {
    if (!firestore) {
        return (
            <div className="flex justify-center items-center p-8">
                <p>Connecting to Firebase...</p>
            </div>
        )
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        )
    }
    if (incident) {
        const sortedEntries = displayOrder
            .map(key => ([key, incident[key]]))
            .filter(([, value]) => value !== undefined && key !== 'id');

        const remainingEntries = Object.entries(incident)
            .filter(([key]) => !displayOrder.includes(key) && key !== 'id');

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
    return <p className="text-center text-muted-foreground">Incident not found.</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quality SUSA Incident Details</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>BBQ Reference: {incident?.bbqReferenceNumber || (loading ? 'Loading...' : 'N/A')}</CardTitle>
            <CardDescription>
              Detailed information for the selected Quality SUSA incident.
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
