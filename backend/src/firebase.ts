// Esto es la conexión con firebase cloud -- mi base de datos 
import admin from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

// Asegurarse de que la clave privada tenga el formato correcto
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : undefined;

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: privateKey,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Verificar que todas las propiedades requeridas estén presentes
if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
  console.error("❌ Error: Faltan credenciales de Firebase. Verifica tus variables de entorno.");
  console.error("projectId:", serviceAccount.projectId ? "✓" : "✗");
  console.error("privateKey:", serviceAccount.privateKey ? "✓" : "✗");
  console.error("clientEmail:", serviceAccount.clientEmail ? "✓" : "✗");
}

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: "pet-match-cloud.appspot.com",
    });
    console.log("✅ Firebase inicializado correctamente con bucket de almacenamiento");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
  }
}

export const db = admin.firestore();
export default admin;