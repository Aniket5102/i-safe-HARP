'use client';

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
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const modules = [
  { name: 'Calendar', icon: CalendarDays },
  { name: 'Inspections & Audits', icon: FileText },
  { name: 'Incident Management', icon: HardHat },
  { name: 'Risk Assessment', icon: ClipboardCheck },
];

const apps = [
  { name: 'QUALITY SUSA', subtitle: 'SUSA Reporting...', imageUrl: 'https://picsum.photos/seed/susa/200/200', imageHint: 'quality inspection', href: '#' },
  { name: 'Quality Incident Repor...', imageUrl: 'https://picsum.photos/seed/incident/200/200', imageHint: 'factory report', href: '#' },
  { name: 'Permit To Work V2.0', imageUrl: 'https://picsum.photos/seed/permit/200/200', imageHint: 'industrial permit', href: '#' },
  { name: 'Permit To Work (Obsolete)', imageUrl: 'https://picsum.photos/seed/obsolete/200/200', imageHint: 'archive document', href: '#' },
  { name: 'Employee Check In', subtitle: 'Employee Self C...', imageUrl: 'https://picsum.photos/seed/employee/200/200', imageHint: 'worker entry', href: '#' },
  { name: 'HARP', imageUrl: 'https://picsum.photos/seed/harp/200/200', imageHint: 'risk analysis', href: '/harp' },
  { name: 'BBS', imageUrl: 'https://picsum.photos/seed/bbs/200/200', imageHint: 'safety observation', href: '#' },
];

const quickLinks = {
  'Calendar/Task Management': ['All Activity', 'Manage Task', 'My Action Items for Approval', 'My Activity'],
  'Incident Management': ['Incidents without Case Classification', 'My Management Review', 'Report Head Count and Hours', 'View Incidents'],
  'Inspections & Audits': ['Conduct Audits', 'Manage Findings', 'Risk Assessment', 'Manage Risk Assessments'],
};


export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">Default Home Page</h1>
            {/* You can replace this with a real dropdown */}
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
          {/* Left Column */}
          <div className="space-y-6">
            <UserProfileCard />
            <QuickLinksCard />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ModulesCard />
            <AppsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserProfileCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">User Profile</CardTitle>
        <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={20} />
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
            <p className="font-semibold">Aniket Khaladkar</p>
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
              <p className="font-medium">P00126717</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Active Date</p>
              <p className="font-medium">October 15, 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Scope</p>
              <p className="font-medium">264</p>
            </div>
          </div>
        </div>
        <div className="border-t pt-2 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <p>Management Review (Open)</p>
            <span className="font-bold text-blue-600">0</span>
          </div>
           <div className="flex justify-between items-center">
            <p>Open Action Items</p>
            <span className="font-bold text-blue-600">0</span>
          </div>
          <div className="flex justify-between items-center">
            <p>Overdue Action Items</p>
            <span className="font-bold text-blue-600">0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModulesCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Modules</CardTitle>
        <MoreHorizontal className="text-gray-400" size={20} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {modules.map((module) => (
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

function AppsCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Apps</CardTitle>
         <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={20} />
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {apps.map((app) => (
             <Link key={app.name} href={app.href || '#'} className="flex flex-col items-center text-center no-underline text-current">
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinksCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
        <div className="flex items-center gap-2">
          <Search className="text-gray-400" size={20} />
          <MoreHorizontal className="text-gray-400" size={20} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-right text-xs text-gray-500 mb-2">SORT BY: MODULE ASC</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(quickLinks).map(([category, links]) => (
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
