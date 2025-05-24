import express from "express";
import admin from "../firebase"; 
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase"; 

const router = express.Router();

router.get("/citaId", verificarTokenFireBase, async (req, res) => {
    const citaId = req.query.id as string;
     
    console.log("CITA ---- ID recibido en query:", citaId);
    if (!citaId) {
      res.status(400).json({ error: "Falta id" });
      return; 
    }
  
    try {
      const consulta = `citaPosible/${citaId}`;
      console.log("🔍 Query esperada: citaPosible/%s", citaId);
  
    const allDocs = await admin.firestore().collection("citasAnimal").get();
      console.log("🗂 Todos los citaPosible_id encontrados:");
      allDocs.forEach(doc => {
      console.log("📌", doc.id, "→", doc.data().citaPosible_id);
     });
  
      //? DEBUG
      console.log("🔍 Buscando en citasAnimal con citaPosible_id =", consulta);
      const citasAnimalSnap = await admin
        .firestore()
        .collection("citasAnimal")
        .where("citaPosible_id", "in", [citaId, `citaPosible/${citaId}`])
        .limit(1)
        .get();
  
      if (citasAnimalSnap.empty) {
        //? DEBUG
        console.warn("⚠ No se encontró ningún documento en citasAnimal con ese citaPosible_id");
        const dump = await admin.firestore().collection("citasAnimal").get();
        console.log("--- Lista actual de citaPosible_id en citasAnimal:");
        dump.docs.forEach((doc) => {
          console.log("  🔸", doc.data().citaPosible_id);
        });
        res.status(404).json({ error: "No se encontró relación cita-animal" });
        return;
      }
  
      const animalRefPath = citasAnimalSnap.docs[0].data().animal_id;
      const animalDoc = await admin.firestore().doc(animalRefPath).get();
  
      if (!animalDoc.exists) {
        res.status(404).json({ error: "Animal no encontrado" });
        return;
      }
      //? DEBUG
      console.log("📦 Datos del animal:", animalDoc.data());
      res.json({ animal: { id: animalDoc.id, ...animalDoc.data() } });
  
    } catch (err) {
      console.error("Error al obtener animal:", err);
      res.status(500).json({ error: "Error interno" });
      return;
    }
  });

export default router;