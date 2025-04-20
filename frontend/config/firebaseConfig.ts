// lib/firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA03Te6mcqKgM1tDcdqaS1QfkRayhd6-Xs",
  authDomain: "pet-match-cloud.firebaseapp.com",
  projectId: "pet-match-cloud",
  storageBucket: "pet-match-cloud.appspot.com",
  messagingSenderId: "186416761578",
  appId: "1:186416761578:web:e69d62308331b5f9152593"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);