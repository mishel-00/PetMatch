// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import loginRoutes from "./routes/login";
import registroRoutes from "./routes/registro";
import animalRoutes from "./routes/animal";
import horarioRoutes from "./routes/horarioDisponible";
import cron from "node-cron";
import { limpiarHorariosPasados } from './utils/fnDatosFront';

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
app.use("/api", loginRoutes);
app.use("/api", registroRoutes);
app.use("/api", animalRoutes);
app.use("/api", horarioRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});

//* ===============================CRON PROGRAMAR TAREA PARA LIMPIAR HORARIOS PASADOS ===============================
//* Tarea programada para limpiar horarios pasados
//* Cada horario que pase es un día, se limpia sino tiene citaPosible asociada
cron.schedule("0 0 * * *", async () => {
  console.log("Ejecutando limpieza automática de horarios pasados...");
  try {
    await limpiarHorariosPasados();
    console.log("✅ Limpieza de horarios pasada ejecutada correctamente.");
  } catch (error) {
    console.error("❌ Error al ejecutar la limpieza automática:", error);
  }
});
