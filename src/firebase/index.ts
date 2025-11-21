
'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from './config';

// Re-export all provider hooks
export * from './provider';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function initializes Firebase and should be called on the client side.
function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

// Ensure Firebase is initialized when this module is loaded on the client
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Export a function to get the initialized instances
export function getFirebase() {
  // This is a safety check in case the module is accessed before initialization
  if (!firebaseApp) {
    initializeFirebase();
  }
  return { firebaseApp, auth, firestore };
}

// Export individual services
export { firebaseApp, auth, firestore };
