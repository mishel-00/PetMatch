"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
/// <reference path="./types/express/index.d.ts" />
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const login_1 = __importDefault(require("./routes/login"));
const registro_1 = __importDefault(require("./routes/registro"));
const animal_1 = __importDefault(require("./routes/animal"));
const horarioDisponible_1 = __importDefault(require("./routes/horarioDisponible"));
const asociacion_1 = __importDefault(require("./routes/asociacion"));
const citaPosible_1 = __importDefault(require("./routes/citaPosible"));
const node_cron_1 = __importDefault(require("node-cron"));
const fnDatosFront_1 = require("./utils/fnDatosFront");
//!! DEBUG
const path_1 = __importDefault(require("path"));
// Cargar variables de entorno
dotenv_1.default.config();
const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//! DEBUG MODE 
app.get('/debug/:path(*)', (_, res) => {
    res.sendFile(path_1.default.join(__dirname, 'debug', _.params.path));
});
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
app.use("/api", login_1.default);
app.use("/api", registro_1.default);
app.use("/api", animal_1.default);
app.use("/api", horarioDisponible_1.default);
app.use("/api", asociacion_1.default);
app.use("/api", citaPosible_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ PetMatch API corriendo en http://localhost:${PORT}`);
});
//* ===============================CRON PROGRAMAR TAREA PARA LIMPIAR HORARIOS PASADOS ===============================
//* Tarea programada para limpiar horarios pasados
//* Cada horario que pase es un día, se limpia sino tiene citaPosible asociada
node_cron_1.default.schedule("0 * * * *", async () => {
    console.log("Ejecutando limpieza automática de horarios pasados...");
    try {
        await (0, fnDatosFront_1.limpiarHorariosPasados)();
        console.log("✅ Limpieza de horarios pasada ejecutada correctamente.");
    }
    catch (error) {
        console.error("❌ Error al ejecutar la limpieza automática:", error);
    }
});
// A las 12.00 AM --> 0 0 * * *
// 1 MINS --> "*/1 * * * *"
// 1 HOUR --> "0 * * * *"
// 1 DAY --> "0 0 * * *"
