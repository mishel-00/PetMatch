

import {Request, Response} from "express";
import express from "express";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
import admin from "../firebase";

const router = express.Router();

router.get('/perfil', verificarTokenFireBase, async (req, res ) => {
  
  const uid = req.uid;
  
  console.log("Perfil de: ", uid);

  if (!uid) {
   res.status(401).json({ error: "Token inválido" });
   return;
  }

  const userDoc = await admin.firestore().collection("adoptantes").doc(uid).get();
  const userData = userDoc.data();

  if (!userData) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

   res.status(200).json({ uid, ...userData });
})  

export default router;