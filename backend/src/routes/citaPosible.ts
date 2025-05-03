import express from "express";
import admin from "../firebase";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";

//Todo: PUT cuando se actualiza citaPosible a estado 'Cancelada' hay que actualizar el numero de solicitudes activas del adoptante

//Todo: Hacer el get [Asociacion] -> CloudMessaging Firebase
const router = express.Router();
router.get("/citaPosible", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("citaPosible")
      .where("asociacion_id", "==", uidAsociacion)
      .get();

    const citas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(citas);
  } catch (error: any) {
    console.error("❌ Error al obtener citas:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/citaPosible", verificarTokenFireBase, async (req, res) => {
  const uidAdoptante = req.uid;
  if (!uidAdoptante) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { horarioDisponible_id, hora, fecha, asociacion_id, observaciones } =
    req.body;

  if (!horarioDisponible_id || !hora || !fecha || !asociacion_id) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("citaPosible")
      .where("adoptante_id", "==", uidAdoptante)
      .where("estado", "in", ["pendiente", "aceptada"])
      .get();

    const citasMaximas = snapshot.docs.length;
    // if (citasMaximas >= 5) {
    //   res.status(400).json({ error: "No se pueden registrar más citas" });
    //   return;
    // }

    const citaData = {
      horarioDisponible_id,
      hora,
      fecha,
      asociacion_id,
      observaciones,
      estado: "pendiente",
      adoptante_id: uidAdoptante,
    };

    const citaExistente = await admin
      .firestore()
      .collection("citaPosible")
      .where("horarioDisponible_id", "==", horarioDisponible_id)
      .where("hora", "==", hora)
      .get();

    // if (!citaExistente.empty) {
    //  res.status(400).json({ error: "Esa hora ya está reservada por otra persona" });
    //  return;
    // }

    //Todo -------------------- Si esto no funciona, hay que cambiar el orden de comprobacion ------------------
    if (!citaExistente.empty || snapshot.docs.length >= 5) {
      res.status(400).json({
        error: !citaExistente.empty
          ? "Esa hora ya está reservada por otra persona"
          : "Ya tiene 5 solicitudes activas. No se pueden registrar más citas. Debes esperar a que se liberen las citas pasadas.",
      });
      return;
    }

    const nuevaCita = await admin
      .firestore()
      .collection("citaPosible")
      .add(citaData);

    await admin
      .firestore()
      .collection("adoptante")
      .doc(uidAdoptante)
      .update({ solicitudes_activas: admin.firestore.FieldValue.increment(1) });
    res.status(201).json({ id: nuevaCita.id, hora, fecha });
  } catch (error: any) {
    console.error("❌ Error al registrar cita:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//* [Asociacion] -> GET -> CitasPosibles x Adoptantes
router.get("/citaPosible/pendientes/asociacion",verificarTokenFireBase, async (req, res) => {
    const uidAsociacion = req.uid;

    try {
      const snapshot = await admin
        .firestore()
        .collection("citaPosible")
        .where("asociacion_id", "==", uidAsociacion)
        .where("estado", "==", "pendiente")
        .get();

      const citasConInfo = [];

      for (const doc of snapshot.docs) {
        const cita = doc.data();

        // Obtener nombre del adoptante
        const adoptanteSnap = await admin
          .firestore()
          .collection("adoptante")
          .doc(cita.adoptante_id)
          .get();

        const nombreAdoptante = adoptanteSnap.exists ? adoptanteSnap.data()?.nombre : "Desconocido";
      
      // Buscar animal asociado a la cita
      const animalSnapshot = await admin
        .firestore()
        .collection("citasAnimal")
        .where("citaPosible_id", "==", doc.ref.path) 
        .limit(1)
        .get();

      let nombreAnimal = "No asignado";
      let animalId = null;

      if (!animalSnapshot.empty) {
        animalId = animalSnapshot.docs[0].data().animal_id;
        const animalDoc = await admin.firestore().doc(animalId).get();
        nombreAnimal = animalDoc.exists ? animalDoc.data()?.nombre : "Desconocido";
      }
    
      citasConInfo.push({
        id: doc.id,
        fecha: cita.fecha,
        hora: cita.hora,
        estado: cita.estado,
        observaciones: cita.observaciones || "",
        adoptante: {
          id: cita.adoptante_id,
          nombre: nombreAdoptante,
        },
        animal: {
          id: animalId, 
          nombre: nombreAnimal,
        },
      });
      res.status(200).json(citasConInfo);
    }
    } catch (error: any) {
      console.error("❌ Error al obtener citas:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
export default router;
