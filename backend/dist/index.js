"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
//? Prueba se ha cambiado
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// ✅ Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Inicializar Firebase con variables de entorno
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Importante: usa comillas dobles en .env y sólo reemplaza los \n por saltos reales
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
        }),
    });
}
const db = firebase_admin_1.default.firestore();
app.get("/", (_req, res) => {
    res.send("PetMatch Backend funcionando 🐾");
});
// ✅ Ruta para obtener animales
app.get("/api/animales", async (_req, res) => {
    try {
        const snapshot = await db.collection("animales").get();
        const animales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(animales);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener animales" });
    }
});
// ✅ Verificar token de Firebase Auth
const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado o mal formado" });
    }
    const token = authHeader.split("Bearer ")[1];
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        // Recuperar datos del usuario desde Firestore (colección "adoptantes")
        const userDoc = await firebase_admin_1.default.firestore().collection("adoptantes").doc(uid).get();
        const userData = userDoc.data();
        if (!userData) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        return res.status(200).json({ uid, ...userData });
    }
    catch (error) {
        console.error("Error al verificar token:", error);
        return res.status(401).json({ error: "Token inválido" });
    }
};
// Luego usar la función en la ruta
app.post("/api/verify", verifyToken);
// ✅ Crear animal
app.post("/api/animales", async (req, res) => {
    try {
        const data = req.body;
        const nuevo = await db.collection("animales").add(data);
        res.status(201).json({ id: nuevo.id });
    }
    catch (error) {
        res.status(500).json({ error: "Error al crear animal" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
