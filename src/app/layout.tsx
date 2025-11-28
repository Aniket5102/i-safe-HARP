
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/sidebar-nav';
import { FirebaseClientProvider } from '@/firebase/client-provider';


export const metadata: Metadata = {
  title: 'HARP Incident',
  description: 'Capture, manage, and analyze HARP data with AI-powered suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <SidebarProvider>
            <div className="flex">
              <Sidebar className="border-r">
                <SidebarHeader>
                  <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarNav />
                </SidebarContent>
              </Sidebar>
              <div className="flex-1 flex flex-col">
                <Header />
                {children}
              </div>
            </div>
            <Toaster />
          </SidebarProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
