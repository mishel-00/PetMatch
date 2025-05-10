 // Esto es la conexión con firebase cloud -- mi base de datos 
 import admin from "firebase-admin";
 import dotenv from 'dotenv';
 
  dotenv.config();
 const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: "pet-match-cloud.appspot.com",
  });
}

export const db = admin.firestore();
export default admin; 