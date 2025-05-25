import express from "express";
import admin, { enviarNotificacion, obtenerTokenAdoptante, obtenerTokenAsociacion } from "../firebase";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";
const QRCode = require('qrcode');



//Todo: PUT cuando se actualiza citaPosible a estado 'Cancelada' hay que actualizar el numero de solicitudes activas del adoptante


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

  try {
    //* si ya hay una cita para ese animal
    const yaExisteCitaParaAnimal = await admin
      .firestore()
      .collection("citasAnimal")
      .where("animal_id", "==", `animal/${animal_id}`)
      .get();

    if (!yaExisteCitaParaAnimal.empty) {
       res.status(400).json({ error: "Ya has solicitado una cita para este animal" });
       return; 
    }

    //*  una cita el mismo día
    const citasMismoDia = await admin
      .firestore()
      .collection("citaPosible")
      .where("adoptante_id", "==", uidAdoptante)
      .where("fecha", "==", fecha)
      .where("estado", "in", ["pendiente", "aceptada"])
      .get();

    if (!citasMismoDia.empty) {
       res.status(400).json({ error: "Ya tienes una cita para este día" });
       return; 
    }

    // *  muchas citas activas
    const citasMaximas = await admin
      .firestore()
      .collection("citaPosible")
      .where("adoptante_id", "==", uidAdoptante)
      .where("estado", "in", ["pendiente", "aceptada"])
      .get();

    if (citasMaximas.docs.length >= 5) {
       res.status(400).json({ error: "Ya tienes 5 solicitudes activas. No puedes registrar más citas hasta que se liberen." });
       return; 
    }

    // *  si esa hora ya está ocupada por otra persona
    const citaExistente = await admin
      .firestore()
      .collection("citaPosible")
      .where("horarioDisponible_id", "==", horarioDisponible_id)
      .where("hora", "==", hora)
      .where("estado", "in", ["pendiente", "aceptada"])
      .get();

    if (!citaExistente.empty) {
       res.status(400).json({ error: "Esa hora ya está reservada por otra persona" });
       return; 
    }

    //* Crear la cita
    const citaData = {
      horarioDisponible_id,
      hora,
      fecha,
      asociacion_id,
      observaciones,
      estado: "pendiente",
      adoptante_id: uidAdoptante,
      animal_id: animal_id, 
    };

    const nuevaCita = await admin.firestore().collection("citaPosible").add(citaData);

    
    await admin.firestore().collection("citasAnimal").add({
      //citaPosible_id: nuevaCita.path,
      citaPosible_id: `citaPosible/${nuevaCita.id}`,

      animal_id: `animal/${animal_id}`,
    });

    //* Actualiza contador de citas activas del adoptante
    if (!uidAdoptante) {
      throw new Error("Invalid adoptante ID");
    }

    
    const animalDoc = await admin.firestore().collection('animal').doc(animal_id).get();
    const idAsociacion = animalDoc.data()?.asociacion_id; 

    const tokenAsociacion = await obtenerTokenAsociacion(idAsociacion);

    //! noti
    if (tokenAsociacion) {
      await enviarNotificacion(
        tokenAsociacion,
        'Nueva solicitud de cita 🐾',
        'Un adoptante ha solicitado una cita para uno de tus animales. Revisa la app para más detalles',
      );
    }
    
    await admin.firestore().collection("adoptante").doc(uidAdoptante).update({
      solicitudes_activas: admin.firestore.FieldValue.increment(1),
    });

    res.status(201).json({ id: nuevaCita.id, hora, fecha });
  } catch (error: any) {
    console.error("❌ Error al registrar cita:", error);
    res.status(500).json({ error: error.message });
  }
});

// router.post("/citaPosible", verificarTokenFireBase, async (req, res) => {
//   const uidAdoptante = req.uid;
//   if (!uidAdoptante) {
//     res.status(401).json({ error: "Token inválido" });
//     return;
//   }

//   const { horarioDisponible_id, hora, fecha, asociacion_id, observaciones, animal_id } = req.body;

//   if (!horarioDisponible_id || !hora || !fecha || !asociacion_id || !animal_id) {
//     res.status(400).json({ error: "Faltan campos obligatorios" });
//     return;
//   }
  
//   const citasMismoDia = await admin
//     .firestore()
//     .collection("citaPosible")
//     .where("adoptante_id", "==", uidAdoptante)
//     .where("fecha", "==", fecha)
//     .where("estado", "in", ["pendiente", "aceptada"])
//     .get();

//   if (!citasMismoDia.empty) {
//     res.status(400).json({ error: "Ya tienes una cita para este día" });
//     return;
//   }
//   const yaExisteCitaParaAnimal = await admin
//   .firestore()
//   .collection("citasAnimal")
//   .where("animal_id", "==", animal_id)
//   .get();

