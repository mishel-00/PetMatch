// index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from './firebase';
import loginRoutes from "./routes/login";
import registroRoutes from "./routes/registro";
import animalRoutes from "./routes/animal";
import horarioRoutes from "./routes/horarioDisponible";
import asociacionRoutes from "./routes/asociacion";
import citaPosibleRoutes from "./routes/citaPosible";
import cron from "node-cron";
import { limpiarHorariosPasados } from './utils/fnDatosFront';

//!! DEBUG
import path from 'path';

// Cargar variables de entorno
dotenv.config();

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';


const app = express();
app.use(cors());
app.use(express.json());

//! DEBUG MODE 
// app.get('/debug/:path(*)', (req, res) => {
//   res.sendFile(path.join(__dirname, 'debug', req.params.path));
// });




const db = admin.firestore();

app.get("/", (_req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});

//Montar rutas de API necesarias 
app.use("/api", loginRoutes);
app.use("/api", registroRoutes);
app.use("/api", animalRoutes);
app.use("/api", horarioRoutes);
app.use("/api", asociacionRoutes);
app.use("/api", citaPosibleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});

//* ===============================CRON PROGRAMAR TAREA PARA LIMPIAR HORARIOS PASADOS ===============================
//* Tarea programada para limpiar horarios pasados
//* Cada horario que pase es un día, se limpia sino tiene citaPosible asociada
cron.schedule("0 * * * *", async () => {
  console.log("Ejecutando limpieza automática de horarios pasados...");
  try {
    await limpiarHorariosPasados();
    console.log("✅ Limpieza de horarios pasada ejecutada correctamente.");
  } catch (error) {
    console.error("❌ Error al ejecutar la limpieza automática:", error);
  }
});
// A las 12.00 AM --> 0 0 * * *
// 1 MINS --> "*/1 * * * *"
// 1 HOUR --> "0 * * * *"
// 1 DAY --> "0 0 * * *"