
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Link, LayoutGrid, PenSquare, Settings } from 'lucide-react';
import IdeagenLogo from '@/components/ideagen-logo';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'HARP Insight',
  description: 'Capture, manage, and analyze HARP data with AI-powered insights.',
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
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1-700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex">
            <Sidebar className="border-r">
              <SidebarHeader>
                <SidebarTrigger />
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Ideagen" isActive={false} className="justify-start">
                      <IdeagenLogo className="h-6 w-6" />
                      <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Ideagen...</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <NextLink href="/" passHref>
                      <SidebarMenuButton asChild tooltip="Home" isActive={false} className="justify-start">
                        <a>
                          <Home />
                          <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Home</span>
                        </a>
                      </SidebarMenuButton>
                    </NextLink>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Modules" isActive={false} className="justify-start">
                      <LayoutGrid />
                      <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Modules</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Apps" isActive={true} className="justify-start">
                      <Link />
                      <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Apps</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Setup" isActive={false} className="justify-start">
                      <Settings />
                      <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Setup</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 flex flex-col">
              <Header />
              {children}
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