// if (!yaExisteCitaParaAnimal.empty) {
//    res.status(400).json({error: "Ya has solicitado una cita para este animal",});
//   return; 
//   }


//   try {
//     const snapshot = await admin
//       .firestore()
//       .collection("citaPosible")
//       .where("adoptante_id", "==", uidAdoptante)
//       .where("estado", "in", ["pendiente", "aceptada"])
//       .get();

//     const citasMaximas = snapshot.docs.length;
//     // if (citasMaximas >= 5) {
//     //   res.status(400).json({ error: "No se pueden registrar más citas" });
//     //   return;
//     // }

//     const citaData = {
//       horarioDisponible_id,
//       hora,
//       fecha,
//       asociacion_id,
//       observaciones,
//       estado: "pendiente",
//       adoptante_id: uidAdoptante,
//     };

//     const citaExistente = await admin
//       .firestore()
//       .collection("citaPosible")
//       .where("horarioDisponible_id", "==", horarioDisponible_id)
//       .where("hora", "==", hora)
//       .get();

//     // if (!citaExistente.empty) {
//     //  res.status(400).json({ error: "Esa hora ya está reservada por otra persona" });
//     //  return;
//     // }

//     //Todo -------------------- Si esto no funciona, hay que cambiar el orden de comprobacion ------------------
//     //!! CAMBIARLO LO DE 100 A 5
//     if (!citaExistente.empty || snapshot.docs.length >= 100) {
//       res.status(400).json({
//         error: !citaExistente.empty
//           ? "Esa hora ya está reservada por otra persona"
//           : "Ya tiene 5 solicitudes activas. No se pueden registrar más citas. Debes esperar a que se liberen las citas pasadas.",
//       });
//       return;
//     }

//     const nuevaCita = await admin
//       .firestore()
//       .collection("citaPosible")
//       .add(citaData);

//     if (!animal_id) {
//     res.status(400).json({ error: "Falta el ID del animal" });
//     return;
//   }


// await admin.firestore().collection("citasAnimal").add({
//   citaPosible_id: nuevaCita.path, 
//   animal_id: `animal/${animal_id}` 
// });

//     await admin
//       .firestore()
//       .collection("adoptante")
//       .doc(uidAdoptante)
//       .update({ solicitudes_activas: admin.firestore.FieldValue.increment(1) });
//     res.status(201).json({ id: nuevaCita.id, hora, fecha });
//   } catch (error: any) {
//     console.error("❌ Error al registrar cita:", error);
//     res.status(500).json({ error: error.message });
//     return;
//   }
// });
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
          id: doc.id,
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
        
        const citasAnimalDoc = citasAnimalSnap.docs[0];
        const animalRefPath = citasAnimalSnap.docs[0].data().animal_id;

        await citasAnimalDoc.ref.update({
          animal_id:  animalRefPath || admin.firestore.FieldValue.delete(),
          citaPosible_id: `citaPosible/${idCitaPosible}`,
        });

        //? DEBUG
        console.log("📝 Guardando citaPosible_id como:", `citaPosible/${idCitaPosible}`);

        
        const uidAdoptante = citaDoc.data()?.adoptante_id;
    
        const tokenAdoptante = await obtenerTokenAdoptante(uidAdoptante);
        //! noti 
        if (tokenAdoptante) {
          await enviarNotificacion(
            tokenAdoptante,
            '¡Cita confirmada!',
            'Felicidades 🎉 Tu cita con la asociación ha sido aceptada. Revisa la app para más detalles.'
          );
        }

        if (!animalRefPath || typeof animalRefPath !== "string") {
          res.status(400).json({ error: "ID del animal inválido" });
          return;
        }
        const animalId = animalRefPath.split("/").pop();
        // Verificar que el animalId extraído no sea vacío
        if (!animalId) {
          console.error("❌ Error: El animalId extraído de animalRefPath está vacío. animalRefPath original:", animalRefPath);
          
          throw new Error(`El ID del animal extraído de '${animalRefPath}' está vacío.`);
        }
        
        // Obtener datos completos del animal para el QR
        const animalDocRef = admin.firestore().doc(animalRefPath);
        const animalSnap = await animalDocRef.get();
        const animalData = animalSnap.data();
        
        if (!animalData) {
          throw new Error(`No se encontraron datos para el animal con ID ${animalId}`);
        }
        
        // Crear objeto JSON con información completa del animal
        const qrDataObject = {
          id: animalId,
          nombre: animalData.nombre || "Sin nombre",
          especie: animalData.especie || "Desconocido",
          descripcion: animalData.descripcion || "Sin descripción", 
          citaPosible_id: idCitaPosible,
        };
        
        
        // const qrDataToEncode = JSON.stringify(qrDataObject);
       // const qrURL = `https://tu-frontend.com/qr?cita=${idCitaPosible}`;
      //  const qrURL = `http://localhost:3000/fichaAnimal?cita=${idCitaPosible}`;
       // const qrURL = `${req.protocol}://${req.get('host')}/api/citaPosible/escanear?id=${idCitaPosible}`; // Usar un esquema de URL personalizado para la app
       const qrURL = `petmatch://cita?id=${idCitaPosible}`; // Si configuraste el esquema "petmatch" en app.config.ts
       
       //?? DEBUG 
       console.log("🔍 ---URL QR----", qrURL);
       
        // Opciones para la generación del código QR
        const qrCodeOptions = {
          errorCorrectionLevel: 'H', // Nivel alto de corrección de errores
          type: 'image/png',         // Especificar el tipo de imagen
          margin: 2,                 // Margen alrededor del QR (en módulos)
          scale: 4,                  // Factor de escala para el tamaño del QR
          color: {
            dark: '#000000FF',       // Color de los módulos del QR (negro)
            light: '#FFFFFFFF'      // Color del fondo (blanco)
          }
        };
        const qrCodeBuffer = await QRCode.toBuffer(qrURL, qrCodeOptions);

        // const qrCodeBuffer = await QRCode.toBuffer(qrDataToEncode, qrCodeOptions);
        console.log("🔗 Generando QR para:", qrURL, "con opciones:", qrCodeOptions);

        const fileName = `qrCodes/cita_${idCitaPosible}.png`;

        const bucket = admin.storage().bucket();
        console.log("📦 Nombre del bucket:", bucket.name);

        const file = bucket.file(fileName);
        console.log("📄 Guardando archivo como:", fileName);

        await file.save(qrCodeBuffer, {
          metadata: { contentType: "image/png" },
        });
        
        await file.makePublic(); 
        
        const publicUrl = file.publicUrl(); 
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

