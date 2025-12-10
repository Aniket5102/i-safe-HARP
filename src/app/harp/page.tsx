'use client';

import HarpForm from '@/components/harp-form';

export default function HarpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <HarpForm />
      </div>
    </main>
  );
}
