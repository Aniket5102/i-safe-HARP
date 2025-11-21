
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

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
    if (!firebaseApp) {
        // This might be thrown on initial server render, but will be available on client.
        // Or if there is a legitimate error.
        throw new Error('Firebase App not available.');
    }
    return firebaseApp;
};

export const useAuth = () => {
    const { auth } = useFirebase();
    if (!auth) {
        throw new Error('Firebase Auth not available.');
    }
    return auth;
};

export const useFirestore = () => {
    const { firestore } = useFirebase();
    if (!firestore) {
        throw new Error('Firestore not available.');
    }
    return firestore;
};
