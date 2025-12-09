
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IncidentsByLocationChart from "@/components/incidents-by-location-chart";
import BbsObservationsByLocationChart from "@/components/bbs-observations-by-location-chart";
import BbsObservationsStatusChart from "@/components/bbs-observations-status-chart";

import harpIncidentData from '@/lib/data/harp-incidents.json';
import qualitySusaIncidentData from '@/lib/data/quality-susa-incidents.json';
import bbsObservationData from "@/lib/data/bbs-observations.json";


export default function DashboardPage() {
    const formattedHarpData = harpIncidentData.map(item => ({
        ...item,
        date: new Date(item.date),
    }));

    const formattedSusaData = qualitySusaIncidentData.map(item => ({
        ...item,
        date: new Date(item.date),
    }));

    const formattedBbsData = bbsObservationData.map(item => ({
        id: item.id,
        ...item.data,
        observationDate: new Date(item.data.observationDate)
    }))

    return (
        <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">An overview of all application data.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>HARP Incidents by Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByLocationChart data={formattedHarpData} />
                        </CardContent>
                    </Card>
                    
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Quality SUSA Incidents by Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByLocationChart data={formattedSusaData} />
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>BBS Observations by Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BbsObservationsByLocationChart data={formattedBbsData} />
                        </CardContent>
                    </Card>
                    
                    <Card className="xl:col-span-3">
                        <CardHeader>
                            <CardTitle>BBS Observation Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BbsObservationsStatusChart data={formattedBbsData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
