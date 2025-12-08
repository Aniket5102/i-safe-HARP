
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      const errorMessage = `
        <div class="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive-foreground">
          <p class="font-bold">Firestore Security Rules Denied this Request</p>
          <div class="mt-2 text-sm space-y-1">
            <p><strong>Operation:</strong> ${error.context.operation}</p>
            <p><strong>Path:</strong> ${error.context.path}</p>
            <p><strong>User Authenticated:</strong> No (Public Access)</p>
            <p class="font-semibold mt-2">Request Data:</p>
            <pre class="text-xs bg-black/20 p-2 rounded-md whitespace-pre-wrap">${JSON.stringify(error.context.requestResourceData || 'No data', null, 2)}</pre>
          </div>
        </div>
      `;

      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: <div dangerouslySetInnerHTML={{ __html: errorMessage }} />,
        duration: 20000,
      });

      // This is a special case to throw an uncaught error in development,
      // which will be picked up by the Next.js development overlay.
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
