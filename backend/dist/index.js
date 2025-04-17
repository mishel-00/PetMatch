"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// import adoptanteRoutes from "./routes/adoptante";
const asociacion_1 = __importDefault(require("./routes/asociacion"));
const registro_1 = __importDefault(require("./routes/registro"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
        }),
    });
}
const db = firebase_admin_1.default.firestore();
app.get("/", (_req, res) => {
    res.send("PetMatch Backend funcionando 🐾");
});
//Montar rutas de API necesarias 
// app.use("/api/adopatante", adoptanteRoutes); 
app.use("/api", asociacion_1.default);
app.use("/api", registro_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