//* [Adoptante] -> GET -> Obtener QR de una cita aceptada
router.get("/citaPosible/:idCitaPosible/qr", verificarTokenFireBase, async (req, res) => {
  const uidAdoptante = req.uid;
  const { idCitaPosible } = req.params;

  if (!uidAdoptante) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  if (!idCitaPosible) {
    res.status(400).json({ error: "Falta el ID de la cita" });
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

    if (citaData?.adoptante_id !== uidAdoptante) {
      res.status(403).json({ error: "No autorizado para ver el QR de esta cita" });
      return;
    }

    if (citaData?.estado !== "aceptada") {
      res.status(400).json({ error: "La cita no está aceptada, no se puede mostrar el QR" });
      return;
    }

    if (!citaData?.qrCodeURL) {
      res.status(404).json({ error: "Código QR no encontrado para esta cita" });
      return;
    }

    res.status(200).json({ qrCodeURL: citaData.qrCodeURL });

  } catch (error: any) {
    console.error("❌ Error al obtener el QR de la cita:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener el QR" });
  }
});

router.post("/citaPosible/completar", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  const { citaId, adoptado } = req.body;

  if (!uidAsociacion) {
    throw new Error("Invalid adoptante ID");
  }

  if (!uidAsociacion || !citaId || typeof adoptado !== 'boolean') {
     res.status(400).json({ error: "Datos inválidos" });
  }
  
  try {
    const citaRef = admin.firestore().collection("citaPosible").doc(citaId);
    const citaDoc = await citaRef.get();
    const uidAdoptante = citaDoc.data()?.adoptante_id;
    
    if (!citaDoc.exists) {
      res.status(404).json({ error: "Cita no encontrada" });
    }

   
    const animalSnap = await admin
      .firestore()
      .collection("citasAnimal")
      .where("citaPosible_id", "==", `citaPosible/${citaId}`)
      .limit(1)
      .get();

    if (animalSnap.empty) {
     res.status(400).json({ error: "No se encontró animal asociado" });
    }

    const animalPath = animalSnap.docs[0].data().animal_id;
    const animalId = animalPath.split("/").pop();
    const animalRef = admin.firestore().doc(animalPath);

    if (adoptado) {
      await animalRef.update({ estadoAdopcion: "adoptado" });

   

      const fechaHoy = new Date();
      await admin.firestore().collection("adoptante").doc(uidAdoptante).update({
        fecha_ultima_adopcion: fechaHoy,
        // Podrías guardar también fecha_bloqueo hasta dentro de 3 meses
        bloqueo_solicitudes_hasta: new Date(fechaHoy.setMonth(fechaHoy.getMonth() + 3))
      });
    } else {
      // ❌ No fue adoptado → vuelve a estado "en adopcion"
      await animalRef.update({ estadoAdopcion: "en adopcion" });

      // Resta 1 en solicitudes activas
      await admin.firestore().collection("adoptante").doc(uidAdoptante).update({
        solicitudes_activas: admin.firestore.FieldValue.increment(-1)
      });
    }
  } catch (error: any) {
    console.error("❌ Error al completar cita:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;