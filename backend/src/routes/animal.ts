import express from "express";
import admin from "../firebase";
import { ESTADOS_ADOPCION } from "../utils/enums";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";

const router = express.Router();

router.post("/animal", verificarTokenFireBase, async (req, res) => {

  console.log("Peticion [POST] llega al backend /api/animal");

  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { 
    foto, 
    nombre, 
    descripcion, 
    estadoAdopcion, 
    esterilizado, 
    especie, 
    tipoRaza, 
    peso, 
    fecha_nacimiento, 
    fecha_ingreso, 
   } = req.body;

  if ( !foto || !nombre || !descripcion || !estadoAdopcion || typeof esterilizado !== "boolean" || !especie || !tipoRaza || ! peso || !fecha_nacimiento || !fecha_ingreso ) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  const estadoType = ESTADOS_ADOPCION.includes(estadoAdopcion) ? estadoAdopcion : "En adopcion";

  try {
    const animalData = await admin.firestore().collection("animal").add({
      foto,
      nombre,
      descripcion,
      estadoAdopcion: estadoType,
      esterilizado,
      especie,
      tipoRaza,
      peso,
      fecha_nacimiento,
      fecha_ingreso,
      asociacion_id: uidAsociacion,
    });

    res.status(201).json({ uid: animalData.id, nombre });
  } catch (error: any) {
    console.error("❌ Error al registrar animal:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

export default router;