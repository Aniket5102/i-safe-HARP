
'use client';

import { useState } from 'react';
import { apps, App } from '@/lib/apps-data';
import AppCard from '@/components/app-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const recentlyUsedApps = apps.slice(0, 4);
  
  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Apps</h1>
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>

        {searchTerm === '' && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Recently Used Apps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyUsedApps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">{searchTerm ? 'Search Results' : 'All Apps'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
