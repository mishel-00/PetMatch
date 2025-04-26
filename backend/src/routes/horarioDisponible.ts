import express from "express";
import admin from "../firebase";
import { ESTADOS_ADOPCION } from "../utils/enums";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
import { Timestamp } from "firebase-admin/firestore";

const router = express.Router();
//! Ruta general para obtener todos los horarios disponibles
router.get ("/horarioDisponible", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  try {
    const snapshot = await admin
    .firestore()
    .collection("horarioDisponible")
    .where("asociacion_id", "==", uidAsociacion)
    .get();
    console.log("🐾 Horarios disponibles encontrados:", snapshot.docs.length);
    const horariosDisponibles = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(), 
    }));
    res.status(200).json(horariosDisponibles);
  } catch (error: any) {
    console.error("❌ Error al obtener horarios disponibles:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! Post Crear un nuevo horario disponible 
router.post("/horarioDisponible", verificarTokenFireBase, async (req, res): Promise<void> => {
    const uidAsociacion = req.uid;
    if (!uidAsociacion) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
  
    const { fecha, hora } = req.body;
  
    if (!fecha || !hora) {
      res.status(400).json({ error: "Fecha y hora son obligatorias" });
      return;
    }
  
    try {
      const fechaHorario = new Date(fecha); 
      const ahora = new Date();
      const limiteMaximo = new Date();
      limiteMaximo.setDate(ahora.getDate() + 7); // fecha límite: hoy + 7 días
      
      //* Comprobar si la fecha es anterior a la fecha actual
      if (fechaHorario < ahora) {
        res.status(400).json({ error: "No se puede crear un horario en una fecha pasada" });
        return;
      }
  
      if (fechaHorario > limiteMaximo) {
        res.status(400).json({ error: "El horario no puede ser con más de 6 días de antelación" });
        return;
      }
  
      //* Comprobar si el horario ya existe
      const horarioExistente = await admin.firestore()
        .collection("horarioDisponible")
        .where("fecha", "==", fecha)
        .where("hora", "==", hora)
        .where("asociacion_id", "==", uidAsociacion)
        .get();
  
      if (!horarioExistente.empty) {
        res.status(400).json({ error: "El horario ya existe" });
        return;
      }
  
      const horarioData = {
        fecha,
        hora,
        asociacion_id: uidAsociacion,
      };
  
      const nuevoHorario = await admin.firestore()
        .collection("horarioDisponible")
        .add(horarioData);
  
      res.status(201).json({ id: nuevoHorario.id, fecha, hora });
    } catch (error: any) {
      console.error("❌ Error al crear horario:", error);
      res.status(500).json({ error: error.message });
    }
  });
  //! Delete x [id]
  router.delete("/horarioDisponible/:id", verificarTokenFireBase, async (req, res): Promise<void> => {
    const uidAsociacion = req.uid;
    if (!uidAsociacion) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
  
    const { id } = req.params;
  
    try {
      const docRef = admin.firestore().collection("horarioDisponible").doc(id);
      const doc = await docRef.get();
  
      if (!doc.exists) {
        res.status(404).json({ error: "Horario no encontrado" });
        return;
      }
  
      const data = doc.data();
  
      if (data?.asociacion_id !== uidAsociacion) {
        res.status(403).json({ error: "No autorizado para eliminar este horario" });
        return;
      }
  
      await docRef.delete();
      res.status(200).json({ message: `Horario con ID ${id} eliminado correctamente` });
    } catch (error: any) {
      console.error("❌ Error al eliminar horario:", error);
      res.status(500).json({ error: error.message });
    }
  });

//! GET -> Obtener un horario por su ID
router.get("/horarioDisponible/:id", verificarTokenFireBase, async (req, res) => {
    const uidAsociacion = req.uid;
    if (!uidAsociacion) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
  
    const { id } = req.params;
  
    try {
      const docRef = admin.firestore().collection("horarioDisponible").doc(id);
      const doc = await docRef.get();
  
      if (!doc.exists) {
        res.status(404).json({ error: "Horario no encontrado" });
        return;
      }
  
      const data = doc.data();
  
      // Aseguramos que el horario pertenece a la asociación autenticada
      if (data?.asociacion_id !== uidAsociacion) {
        res.status(403).json({ error: "No autorizado para ver este horario" });
      }
  
      res.status(200).json({ id: doc.id, ...data });
    } catch (error: any) {
      console.error("❌ Error al obtener horario por ID:", error);
      res.status(500).json({ error: error.message }); 
    }
  });

  //! PUT -> Actualizar un horario por su ID
  router.put("/horarioDisponible/:id", verificarTokenFireBase, async (req, res): Promise<void> => {
    const uidAsociacion = req.uid;
    if (!uidAsociacion) {
      res.status(401).json({ error: "Token inválido" });
      return;
    }
  
    const { id } = req.params;
    const dataActualizada = req.body;
  
    try {
      const docRef = admin.firestore().collection("horarioDisponible").doc(id);
      const doc = await docRef.get();
  
      if (!doc.exists) {
        res.status(404).json({ error: "Horario no encontrado" });
        return;
      }
  
      const dataOriginal = doc.data();
  
      if (dataOriginal?.asociacion_id !== uidAsociacion) {
        res.status(403).json({ error: "No autorizado para editar este horario" });
        return;
      }
      //* Solo modifica los campos que se han enviado y los demás se mantienen iguales
      await docRef.update(dataActualizada);
  
      res.status(200).json({ message: `Horario con ID ${id} actualizado correctamente` });
    } catch (error: any) {
      console.error("❌ Error al actualizar horario:", error);
      res.status(500).json({ error: error.message });
    }
  });   
  