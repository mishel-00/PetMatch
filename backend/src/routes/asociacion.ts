import express from "express";
import admin from "../firebase"; // (o la ruta correcta a tu firebase.ts)
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";


const router = express.Router();

//! GET -> Obtener todas las asociaciones -> para adoptante
router.get("/asociaciones", verificarTokenFireBase, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection("asociacion")
      .get();

    console.log("🐾 Asociaciones encontradas:", snapshot.docs.length);

    const asociaciones = snapshot.docs.map((doc) => ({
      id: doc.id,
      nombre: doc.data().nombre,
      telefono: doc.data().telefono,
      direccion: doc.data().direccion,
      // ...doc.data(),
    }));

    res.status(200).json(asociaciones);
  } catch (error: any) {
    console.error("❌ Error al obtener asociaciones:", error);
    res.status(500).json({ error: error.message });
  }
});

//! GET -> Mostrar las citas aceptadas por la asociacion
router.get("/citaPosible/aceptadas/asociacion", verificarTokenFireBase, async (req, res) => {
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
    .where("estado", "==", "aceptada")
    .get();

  const citasConInfo = [];

  for (const doc of snapshot.docs) {
    const cita = doc.data();

    
    const adoptanteSnap = await admin
      .firestore()
      .collection("adoptante")
      .doc(cita.adoptante_id)
      .get();

    const nombreAdoptante = adoptanteSnap.exists
      ? adoptanteSnap.data()?.nombre
      : "Desconocido";

    
    const animalRelSnap = await admin
      .firestore()
      .collection("citasAnimal")
      .where("citaPosible_id", "==", doc.ref.path)
      .limit(1)
      .get();

    let nombreDelAnimal = "No asignado";
    let especieAnimal = "Desconocido";
    let animalId = null;

    if (!animalRelSnap.empty) {
      animalId = animalRelSnap.docs[0].data().animal_id; // path tipo 'animal/FD1G...'
      const animalDoc = await admin.firestore().doc(animalId).get();

      if (animalDoc.exists) {
        const animalData = animalDoc.data();
        nombreDelAnimal = animalData?.nombre || "Sin nombre";
        especieAnimal = animalData?.especie || "Desconocida";
      }
    }

    citasConInfo.push({
      id: doc.id,
      fecha: cita.fecha,
      hora: cita.hora,
      adoptante: {
        id: cita.adoptante_id,
        nombre: nombreAdoptante,
      },
      animal: {
        id: animalId,
        nombre: nombreDelAnimal,
        especie: especieAnimal,
      },
    });
  }

  res.status(200).json(citasConInfo);
    
  } catch (error: any) {
    console.error("❌ Error al obtener citas aceptadas:", error);
    res.status(500).json({ error: error.message }); 
  }
});
// //? Get -> Obtener todos los animales de una asociacion
// //Todo ============ Esto puede ser que tenga que cambiar de sitio a adoptante.ts ============
// router.get("/obtenerAnimales/:idAsociacion", verificarTokenFireBase, async (req, res) => {
//   const { idAsociacion } = req.params;

//   try {
//     const snapshot = await admin
//       .firestore()
//       .collection("animal")
//       .where("asociacion_id", "==", idAsociacion)
//       .where("estadoAdopcion", "==", "en adopcion")
//       .get();

//     const animales = snapshot.docs.map((doc) => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         nombre: data.nombre,
//         foto: data.foto,
//         descripcion: data.descripcion,
//         estadoAdopcion: data.estadoAdopcion,
//         especie: data.especie,
//         tipoRaza: data.tipoRaza,
//         sexo: data.sexo,
//         peso: data.peso,
//       };
//     });

//     res.status(200).json(animales);
//   } catch (error: any) {
//     console.error("❌ Error al obtener animales:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
