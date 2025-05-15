import express from "express";
import admin from "../firebase";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";

//TODO: Y luego PUT ver si le permitidos editar 
//TODO: o no el horario si tiene una cita asociada. 

const router = express.Router();
//! Ruta general para obtener todos los horarios disponibles
//? ====================== PRUEBA ======================
router.get("/horarioDisponible", verificarTokenFireBase, async (req, res) => {
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

    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    const horariosDisponibles: any[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const idHorario = doc.id;

      const fechaDoc = new Date(data.fecha); 
      fechaDoc.setHours(0, 0, 0, 0);

      
      if (fechaDoc < fechaHoy) continue;

      const todasLasHoras = data.horas || [];

      
      const citasSnapshot = await admin.firestore()
        .collection("citaPosible")
        .where("id_HorarioDisponible", "==", idHorario)
        .where("estado", "in", ["pendiente", "aceptada"])
        .get();

      
      const horasOcupadas = citasSnapshot.docs.map((cita) => cita.data().hora);
      const horasLibres = todasLasHoras.filter((h: string) => !horasOcupadas.includes(h));

      if (horasLibres.length > 0) {
        horariosDisponibles.push({
          id: doc.id,
          fecha: data.fecha,
          horas: horasLibres,
        });
      } else {
        console.log(`Día ${data.fecha} tiene todas las horas ocupadas`);
      }
    }

    res.status(200).json(horariosDisponibles);
  } catch (error: any) {
    console.error("❌ Error al obtener horarios filtrados:", error);
    res.status(500).json({ error: error.message });
  }
});

// router.get("/horarioDisponible", verificarTokenFireBase, async (req, res) => {
//     const uidAsociacion = req.uid;
//     if (!uidAsociacion) {
//       res.status(401).json({ error: "Token inválido" });
//       return;
//     }
  
//     try {
//       const snapshot = await admin
//         .firestore()
//         .collection("horarioDisponible")
//         .where("asociacion_id", "==", uidAsociacion)
//         .get();
  
//       console.log("🐾 Horarios encontrados:", snapshot.docs.length);
  
//       const horariosDisponibles: any[] = [];
  
//       const fechaHoy = new Date();
//       fechaHoy.setHours(0, 0, 0, 0);
  
//       for (const doc of snapshot.docs) {
//         const data = doc.data();
//         const idHorario = doc.id;
  
//         const fechaHorario = data.fecha.toDate ? data.fecha.toDate() : new Date(data.fecha); 
  
//         if (fechaHorario >= fechaHoy) {
//           const citasAsociadas = await admin.firestore()
//             .collection("citaPosible")
//             .where("id_HorarioDisponible", "==", idHorario)
//             .get();
  
//           // Comprobar que no haya citas asociadas
//           if (citasAsociadas.empty) {
//             horariosDisponibles.push({
//               id: doc.id,
//               ...data,
//             });
//           } else {
//             console.log(`📌 Horario ${idHorario} tiene cita, no se muestra`);
//           }
//         } else {
//           console.log(`📌 Horario ${idHorario} es de fecha pasada, no se muestra`);
//         }
//       }
  
