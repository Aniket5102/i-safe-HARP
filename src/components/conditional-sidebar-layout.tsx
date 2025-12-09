
'use client';

import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/sidebar-nav';
import { Loader2 } from 'lucide-react';

export default function ConditionalSidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <>
                <Header />
                <main>{children}</main>
            </>
        )
    }

    return (
        <SidebarProvider>
            <div className="relative min-h-screen">
                <Sidebar>
                    <SidebarHeader>
                        <SidebarTrigger />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
