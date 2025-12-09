
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import ConditionalSidebarLayout from '@/components/conditional-sidebar-layout';


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
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <AuthProvider>
          <ConditionalSidebarLayout>
            {children}
          </ConditionalSidebarLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
