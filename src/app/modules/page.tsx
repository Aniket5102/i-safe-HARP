
'use client';

import { ChevronRight, LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const modules = [
  { name: 'Inspections & Audits', href: '#' },
  { name: 'Calendar', href: '#' },
  { name: 'Incident Management', href: '#' },
  { name: 'Performance Management', href: '#' },
  { name: 'Risk Assessment', href: '#' },
  { name: 'Task Management', href: '#' },
];

export default function ModulesPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-2">Back</span>
          </Button>
        </header>

        <div className="flex items-center mb-6">
            <LayoutGrid className="h-6 w-6 mr-3 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-800">Modules</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <ul>
                {modules.map((module, index) => (
                <li key={module.name} className={index < modules.length - 1 ? 'border-b border-gray-200' : ''}>
                    <Link href={module.href}>
                    <div className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                        <span className="text-gray-700">{module.name}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}
