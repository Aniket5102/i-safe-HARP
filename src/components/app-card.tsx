
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { App } from '@/lib/apps-data';

interface AppCardProps {
  app: App;
  onCardClick: (app: App) => void;
}

export default function AppCard({ app, onCardClick }: AppCardProps) {
  
  const dataHref = app.dataHref || `${app.href}/data`;
  
  const modifyHref = app.name === 'BBS' ? `${app.href}?tab=modify` : `${app.href}/modify`;

  const actionButtons = [
    { name: 'Modify', href: modifyHref },
    { name: 'Data', href: dataHref },
    { name: 'New', href: app.href },
  ];

  return (
    <Card 
      className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
      onClick={(e) => {
        // Prevent card click when an action button is clicked
        if ((e.target as HTMLElement).closest('a')) return;
        onCardClick(app);
      }}
    >
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight text-foreground">{app.name}</h3>
                  {app.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{app.subtitle}</p>
                  )}
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 group-hover:opacity-100">
                <MoreHorizontal size={20} className="text-muted-foreground" />
            </Button>
        </div>
        
        <div className="mt-auto pt-3">
          <div className="border-t-2 border-primary/20 w-full mb-3"></div>
          <div className="flex justify-around items-center">
            {actionButtons.map((action) => (
              <Link key={action.name} href={action.href} passHref>
                <Button 
                  variant="ghost" 
                  className="flex flex-col h-auto p-2 text-muted-foreground hover:bg-accent hover:text-primary transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()} // Stop propagation to prevent card click
                >
                  <span className="text-xs mt-1">{action.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
