
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Search,
  MoreHorizontal,
  User,
  MapPin,
  FileText,
  CalendarDays,
  HardHat,
  ClipboardCheck,
  CheckCircle,
  X,
  Database,
  PenSquare,
  PlusCircle,
  Settings,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { App, apps } from '@/lib/apps-data';
import { Separator } from '@/components/ui/separator';

const modules = [
  { name: 'Calendar/Task Management', icon: CalendarDays },
  { name: 'Inspections & Audits', icon: FileText },
  { name: 'Incident Management', icon: HardHat },
  { name: 'Risk Assessment', icon: ClipboardCheck },
];

const quickLinks = {
  'Calendar/Task Management': ['All Activity', 'Manage Task', 'My Action Items for Approval', 'My Activity'],
  'Incident Management': ['Incidents without Case Classification', 'My Management Review', 'Report Head Count and Hours', 'View Incidents'],
  'Inspections & Audits': ['Conduct Audits', 'Manage Findings', 'Risk Assessment', 'Manage Risk Assessments'],
};


export default function HomePage() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome, Aniket!</h1>
            <p className="text-muted-foreground">Here's a quick overview of your workspace.</p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Customize Layout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ModulesCard />
            <QuickLinksCard />
          </div>

          <div className="space-y-8">
            <UserProfileCard />
            <AppsCard onAppClick={setSelectedApp} />
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
    </div>
  );
}

function UserProfileCard() {
  const profileDetails = {
    name: 'Aniket Khaladkar',
    loginName: 'P00126717',
    activeDate: 'October 15, 2025',
    scope: '264',
  };

  const actionItems = [
    { label: 'Management Review (Open)', value: 0 },
    { label: 'Open Action Items', value: 0 },
    { label: 'Overdue Action Items', value: 0 },
  ];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">User Profile</CardTitle>
        <MoreHorizontal className="text-muted-foreground cursor-pointer" size={20} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">AK</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-foreground">{profileDetails.name}</p>
            <p className="text-sm text-green-600 font-medium flex items-center">
              <CheckCircle size={14} className="mr-1" /> Active
            </p>
          </div>
        </div>
        
        <Separator className="my-4" />

        <div className="space-y-4 text-sm">
          {actionItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center hover:bg-accent p-2 rounded-md">
              <p className="text-muted-foreground">{item.label}</p>
              <span className="font-bold text-primary">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ModulesCard() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <LayoutGrid className="text-primary" />
          Modules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {modules.map((module) => (
            <div key={module.name} className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-accent transition-colors duration-200 cursor-pointer">
              <div className="p-4 rounded-full bg-primary/10 mb-3 shadow-md">
                 <module.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{module.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface AppsCardProps {
  onAppClick: (app: App) => void;
}

function AppsCard({ onAppClick }: AppsCardProps) {
  const displayedApps = apps.slice(0, 8); // Show a limited number of apps

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold">My Apps</CardTitle>
        <Link href="/apps" passHref>
          <Button variant="link" className="text-sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {displayedApps.map((app) => (
             <button key={app.name} onClick={() => onAppClick(app)} className="flex flex-col items-center text-center no-underline text-current cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors">
              <div className="p-1 rounded-lg bg-accent mb-2 h-16 w-16 flex items-center justify-center">
                <Image 
                  src={app.imageUrl} 
                  alt={app.name} 
                  width={200} 
                  height={200} 
                  className="h-14 w-14 object-contain rounded-md"
                  data-ai-hint={app.imageHint}
                />
              </div>
              <p className="text-xs font-semibold leading-tight">{app.name}</p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinksCard() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          {Object.entries(quickLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-3 border-b-2 border-primary/50 pb-2 text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-primary hover:underline transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


interface AppOptionsDialogProps {
  app: App;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function AppOptionsDialog({ app, isOpen, onOpenChange }: AppOptionsDialogProps) {
  const dataHref = app.dataHref || `${app.href}/data`;
  
  const modifyHref = app.name === 'BBS' ? `${app.href}?tab=modify` : `${app.href}/modify`;

  const options = [
    { name: 'Data', icon: Database, href: dataHref },
    { name: 'Modify', icon: PenSquare, href: modifyHref },
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

    