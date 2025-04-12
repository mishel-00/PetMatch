// Este archivo levanta el backend y crea las primeras rutas
const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PetMatch Backend funcionando 🐾");
});

// Ejemplo: Obtener lista de animales desde Firebase
app.get("/api/animals", async (req, res) => {
  try {
    const snapshot = await db.collection("animals").get();
    const animales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(animales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener animales" });
  }
});

// Ejemplo: Crear nuevo animal
app.post("/api/animals", async (req, res) => {
  try {
    const data = req.body;
    const nuevo = await db.collection("animals").add(data);
    res.status(201).json({ id: nuevo.id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear animal" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
