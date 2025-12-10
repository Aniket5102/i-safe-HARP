'use client';

import BbsForm from '@/components/bbs-form';
import { ShieldCheck } from 'lucide-react';

export default function BbsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <BbsForm />
      </div>
    </main>
  );
}
