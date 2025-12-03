
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseInstances, setFirebaseInstances] = useState<FirebaseContextType>({
    firebaseApp: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    // getFirebase initializes and returns the instances.
    // We do this in a useEffect to ensure it runs only on the client.
    const { firebaseApp, auth, firestore } = getFirebase();
    setFirebaseInstances({ firebaseApp, auth, firestore });
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseInstances}>
      {children}
      <FirebaseErrorListener />
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
}

export const useFirebaseApp = () => {
    const { firebaseApp } = useFirebase();
    // This might be null on initial server render, but will be available on client.
    return firebaseApp;
};

export const useAuth = () => {
    const { auth } = useFirebase();
    return auth;
};

export const useFirestore = () => {
    const { firestore } = useFirebase();
    return firestore;
};
