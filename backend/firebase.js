 // Esto es la conexión con firebase cloud -- mi base de datos 
 const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk.json"); // Asegúrate de que este archivo exista

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
