"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Esto es la conexión con firebase cloud -- mi base de datos 
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Asegurarse de que la clave privada tenga el formato correcto
const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
// Verificar que todas las propiedades requeridas estén presentes
if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    console.error("❌ Error: Faltan credenciales de Firebase. Verifica tus variables de entorno.");
    console.error("projectId:", serviceAccount.projectId ? "✓" : "✗");
    console.error("privateKey:", serviceAccount.privateKey ? "✓" : "✗");
    console.error("clientEmail:", serviceAccount.clientEmail ? "✓" : "✗");
}
if (!firebase_admin_1.default.apps.length) {
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(serviceAccount),
            projectId: "pet-match-cloud",
            storageBucket: "pet-match-cloud.firebasestorage.app",
        });
        console.log("✅ Firebase inicializado correctamente con bucket de almacenamiento");
    }
    catch (error) {
        console.error("❌ Error al inicializar Firebase:", error);
    }
}
exports.db = firebase_admin_1.default.firestore();
exports.default = firebase_admin_1.default;
