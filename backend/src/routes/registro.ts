import express from "express";
import admin from "../firebase";

const router = express.Router();

router.post("/registro", async (req, res) => {

  console.log("Peticion llega al backend /api/registro")
  const { nombre, email, password, telefono, direccion, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
     res.status(400).json({ error: "Faltan campos obligatorios" });
     return; 
  }

  try {
    
    const userRecord = await admin.auth().createUser({email,password,});
    const uid = userRecord.uid;

    
    const collection = rol === "asociacion" ? "asociacion" : "adoptante";

    
    const userData: any = {
      nombre,
      email: email.trim().toLowerCase(),
      direccion,
      telefono,
      fecha_registro: new Date(),
    };

    if (rol === "adoptante") {
      userData.fecha_ultimo_login = new Date();
      userData.fecha_ultima_adopcion = null;
      userData.foto = "";
      userData.solicitudes_activas = 0;
    }

   
    await admin.firestore().collection(collection).doc(uid).set(userData);
    res.status(201).json({ uid, email, rol });
  } catch (error: any) {
    console.error("❌ Error al registrar usuario:", error);
     res.status(500).json({ error: error.message });
     return;
  }
});

export default router;
