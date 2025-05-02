import express from "express";
import admin from "../firebase";
import { ESTADOS_ADOPCION } from "../utils/enums";
import { verificarTokenFireBase } from "../middleware/verficarTokenFireBase";

const router = express.Router();
//! Ruta general sin filtros aplicados
router.get ("/animal", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  
  try {
    const snapshot = await admin
    .firestore()
    .collection("animal")
    .where("asociacion_id", "==", uidAsociacion)
    .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(), 
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});
//! GET -> Obtener un animal por su ID
router.get("/animal/:id", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { id } = req.params;

  try {
    const docRef = admin.firestore().collection("animal").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Animal no encontrado" });
      return;
    }

    const data = doc.data();

    // Aseguramos que el animal pertenece a la asociación autenticada
    if (data?.asociacion_id !== uidAsociacion) {
      res.status(403).json({ error: "No autorizado para ver este animal" });
    }

    res.status(200).json({ id: doc.id, ...data });
  } catch (error: any) {
    console.error("❌ Error al obtener animal por ID:", error);
    res.status(500).json({ error: error.message }); 
  }
});

//! PUT -> Actualizar un animal por su ID
router.put("/animal/:id", verificarTokenFireBase, async (req, res): Promise<void> => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { id } = req.params;
  const dataActualizada = req.body;

  try {
    const docRef = admin.firestore().collection("animal").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Animal no encontrado" });
      return;
    }

    const dataOriginal = doc.data();

    if (dataOriginal?.asociacion_id !== uidAsociacion) {
      res.status(403).json({ error: "No autorizado para editar este animal" });
      return;
    }
    //* Solo modifica los campos que se han enviado y los demás se mantienen iguales
    await docRef.update(dataActualizada);

    res.status(200).json({ message: `Animal con ID ${id} actualizado correctamente` });
  } catch (error: any) {
    console.error("❌ Error al actualizar animal:", error);
    res.status(500).json({ error: error.message });
  }
});

//! DELETE -> Eliminar un animal por su ID
router.delete("/animal/:id", verificarTokenFireBase, async (req, res): Promise<void> => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { id } = req.params;

  try {
    const docRef = admin.firestore().collection("animal").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: "Animal no encontrado" });
      return;
    }

    const data = doc.data();

    if (data?.asociacion_id !== uidAsociacion) {
      res.status(403).json({ error: "No autorizado para eliminar este animal" });
      return;
    }

    await docRef.delete();
    res.status(200).json({ message: `Animal con ID ${id} eliminado correctamente` });
  } catch (error: any) {
    console.error("❌ Error al eliminar animal:", error);
    res.status(500).json({ error: error.message });
  }
});

//! GET -> Filtrar por estado de adopcion
router.get("/animal/estado", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { estado } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("estadoAdopcion", "==", estado)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! GET -> Filtrar por especie
router.get("/animal/especie", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { especie } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("especie", "==", especie)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//! GET -> Filtrar por tipo de raza
router.get("/animal/tipoRaza", verificarTokenFireBase, async (req, res) => {
  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { tipoRaza } = req.query;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", uidAsociacion)
      .where("tipoRaza", "==", tipoRaza)
      .get();
    console.log("🐾 Animales encontrados:", snapshot.docs.length);
    const animales = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});


router.post("/animal", verificarTokenFireBase, async (req, res) => {

  console.log("Peticion [POST] llega al backend /api/animal");

  const uidAsociacion = req.uid;
  if (!uidAsociacion) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }

  const { 
    foto, 
    nombre, 
    descripcion, 
    estadoAdopcion, 
    esterilizado, 
    especie, 
    tipoRaza, 
    peso, 
    fecha_nacimiento, 
    fecha_ingreso, 
   } = req.body;

  if ( !foto || !nombre || !descripcion || !estadoAdopcion || typeof esterilizado !== "boolean" || !especie || !tipoRaza || ! peso || !fecha_nacimiento || !fecha_ingreso ) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  const estadoType = ESTADOS_ADOPCION.includes(estadoAdopcion) ? estadoAdopcion : "En adopcion";

  try {
    const animalData = await admin.firestore().collection("animal").add({
      foto,
      nombre,
      descripcion,
      estadoAdopcion: estadoType,
      esterilizado,
      especie,
      tipoRaza,
      peso,
      fecha_nacimiento,
      fecha_ingreso,
      asociacion_id: uidAsociacion,
    });

    res.status(201).json({ uid: animalData.id, nombre });
  } catch (error: any) {
    console.error("❌ Error al registrar animal:", error);
    res.status(500).json({ error: error.message });
    return;
  }
});

//Prueba
//? Get -> Obtener todos los animales de una asociacion
//Todo ============ Esto puede ser que tenga que cambiar de sitio a adoptante.ts ============
router.get("/obtenerAnimales/:idAsociacion", verificarTokenFireBase, async (req, res) => {
  const { idAsociacion } = req.params;

  try {
    const snapshot = await admin
      .firestore()
      .collection("animal")
      .where("asociacion_id", "==", idAsociacion)
      .where("estadoAdopcion", "==", "en adopcion")
      .get();

    const animales = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        foto: data.foto,
        descripcion: data.descripcion,
        estadoAdopcion: data.estadoAdopcion,
        especie: data.especie,
        tipoRaza: data.tipoRaza,
        sexo: data.sexo,
        peso: data.peso,
      };
    });

    res.status(200).json(animales);
  } catch (error: any) {
    console.error("❌ Error al obtener animales:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;