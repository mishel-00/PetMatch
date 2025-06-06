// Esto es la conexión con firebase cloud -- mi base de datos 
import admin from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

// que la clave privada tenga el formato correcto
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
      projectId: "pet-match-cloud", 
      storageBucket: "pet-match-cloud.firebasestorage.app",
    });
    console.log("✅ Firebase inicializado correctamente con bucket de almacenamiento");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
  }
}

export const enviarNotificacion = async (
  token: string,
  titulo: string,
  cuerpo: string
) => {
  try {
    await admin.messaging().send({
      token,
      notification: {
        title: titulo,
        body: cuerpo,
      },
    });
    console.log('✅ Notificación enviada con éxito');
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  }
};
export const obtenerTokenAdoptante = async (uid: string) => {
  const doc = await admin.firestore().collection("adoptante").doc(uid).get();
  return doc.exists ? doc.data()?.tokenFCM ?? null : null;
};

export const obtenerTokenAsociacion = async (uid: string) => {
  const doc = await admin.firestore().collection("asociacion").doc(uid).get();
  return doc.exists ? doc.data()?.tokenFCM ?? null : null;
};
export const db = admin.firestore();
export default admin;