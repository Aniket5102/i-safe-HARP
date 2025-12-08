
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
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
  loading: true,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseInstances, setFirebaseInstances] = useState<Omit<FirebaseContextType, 'loading'>>({
    firebaseApp: null,
    auth: null,
    firestore: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { firebaseApp, auth, firestore } = getFirebase();
    setFirebaseInstances({ firebaseApp, auth, firestore });
    setLoading(false);
  }, []);

  return (
    <FirebaseContext.Provider value={{ ...firebaseInstances, loading }}>
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

export const useUser = () => {
  const { loading } = useFirebase();
  // Return null for user as authentication is removed.
  return { user: null, loading };
}
