
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { getFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
  user: null,
  loading: true,
});

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseInstances, setFirebaseInstances] = useState<Omit<FirebaseContextType, 'user' | 'loading'>>({
    firebaseApp: null,
    auth: null,
    firestore: null,
  });
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { firebaseApp, auth, firestore } = getFirebase();
    setFirebaseInstances({ firebaseApp, auth, firestore });

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ ...firebaseInstances, user, loading }}>
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
  const { user, loading } = useFirebase();
  return { user, loading };
}