//       res.status(200).json(horariosDisponibles);
//     } catch (error: any) {
//       console.error("❌ Error al obtener horarios disponibles:", error);
//       res.status(500).json({ error: error.message });
//       return;
//     }
//   });
  
  
//! Post Crear un nuevo horario disponible 
router.post("/horarioDisponible", verificarTokenFireBase, async (req, res) => {
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
  const fechaObj = new Date(fecha);

  const fechaSoloDia = new Date(fechaObj);
  fechaSoloDia.setHours(0, 0, 0, 0);

  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0);

  const limiteMaximo = new Date();
  limiteMaximo.setDate(ahora.getDate() + 6); // 6 días de antelación

  if (fechaSoloDia.getTime() < ahora.getTime()) {
    res.status(400).json({ error: "No se puede crear un horario en una fecha pasada" });
    return;
  }

  if (fechaObj > limiteMaximo) {
    res.status(400).json({ error: "El horario no puede ser con más de 6 días de antelación" });
    return;
  }

  const esHoy = fechaSoloDia.getTime() === ahora.getTime();
  if (esHoy) {
    const [h, m] = hora.split(":").map(Number);
    const horaProgramada = new Date();
    horaProgramada.setHours(h, m, 0, 0);
    if (horaProgramada < ahora) {
      res.status(400).json({ error: "No se puede crear un horario en una hora pasada" });
      return;
    }
  }

 
  const fechaStr = fechaObj.toISOString().split("T")[0];

  
  const snapshot = await admin.firestore()
    .collection("horarioDisponible")
    .where("fecha", "==", fechaStr)
    .where("asociacion_id", "==", uidAsociacion)
    .get();

  if (!snapshot.empty) {
    // Existe → actualizamos
    const docRef = snapshot.docs[0].ref;
    const data = snapshot.docs[0].data();
    const horasActuales = data.horas || [];

    if (horasActuales.includes(hora)) {
      res.status(400).json({ error: "Esa hora ya está registrada para ese día" });
      return;
    }

    await docRef.update({
      horas: admin.firestore.FieldValue.arrayUnion(hora),
    });

    res.status(200).json({ message: "Hora añadida correctamente al día existente" });
  } else {
    // No existe → creamos documento nuevo
    const nuevo = await admin.firestore()
      .collection("horarioDisponible")
      .add({
        fecha: fechaStr,
        horas: [hora],
        asociacion_id: uidAsociacion,
      });

    res.status(201).json({ id: nuevo.id, fecha: fechaStr, horas: [hora] });
  }

} catch (error: any) {
  console.error("❌ Error al crear horario:", error);
  res.status(500).json({ error: error.message });
}
});
    // router.post("/horarioDisponible", verificarTokenFireBase, async (req, res): Promise<void> => {
    //     const uidAsociacion = req.uid;
    //     if (!uidAsociacion) {
    //       res.status(401).json({ error: "Token inválido" });
    //       return;
    //     }
      
    //     const { fecha, hora } = req.body;
      
    //     if (!fecha || !hora) {
    //       res.status(400).json({ error: "Fecha y hora son obligatorias" });
    //       return;
    //     }
      
    //     try {
    //         const fechaHorario = new Date(fecha);
    //         const ahora = new Date();
    //         const limiteMaximo = new Date();
    //         limiteMaximo.setDate(ahora.getDate() + 6);
            
            
    //         const esFechaPasada = fechaHorario.toDateString() < ahora.toDateString();
    //         if (esFechaPasada) {
    //           res.status(400).json({ error: "No se puede crear un horario en una fecha pasada" });
    //           return;
    //         }
            
            
    //         if (fechaHorario > limiteMaximo) {
    //           res.status(400).json({ error: "El horario no puede ser con más de 6 días de antelación" });
    //           return;
    //         }
            

    //         const esHoy = fechaHorario.toDateString() === ahora.toDateString();
    //         if (esHoy) {
    //           const [horaSeleccionada, minutoSeleccionado] = hora.split(":").map(Number);
    //           const horaProgramada = new Date();
    //           horaProgramada.setHours(horaSeleccionada, minutoSeleccionado, 0, 0);
            
    //           if (horaProgramada < ahora) {
    //             res.status(400).json({ error: "No se puede crear un horario en una hora pasada" });
    //             return;
    //           }
    //         }
          
    //       //* Comprobar si el horario ya existe
    //       const horarioExistente = await admin.firestore()
    //         .collection("horarioDisponible")
    //         .where("fecha", "==", fecha)
    //         .where("hora", "==", hora)
    //         .where("asociacion_id", "==", uidAsociacion)
    //         .get();
      
    //       if (!horarioExistente.empty) {
    //         res.status(400).json({ error: "El horario ya existe" });
    //         return;
    //       }
      
    //       const horarioData = {
    //         fecha,
    //         hora,
    //         asociacion_id: uidAsociacion,
    //       };
      
    //       const nuevoHorario = await admin.firestore()
    //         .collection("horarioDisponible")
    //         .add(horarioData);
      
    //       res.status(201).json({ id: nuevoHorario.id, fecha, hora });
    //     } catch (error: any) {
    //       console.error("❌ Error al crear horario:", error);
    //       res.status(500).json({ error: error.message });
    //     }
    //   });
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

   //? [Adoptante] -> GET -> Obtener todos los hoarios disponibles de una asociacion
  router.get("/horarioDisponible/asociacion/:idAsociacion", verificarTokenFireBase, async (req, res) => {
  const { idAsociacion } = req.params;

    try {
      const snapshot = await admin
        .firestore()
        .collection("horarioDisponible")
        .where("asociacion_id", "==", idAsociacion)
        .get();

      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);

      const horariosDisponibles: any[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const idHorario = doc.id;

        const fechaDoc = new Date(data.fecha); 
        fechaDoc.setHours(0, 0, 0, 0);

        
        if (fechaDoc < fechaHoy) continue;

        const todasLasHoras = data.horas || [];

        
        const citasSnapshot = await admin.firestore()
          .collection("citaPosible")
          .where("id_HorarioDisponible", "==", idHorario)
          .get();

        
        const horasOcupadas = citasSnapshot.docs.map((cita) => cita.data().hora);
        const horasLibres = todasLasHoras.filter((h: string) => !horasOcupadas.includes(h));

        if (horasLibres.length > 0) {
          horariosDisponibles.push({
            id: doc.id,
            fecha: data.fecha,
            horas: horasLibres,
          });
        } else {
          console.log(`📌 Día ${data.fecha} tiene todas las horas ocupadas`);
        }
      }
      // Ordenar por fecha ascendente
      horariosDisponibles.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA.getTime() - dateB.getTime();
    });

    const tresDias = horariosDisponibles.slice(0, 3);

      res.status(200).json(tresDias);
    } catch (error: any) {
      console.error("❌ Error al obtener horarios filtrados:", error);
      res.status(500).json({ error: error.message });
    }
  }); 
  export default router;