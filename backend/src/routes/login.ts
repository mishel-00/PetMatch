
import express from "express";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
import admin, { db } from "../firebase";

const router = express.Router();

router.post('/login', verificarTokenFireBase, async (req, res): Promise<void> => {

  console.log("📩 Petición recibida en /api/login");
  console.log("🔐 Headers:", req.headers);
  
  const uid = req.uid;

  if (!uid) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
  
  console.log("Perfil de: ", uid);

  let userDoc = await admin.firestore().collection("adoptante").doc(uid).get();
  let userData = userDoc.data();
  let rol = "adoptante";

  if (!userDoc.exists) {
    userDoc = await admin.firestore().collection("asociacion").doc(uid).get();
    userData = userDoc.data();
    rol = "asociacion";
  }

  if (!userDoc.exists) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.status(200).json({ uid, rol, ...userData });
});

router.post("/register-push-token", verificarTokenFireBase, async (req, res) => {
  const { token, userId, platform } = req.body;

  if (!token || !userId) {
     res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    
    const docAdoptante = await db.collection("adoptante").doc(userId).get();
    const docAsociacion = await db.collection("asociacion").doc(userId).get();

    if (docAdoptante.exists) {
      await db.collection("adoptante").doc(userId).update({ tokenFCM: token });
    } else if (docAsociacion.exists) {
      await db.collection("asociacion").doc(userId).update({ tokenFCM: token });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Token guardado correctamente" });
  } catch (error: any) {
    console.error("❌ Error guardando token:", error);
     res.status(500).json({ error: error.message });
  }
});

export default router;