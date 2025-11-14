import HarpForm from '@/components/harp-form';
import { ScanSearch } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
           <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-lg">
            <ScanSearch className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            HARP Insight
          </h1>
        </header>
        <HarpForm />
      </div>
    </main>
  );
}
