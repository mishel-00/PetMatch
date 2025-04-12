 // Esto es la conexión con firebase cloud -- mi base de datos
 import admin from "firebase-admin";
 import serviceAccount from "../pet-match-cloud-firebase-adminsdk-fbsvc-d30049cc21.json";
 
 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
 });
 
 const db = admin.firestore();
 export { admin, db };
 