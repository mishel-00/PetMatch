// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA03Te6mcqKgM1tDcdqaS1QfkRayhd6-Xs",
  authDomain: "pet-match-cloud.firebaseapp.com",
  projectId: "pet-match-cloud",
  storageBucket: "pet-match-cloud.firebasestorage.app",
  messagingSenderId: "186416761578",
  appId: "1:186416761578:web:e69d62308331b5f9152593"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
