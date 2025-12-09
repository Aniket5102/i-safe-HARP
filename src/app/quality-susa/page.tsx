'use client';

import QualitySusaForm from '@/components/quality-susa-form';

export default function QualitySusaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-50">
      <div className="w-full max-w-4xl">
        <QualitySusaForm />
      </div>
    </main>
  );
}
