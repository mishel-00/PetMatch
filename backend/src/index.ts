// index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// ✅ Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Inicializar Firebase con variables de entorno
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

app.get("/", (_req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});

// ✅ Ruta para obtener animales
app.get("/api/animales", async (_req, res) => {
  try {
    const snapshot = await db.collection("animales").get();
    const animales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animales" });
  }
});

// ✅ Verificar token de Firebase Auth
app.post("/api/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection("adoptantes").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({ uid, ...userData });
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
});

// ✅ Crear animal
app.post("/api/animales", async (req, res) => {
  try {
    const data = req.body;
    const nuevo = await db.collection("animales").add(data);
    res.status(201).json({ id: nuevo.id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear animal" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
