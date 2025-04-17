

import {Request, Response} from "express";
import express from "express";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
import admin from "../firebase";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});

router.get('/asociacion', verificarTokenFireBase, async (req: Request, res: Response) => {
  
  const uid = req.uid;
  
  console.log("Perfil de: ", uid);

  const userDoc = await admin.firestore().collection("adoptantes").doc(uid).get();
  const userData = userDoc.data();

  if (!userData) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.status(200).json({ uid, ...userData });
})  