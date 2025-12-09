
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  FileText,
  HardHat,
  ClipboardCheck,
  PlayCircle,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { App, apps } from '@/lib/apps-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const modules = [
  { name: 'Calendar/Task Management', icon: CalendarDays, href: '#' },
  { name: 'Inspections & Audits', icon: FileText, href: '#' },
  { name: 'Incident Management', icon: HardHat, href: '#' },
  { name: 'Risk Assessment', icon: ClipboardCheck, href: '#' },
];


export default function HomePage() {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user === null) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <main className="flex-1">
        <HeroSection heroImage={heroImage} />

        <div className="p-4 sm:p-6 lg:p-8 space-y-12">
           <ContentCarousel 
            title="My Apps"
            items={apps}
            renderItem={(app) => (
              <AppCarouselItem key={app.name} app={app} onAppClick={setSelectedApp} />
            )}
          />

           <ContentCarousel 
            title="Modules"
            items={modules}
            renderItem={(module) => (
              <ModuleCarouselItem key={module.name} module={module} />
            )}
          />
        </div>
      </main>
      
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

function HeroSection({ heroImage }: { heroImage: any }) {
  return (
    <div className="relative h-[50vh] w-full flex items-center justify-center">
      <div className="absolute inset-0">
        {heroImage && (
           <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>
      <div className="relative z-10 text-center text-white p-4">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">iSafe 3.0</h1>
        <p className="mt-4 text-xl text-foreground/80 drop-shadow-md">
          Your central hub for safety and incident management.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
            <PlayCircle className="mr-2 h-6 w-6" />
            Get Started
          </Button>
          <Button size="lg" variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold text-lg">
             <Info className="mr-2 h-6 w-6" />
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}


interface ContentCarouselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function ContentCarousel<T>({ title, items, renderItem }: ContentCarouselProps<T>) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4 px-4 sm:px-0">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {items.map((item, index) => (
            <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 border-none text-white disabled:hidden" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 border-none text-white disabled:hidden" />
      </Carousel>
    </section>
  );
}


interface AppCarouselItemProps {
  app: App;
  onAppClick: (app: App) => void;
}

function AppCarouselItem({ app, onAppClick }: AppCarouselItemProps) {
  return (
    <button
      onClick={() => onAppClick(app)}
      className="group w-full aspect-[16/9] rounded-lg bg-accent/10 flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ease-in-out hover:bg-accent/20 hover:scale-105"
    >
      <p className="text-sm font-semibold text-foreground/80 group-hover:text-foreground">{app.name}</p>
    </button>
  );
}


interface ModuleCarouselItemProps {
  module: { name: string; href: string; icon: React.ElementType };
}

function ModuleCarouselItem({ module }: ModuleCarouselItemProps) {
  const Icon = module.icon;
  return (
    <Link href={module.href}>
      <div className="group w-full aspect-[16/9] rounded-lg bg-accent/10 flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ease-in-out hover:bg-accent/20 hover:scale-105">
        <Icon className="h-10 w-10 text-primary mb-2" />
        <p className="text-sm font-semibold text-foreground/80 group-hover:text-foreground">{module.name}</p>
      </div>
    </Link>
  );
}


interface AppOptionsDialogProps {
  app: App;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function AppOptionsDialog({ app, isOpen, onOpenChange }: AppOptionsDialogProps) {
  const dataHref = app.dataHref || `${app.href}/data`;
  
  const modifyHref = `${app.href}?tab=modify`;

  const options = [
    { name: 'Data', href: dataHref },
    { name: 'Modify', href: modifyHref },
    { name: 'New', href: app.href },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle>{app.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-2">
          {options.map((option) => (
            <Link key={option.name} href={option.href} passHref>
              <Button variant="outline" className="w-full justify-center text-base p-6 bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                {option.name}
              </Button>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
