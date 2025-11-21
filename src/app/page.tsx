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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const modules = [
  { name: 'Calendar', icon: CalendarDays },
  { name: 'Inspections & Audits', icon: FileText },
  { name: 'Incident Management', icon: HardHat },
  { name: 'Risk Assessment', icon: ClipboardCheck },
];

type App = {
  name: string;
  subtitle?: string;
  imageUrl: string;
  imageHint: string;
  href: string;
};

const apps: App[] = [
  { name: 'QUALITY SUSA', subtitle: 'SUSA Reporting...', imageUrl: 'https://picsum.photos/seed/quality-assurance/200/200', imageHint: 'quality assurance', href: '#' },
  { name: 'Quality Incident Repor...', imageUrl: 'https://picsum.photos/seed/incident-documentation/200/200', imageHint: 'incident documentation', href: '#' },
  { name: 'Permit To Work V2.0', imageUrl: 'https://picsum.photos/seed/safety-permit/200/200', imageHint: 'safety permit', href: '#' },
  { name: 'Permit To Work (Obsolete)', imageUrl: 'https://picsum.photos/seed/archive-documents/200/200', imageHint: 'archive documents', href: '#' },
  { name: 'Employee Check In', subtitle: 'Employee Self C...', imageUrl: 'https://picsum.photos/seed/worker-check-in/200/200', imageHint: 'worker check in', href: '#' },
  { name: 'HARP', imageUrl: 'https://picsum.photos/seed/risk-analysis/200/200', imageHint: 'risk analysis', href: '/harp' },
  { name: 'BBS', imageUrl: 'https://picsum.photos/seed/safety-observation/200/200', imageHint: 'safety observation', href: '#' },
];

const quickLinks = {
  'Calendar/Task Management': ['All Activity', 'Manage Task', 'My Action Items for Approval', 'My Activity'],
  'Incident Management': ['Incidents without Case Classification', 'My Management Review', 'Report Head Count and Hours', 'View Incidents'],
  'Inspections & Audits': ['Conduct Audits', 'Manage Findings', 'Risk Assessment', 'Manage Risk Assessments'],
};


export default function HomePage() {
  const [searchTerms, setSearchTerms] = useState({
    userProfile: '',
    modules: '',
    apps: '',
    quickLinks: '',
  });
  const [showSearch, setShowSearch] = useState({
    userProfile: false,
    modules: false,
    apps: false,
    quickLinks: false,
  });
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const handleSearchChange = (card: keyof typeof searchTerms, value: string) => {
    setSearchTerms(prev => ({ ...prev, [card]: value }));
  };

  const toggleSearch = (card: keyof typeof showSearch) => {
    setShowSearch(prev => ({ ...prev, [card]: !prev[card] }));
    if (showSearch[card]) {
      handleSearchChange(card, '');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Default Home Page</h1>
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </div>
          <Button variant="outline" className="bg-teal-600 text-white hover:bg-teal-700 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            Edit Layout
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <UserProfileCard
              searchTerm={searchTerms.userProfile}
              onSearchChange={(value) => handleSearchChange('userProfile', value)}
              showSearch={showSearch.userProfile}
              onToggleSearch={() => toggleSearch('userProfile')}
            />
            <QuickLinksCard
              searchTerm={searchTerms.quickLinks}
              onSearchChange={(value) => handleSearchChange('quickLinks', value)}
              showSearch={showSearch.quickLinks}
              onToggleSearch={() => toggleSearch('quickLinks')}
            />
          </div>

          <div className="space-y-6">
            <ModulesCard
              searchTerm={searchTerms.modules}
              onSearchChange={(value) => handleSearchChange('modules', value)}
              showSearch={showSearch.modules}
              onToggleSearch={() => toggleSearch('modules')}
            />
            <AppsCard
              searchTerm={searchTerms.apps}
              onSearchChange={(value) => handleSearchChange('apps', value)}
              showSearch={showSearch.apps}
              onToggleSearch={() => toggleSearch('apps')}
              onAppClick={setSelectedApp}
            />
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

interface CardSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showSearch: boolean;
  onToggleSearch: () => void;
}

function UserProfileCard({ searchTerm, onSearchChange, showSearch, onToggleSearch }: CardSearchProps) {
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

  const filteredActionItems = actionItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">User Profile</CardTitle>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8"
              />
              <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
                <X size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
              <Search size={20} />
            </Button>
          )}
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-4">01 JAN 2025 - 31 DEC 2025</p>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback className="bg-green-200 text-green-800 font-bold">AK</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{profileDetails.name}</p>
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle size={14} className="mr-1" /> Active
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Login Name</p>
              <p className="font-medium">{profileDetails.loginName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Active Date</p>
              <p className="font-medium">{profileDetails.activeDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Scope</p>
              <p className="font-medium">{profileDetails.scope}</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-2 space-y-2 text-sm">
          {filteredActionItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <p>{item.label}</p>
              <span className="font-bold text-blue-600">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ModulesCard({ searchTerm, onSearchChange, showSearch, onToggleSearch }: CardSearchProps) {
  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Modules</CardTitle>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8"
              />
              <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
                <X size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
              <Search size={20} />
            </Button>
          )}
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredModules.map((module) => (
            <div key={module.name} className="flex flex-col items-center text-center">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 mb-2">
                 <module.icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium">{module.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface AppsCardProps extends CardSearchProps {
  onAppClick: (app: App) => void;
}

function AppsCard({ searchTerm, onSearchChange, showSearch, onToggleSearch, onAppClick }: AppsCardProps) {
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Apps</CardTitle>
         <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8"
              />
              <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
                <X size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
              <Search size={20} />
            </Button>
          )}
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
             <button key={app.name} onClick={() => onAppClick(app)} className="flex flex-col items-center text-center no-underline text-current cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
              <div className="p-2 rounded-lg bg-gray-100 mb-2 h-20 w-20 flex items-center justify-center">
                <Image 
                  src={app.imageUrl} 
                  alt={app.name} 
                  width={200} 
                  height={200} 
                  className="h-16 w-16 object-cover rounded-md"
                  data-ai-hint={app.imageHint}
                />
              </div>
              <p className="text-xs font-semibold">{app.name}</p>
               {app.subtitle && <p className="text-xs text-gray-500">{app.subtitle}</p>}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinksCard({ searchTerm, onSearchChange, showSearch, onToggleSearch }: CardSearchProps) {
  const filteredQuickLinks = Object.entries(quickLinks).reduce((acc, [category, links]) => {
    const filtered = links.filter(link => link.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filtered.length > 0 || category.toLowerCase().includes(searchTerm.toLowerCase())) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as typeof quickLinks);

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8"
              />
              <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
                <X size={20} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={onToggleSearch} className="h-8 w-8">
              <Search size={20} />
            </Button>
          )}
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-right text-xs text-gray-500 mb-2">SORT BY: MODULE ASC</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(filteredQuickLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-2 border-b pb-1">{category}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}><a href="#" className="text-sm text-blue-600 hover:underline">{link}</a></li>
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
  const options = [
    { name: 'Data', icon: Database, href: `${app.href}/data` },
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
              <Button variant="outline" className="w-full justify-start text-base p-6 bg-blue-50 border-blue-200 hover:bg-blue-100">
                <option.icon className="mr-3 h-5 w-5 text-blue-600" />
                {option.name}
              </Button>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
