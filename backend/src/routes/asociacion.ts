import express from "express";
import admin from "../firebase"; // (o la ruta correcta a tu firebase.ts)
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";


const router = express.Router();

//! GET -> Obtener todas las asociaciones
router.get("/asociaciones", verificarTokenFireBase, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("asociacion")
      .get();

    console.log("🐾 Asociaciones encontradas:", snapshot.docs.length);

    const asociaciones = snapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
      telefono: doc.data().telefono,
      direccion: doc.data().direccion,
      // ...doc.data(),
    }));

    res.status(200).json(asociaciones);
  } catch (error: any) {
    console.error("❌ Error al obtener asociaciones:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
