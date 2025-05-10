"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Esto es la conexión con firebase cloud -- mi base de datos 
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        storageBucket: "pet-match-cloud.appspot.com",
    });
}
exports.db = firebase_admin_1.default.firestore();
exports.default = firebase_admin_1.default;
