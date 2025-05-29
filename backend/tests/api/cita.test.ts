
import request from 'supertest';
import app from '../../src';

type FirestoreDoc = {
  id: string;
  data: () => Record<string, any>;
  ref: { path: string };
};

// Mock mejorado de Firebase Admin
jest.mock("firebase-admin", () => {
  // Datos simulados para diferentes colecciones
  const mockData: Record<string, Record<string, any>> = {
    adoptante: {
      "usuario-test-123": {
        solicitudes_activas: 0
      }
    }
  };

  // Crear una función firestore con FieldValue como propiedad estática
  const firestoreFunc = () => {
    return {
      collection: jest.fn().mockImplementation((colName) => {
        return {
          doc: jest.fn().mockImplementation((id) => {
            const docData = mockData[colName]?.[id] || {};
            return {
              get: jest.fn().mockResolvedValue({
                exists: !!Object.keys(docData).length,
                data: () => ({ ...docData }),
                id: id || "doc123"
              }),
              update: jest.fn().mockResolvedValue(true),
              path: `${colName}/${id || "doc123"}`
            };
          }),
          where: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({ 
            empty: true, 
            docs: [] 
          }),
          add: jest.fn().mockImplementation((data) => {
            return Promise.resolve({ 
              id: "cita123", 
              path: `${colName}/cita123` 
            });
          }),
        };
      }),
      FieldValue: {
        increment: jest.fn().mockImplementation((num) => num),
      },
      doc: jest.fn().mockImplementation((path) => {
        return {
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({}),
            id: path.split('/').pop() || "doc123"
          }),
          update: jest.fn().mockResolvedValue(true)
        };
      })
    };
  };
  
  // Añadir FieldValue como propiedad estática de la función
  firestoreFunc.FieldValue = {
    increment: jest.fn().mockImplementation((num) => num),
  };

  return {
    apps: [],
    initializeApp: jest.fn().mockReturnThis(),
    credential: {
      cert: jest.fn().mockReturnThis(),
    },
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "usuario-test-123" }),
    }),
    firestore: firestoreFunc,
    storage: () => ({
      bucket: jest.fn().mockReturnValue({
        name: "test-bucket",
        file: jest.fn().mockReturnValue({
          save: jest.fn().mockResolvedValue(true),
          makePublic: jest.fn().mockResolvedValue(true),
          publicUrl: jest.fn().mockReturnValue("https://storage.example.com/test-file.png"),
        }),
      }),
    }),
  };
});

describe("API de citaPosible", () => {
  describe("POST /api/citaPosible", () => {
    it("debería rechazar si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/citaPosible")
        .set("Authorization", "Bearer fake-token") 
        .send({}); 
  
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
    
    it("debería crear una cita cuando todos los datos son correctos", async () => {
      const res = await request(app)
        .post("/api/citaPosible")
        .set("Authorization", "Bearer fake-token")
        .send({
          horarioDisponible_id: "horario123",
          hora: "10:00",
          fecha: "2023-12-31",
          asociacion_id: "asociacion123",
          animal_id: "animal123",
          observaciones: "Prueba de cita"
        });
      
      console.log("Respuesta del servidor:", res.body);
        
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeDefined();
    });
  });
});