import express from "express";
import admin from "../firebase";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
const QRCode = require('qrcode');



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

  const { horarioDisponible_id, hora, fecha, asociacion_id, observaciones, animal_id } = req.body;

  if (!horarioDisponible_id || !hora || !fecha || !asociacion_id || !animal_id) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }
  
  const yaExisteCitaParaAnimal = await admin
  .firestore()
  .collection("citasAnimal")
  .where("animal_id", "==", animal_id)
  .get();

if (!yaExisteCitaParaAnimal.empty) {
   res.status(400).json({error: "Ya has solicitado una cita para este animal",});
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

    if (!animal_id) {
    res.status(400).json({ error: "Falta el ID del animal" });
    return;
  }


await admin.firestore().collection("citasAnimal").add({
  citaPosible_id: nuevaCita.path, 
  animal_id: `animal/${animal_id}` 
});

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
//? "Quiero todas las citas con estado: 'aceptada', adoptante_id: X y ordenadas por fecha" -> índice Firebase
//* [Adoptante] -> GET -> Ver las citas aceptadas por la asociación
router.get("/citaPosible/aceptadas", verificarTokenFireBase, async (req, res) => {
  const uidAdoptante = req.uid;

  try {
    const hoy = new Date().toISOString().split('T')[0];

    const snapshot = await admin
      .firestore()
      .collection("citaPosible")
      .where("adoptante_id", "==", uidAdoptante)
      .where("estado", "==", "aceptada")
      .where("fecha", ">=", hoy)
      .get();

    const citas = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        const { asociacion_id, fecha, hora } = data;

        let nombreDelAnimal = "No asignado";
        let especieAnimal = "Desconocido";
        let asociacionNombre = "";
        let animalIdParaRetornar: string | null = null; 

        
        const citasAnimalSnapshot = await admin
          .firestore()
          .collection("citasAnimal")
          .where("citaPosible_id", "==", doc.ref.path) 
          .limit(1)
          .get();

        if (!citasAnimalSnapshot.empty) {
          const animalDocPath = citasAnimalSnapshot.docs[0].data().animal_id; 
          animalIdParaRetornar = animalDocPath;
          if (animalDocPath && typeof animalDocPath === "string") {
            const animalRef = admin.firestore().doc(animalDocPath); 
            const animalSnap = await animalRef.get();
            const animalData = animalSnap.data();
            if (animalData) {
              nombreDelAnimal = animalData.nombre || nombreDelAnimal;
              especieAnimal = animalData.especie || especieAnimal;
            }
          }
        }

  
        if (asociacion_id && typeof asociacion_id === "string") {        
          const asociacionRef = admin.firestore().collection("asociacion").doc(asociacion_id);
          const asociacionSnap = await asociacionRef.get();
          const asociacionData = asociacionSnap.data();
          if (asociacionData) {
            asociacionNombre = asociacionData.nombre || "";
          }
        }

        return {
          uidAsociacion: asociacion_id || "", 
          asociacionNombre,
          animalId: animalIdParaRetornar, 
          nombreAnimal: nombreDelAnimal,
          especie: especieAnimal,
          fecha,
          hora,
        };
      })
    );

    res.status(200).json(citas);
  } catch (error: any) {
    console.error("❌ Error obteniendo citas aceptadas:", error);
    res.status(500).json({ error: error.message });
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
    }
    res.status(200).json(citasConInfo);

    } catch (error: any) {
      console.error("❌ Error al obtener citas:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

//* [Asociacion] -> POST -> CitaPosible x Adoptante
router.post("/citaPosible/validar", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { idCitaPosible, nuevoEstado } = req.body;

  if (!idCitaPosible || !["aceptada", "rechazada"].includes(nuevoEstado)) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  try {
    const citaRef = admin.firestore().collection("citaPosible").doc(idCitaPosible);
    const citaDoc = await citaRef.get();

    if (!citaDoc.exists) {
      res.status(404).json({ error: "Cita no encontrada" });
      return;
    }

    const citaData = citaDoc.data();
    if (citaData?.asociacion_id !== uidAsociacion) {
      res.status(403).json({ error: "No autorizado para validar esta cita" });
      return;
    }

  
    const updateData: { estado: string; qrCodeURL?: string } = { estado: nuevoEstado };

    if (nuevoEstado === "aceptada") {
      try {
        const citasAnimalSnap = await admin
          .firestore()
          .collection("citasAnimal")
          .where("citaPosible_id", "==", `citaPosible/${idCitaPosible}`)
          .limit(1)
          .get();

        if (citasAnimalSnap.empty) {
          res.status(400).json({ error: "No se encontró animal asociado a esta cita" });
          return;
        }

        const animalRefPath = citasAnimalSnap.docs[0].data().animal_id;

        if (!animalRefPath || typeof animalRefPath !== "string") {
          res.status(400).json({ error: "ID del animal inválido" });
          return;
        }
        const animalId = animalRefPath.split("/").pop();
        const qrDataToEncode = `https://petmatch.com/fichaAnimal?id=${animalId}`;
        const qrCodeBuffer = await QRCode.toBuffer(qrDataToEncode);
        const fileName = `qrCodes/cita_${idCitaPosible}.png`;

        const bucket = admin.storage().bucket();

        const file = bucket.file(fileName);

        await file.save(qrCodeBuffer, {
          metadata: { contentType: "image/png" },
          public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updateData.qrCodeURL = publicUrl;

        const animalRef = admin.firestore().doc(animalRefPath);
        await animalRef.update({ estadoAdopcion: "reservado" });

      } catch (qrError) {
        console.error("❌ Error generando o subiendo el QR Code:", qrError);
        delete updateData.qrCodeURL;
      }
    } else if (nuevoEstado === "rechazada") {
      await admin
        .firestore()
        .collection("adoptante")
        .doc(citaData.adoptante_id)
        .update({
          solicitudes_activas: admin.firestore.FieldValue.increment(-1),
        });
    }

    await citaRef.update(updateData);

    res.status(200).json({
      message:
        nuevoEstado === "aceptada"
          ? "Cita aceptada y animal reservado"
          : "Cita rechazada correctamente",
      qrCodeURL: updateData.qrCodeURL ?? null,
    });

  } catch (error: any) {
    console.error(`❌ Error al cambiar estado de cita a ${nuevoEstado}:`, error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
