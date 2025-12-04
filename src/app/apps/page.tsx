
'use client';

import { useState } from 'react';
import { apps, App } from '@/lib/apps-data';
import AppCard from '@/components/app-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Database, PenSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';


export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const recentlyUsedApps = apps.slice(0, 4);
  
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Apps</h1>
              <p className="text-muted-foreground mt-1">Discover and manage your applications.</p>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
            </div>
          </header>

          {searchTerm === '' && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Recently Used Apps</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentlyUsedApps.map((app) => (
                  <AppCard key={app.name} app={app} onCardClick={setSelectedApp} />
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">{searchTerm ? 'Search Results' : 'All Apps'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredApps.map((app) => (
                <AppCard key={app.name} app={app} onCardClick={setSelectedApp} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {selectedApp && (
        <AppOptionsDialog
          app={selectedApp}
          isOpen={!!selectedApp}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedApp(null);
            }
          }}
        />
      )}
    </>
  );
}


interface AppOptionsDialogProps {
  app: App;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function AppOptionsDialog({ app, isOpen, onOpenChange }: AppOptionsDialogProps) {
  const dataHref = app.dataHref || `${app.href}/data`;
  
  const options = [
    { name: 'Data', icon: Database, href: dataHref },
    { name: 'Modify', icon: PenSquare, href: `${app.href}/modify` },
    { name: 'New', icon: PlusCircle, href: app.href },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{app.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          {options.map((option) => (
            <Link key={option.name} href={option.href} passHref>
              <Button variant="outline" className="w-full justify-start text-base p-6 bg-accent border-primary/20 hover:bg-primary/10">
                <option.icon className="mr-3 h-5 w-5 text-primary" />
                {option.name}
              </Button>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

    