
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, PenSquare, PlusCircle, MoreHorizontal } from 'lucide-react';
import { App } from '@/lib/apps-data';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  const actionButtons = [
    { name: 'Modify', icon: PenSquare, href: `${app.href}/modify` },
    { name: 'Data', icon: Database, href: `${app.href}/data` },
    { name: 'New', icon: PlusCircle, href: app.href },
  ];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                 <Image
                    src={app.imageUrl}
                    alt={`${app.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain"
                    data-ai-hint={app.imageHint}
                />
                <h3 className="font-semibold text-sm leading-tight">{app.name}</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={20} className="text-gray-500" />
            </Button>
        </div>
        {app.subtitle && (
          <p className="text-xs text-gray-500 mb-3 flex-grow">{app.subtitle}</p>
        )}
        <div className="border-b-2 border-teal-500 w-full my-auto"></div>
        <div className="flex justify-around items-center pt-3 mt-auto">
          {actionButtons.map((action) => (
            <Link key={action.name} href={action.href} passHref>
              <Button variant="ghost" className="flex flex-col h-auto p-2 text-gray-500 hover:text-primary">
                <action.icon size={20} />
                <span className="text-xs mt-1">{action.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
