import express from "express";
import admin from "../firebase";
import { ESTADOS_ADOPCION } from "../utils/enums";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";

const router = express.Router();
//! Ruta general sin filtros aplicados
router.get ("/animal", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  try {
    const snapshot = await admin
    .firestore()
    .collection("animal")
    .where("asociacion_id", "==", uidAsociacion)
    .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! GET -> Filtrar por estado de adopcion
router.get("/animal/estado", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { estado } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("estadoAdopcion", "==", estado)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! GET -> Filtrar por especie
router.get("/animal/especie", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { especie } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("especie", "==", especie)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! GET -> Filtrar por tipo de raza
router.get("/animal/tipoRaza", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { tipoRaza } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("tipoRaza", "==", tipoRaza)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});


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