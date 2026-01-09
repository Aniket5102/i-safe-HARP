
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileDown } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { getQualitySusaIncidents } from '@/lib/data-loader';
import jsPDF from 'jspdf';

type QualitySusaIncident = {
    id: string;
    [key: string]: any;
};

export default function QualitySusaIncidentDetailsPage() {
  const [incident, setIncident] = useState<QualitySusaIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<[string, any][]>([]);
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
                    susaId: foundIncident.susaid,
                    bbqReferenceNumber: foundIncident.bbqreferencenumber,
                    carriedOutBy: foundIncident.carriedoutby,
                    employeeType: foundIncident.employeetype,
                    employeeName: foundIncident.employeename,
                    employeeId: foundIncident.employeeid,
                    employeeDepartment: foundIncident.employeedepartment,
                    otherObservation: foundIncident.otherobservation,
                    createdAt: foundIncident.createdat,
                };
                setIncident(formattedIncident);
            }
        }
        setLoading(false);
    }
    loadData();
  }, [id]);

  const displayOrder = [
    'susaId', 'bbqReferenceNumber', 'date', 'location', 'department', 'block', 'floor', 
    'activity', 'carriedOutBy', 'employeeType', 'employeeName', 
    'employeeId', 'designation', 'employeeDepartment', 'hazard', 
    'accident', 'risk', 'prevention', 'otherObservation', 'createdAt'
  ];
  
  useEffect(() => {
    if (incident) {
        const sortedEntries = displayOrder
            .map(key => ([key, incident[key]]))
            .filter(([, value]) => value !== undefined);

        const remainingKeys = Object.keys(incident)
            .filter(key => !displayOrder.map(k => k.toLowerCase()).includes(key.toLowerCase()) && key !== 'id' && !displayOrder.includes(key));
        
        const remainingEntries = remainingKeys.map(key => [key, incident[key]]);
        
        setAllEntries([...sortedEntries, ...remainingEntries]);
    }
  }, [incident]);


  const handleExportPdf = () => {
    if (!incident) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = margin;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Quality SUSA Incident Report', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Incident ID: ${incident.susaId}`, pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // Line separator
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Content
    doc.setFontSize(11);
    allEntries.forEach(([key, value]) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      const formattedValue = renderValue(value, true);

      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, margin, y);
      
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(`${label}: `) + 2;
      const splitText = doc.splitTextToSize(formattedValue, pageWidth - margin - textWidth - margin);
      doc.text(splitText, margin + textWidth, y);
      
      y += (splitText.length * 6) + 4; // Adjust spacing based on lines
    });

    doc.save(`SUSA-Incident-${incident.susaId}.pdf`);
  };

  const renderValue = (value: any, isPdf = false) => {
    if (value instanceof Date && isValid(value)) {
      return format(value, isPdf ? 'yyyy-MM-dd HH:mm' : 'PPP p');
    }
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if(typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
    }
    return value.toString();
  }

  const renderContent = () => {
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        )
    }
    if (incident) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {allEntries.map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                return (
                    <div key={key} className="grid grid-cols-2 items-start">
                        <strong className="text-muted-foreground">{label}:</strong>
                        <span className="break-words">{renderValue(value)}</span>
                    </div>
                )
            })}
          </div>
        )
    }
    return <p className="text-center text-muted-foreground">Incident not found.</p>;
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quality SUSA Incident Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportPdf}>
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </header>

        <div>
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
    </div>
  );
}
