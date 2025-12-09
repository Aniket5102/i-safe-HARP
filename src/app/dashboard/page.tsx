
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BbsObservationsStatusChart from "@/components/bbs-observations-status-chart";
import IncidentsByMonthChart from "@/components/incidents-by-month-chart";
import HarpIncidentsByRiskChart from "@/components/harp-incidents-by-risk-chart";

import bbsObservationData from "@/lib/data/bbs-observations.json";
import harpIncidentData from "@/lib/data/harp-incidents.json";
import qualitySusaIncidentData from "@/lib/data/quality-susa-incidents.json";


export default function DashboardPage() {
    const formattedBbsData = bbsObservationData.map(item => ({
        ...item.data,
        observationDate: new Date(item.data.observationDate)
    }));

    const formattedHarpData = harpIncidentData.map(item => ({
      ...item,
      date: new Date(item.date),
    }));

    const formattedSusaData = qualitySusaIncidentData.map(item => ({
        ...item,
        date: new Date(item.date),
    }));

    return (
        <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">An overview of all application data.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>HARP Incidents by Risk</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <HarpIncidentsByRiskChart data={formattedHarpData} />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>BBS Observation Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BbsObservationsStatusChart data={formattedBbsData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>HARP Incidents by Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByMonthChart data={formattedHarpData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quality SUSA Incidents by Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByMonthChart data={formattedSusaData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
