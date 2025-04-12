// Este archivo levanta el backend y crea las primeras rutas


import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { admin, db } from './firebase';



const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});


// Ejemplo: Obtener lista de animales desde Firebase
app.get("/api/animales", async (_req, res) => {
  try {
    const snapshot = await db.collection("animales").get();
    const animales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animales" });
  }
});
//  Verificar token JWT de Firebase Auth
const verifyToken = async (req: any, res: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Recuperar datos del usuario desde Firestore (colección "adoptantes")
    const userDoc = await admin.firestore().collection("adoptantes").doc(uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({ uid, ...userData });
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Luego usar la función en la ruta
app.post("/api/verify", verifyToken);

// Ejemplo: Crear nuevo animal
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

