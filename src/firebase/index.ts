
'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from './config';

// Re-export all provider hooks
export * from './provider';

// Initialize Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

// Export a function to get the initialized instances
export function getFirebase() {
    if (!firebaseApp) {
        initializeFirebase();
    }
    return { firebaseApp, auth, firestore };
}

// Export individual services
export { firebaseApp, auth, firestore };
