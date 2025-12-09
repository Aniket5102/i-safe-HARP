
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BbsObservationsStatusChart from "@/components/bbs-observations-status-chart";
import IncidentsByMonthChart from "@/components/incidents-by-month-chart";
import HarpIncidentsByRiskChart from "@/components/harp-incidents-by-risk-chart";
import { useEffect, useState } from 'react';
import { getBbsObservations, getHarpIncidents, getQualitySusaIncidents } from '@/lib/data-loader';


export default function DashboardPage() {
    const [bbsData, setBbsData] = useState<any[]>([]);
    const [harpData, setHarpData] = useState<any[]>([]);
    const [susaData, setSusaData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [bbs, harp, susa] = await Promise.all([
                getBbsObservations(),
                getHarpIncidents(),
                getQualitySusaIncidents()
            ]);

            const formattedBbsData = bbs.map((item: any) => ({
                ...item.data,
                observationDate: new Date(item.data.observationDate)
            }));
        
            const formattedHarpData = harp.map((item: any) => ({
              ...item,
              date: new Date(item.date),
            }));
        
            const formattedSusaData = susa.map((item: any) => ({
                ...item,
                date: new Date(item.date),
            }));

            setBbsData(formattedBbsData);
            setHarpData(formattedHarpData);
            setSusaData(formattedSusaData);
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="bg-background min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-screen-2xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">An overview of all application data.</p>
                    </header>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        )
    }

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
                            <HarpIncidentsByRiskChart data={harpData} />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>BBS Observation Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BbsObservationsStatusChart data={bbsData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>HARP Incidents by Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByMonthChart data={harpData} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quality SUSA Incidents by Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IncidentsByMonthChart data={susaData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
