


import express from "express";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
import admin from "../firebase";

const router = express.Router();

router.post('/login', verificarTokenFireBase, async (req, res): Promise<void> => {
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


export default router;