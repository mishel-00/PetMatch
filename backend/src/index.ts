// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import adoptanteRoutes from "./routes/adoptante";
import asociacionRoutes from "./routes/asociacion";


// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

app.get("/", (_req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});

//Montar rutas de API necesarias 
app.use("/api/adoptante", adoptanteRoutes); 
app.use("/api/asociacion", asociacionRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
