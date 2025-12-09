
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { getQualitySusaIncidents } from '@/lib/data-loader';

type QualitySusaIncident = {
    id: string;
    [key: string]: any;
};

export default function QualitySusaIncidentDetailsPage() {
  const [incident, setIncident] = useState<QualitySusaIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    async function loadData() {
        if (id) {
            const incidentData = await getQualitySusaIncidents();
            const foundIncident = incidentData.find((inc: any) => inc.id === id);
            if (foundIncident) {
                const formattedIncident = {
                    ...foundIncident,
                    date: parseISO(foundIncident.date),
                    createdAt: foundIncident.createdAt ? parseISO(foundIncident.createdAt) : undefined,
                };
                setIncident(formattedIncident);
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
    'susaId', 'bbqReferenceNumber', 'date', 'location', 'department', 'block', 'floor', 
    'activity', 'carriedOutBy', 'employeeType', 'employeeName', 
    'employeeId', 'designation', 'employeeDepartment', 'hazard', 
    'accident', 'risk', 'prevention', 'otherObservation', 'createdAt'
  ];

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        )
    }
    if (incident) {
        // Create a sorted list of entries based on the desired order
        const sortedEntries = displayOrder
            .map(key => ([key, incident[key]]))
            .filter(([key, value]) => value !== undefined && key !== 'id');

        // Append any fields from the incident that are not in the displayOrder
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
            <CardTitle>Incident ID: {incident?.susaId || (loading ? 'Loading...' : id)}</CardTitle>
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
