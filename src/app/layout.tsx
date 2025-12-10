
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/auth-context';
import ConditionalSidebarLayout from '@/components/conditional-sidebar-layout';
import { ThemeProvider } from '@/context/theme-provider';


export const metadata: Metadata = {
  title: 'Asian Paints: i-Safe',
  description: 'An integrated application for safety and incident management.',
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
      <body className="font-body antialiased bg-background">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
            <ConditionalSidebarLayout>
                {children}
            </ConditionalSidebarLayout>
            <Toaster />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
