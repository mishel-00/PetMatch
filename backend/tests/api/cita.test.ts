
import request from 'supertest';
import app from '../../src';


jest.mock("firebase-admin", () => {
  const original = jest.requireActual("firebase-admin");
  return {
    ...original,
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: "usuario-test-123", rol: "adoptante" }),
    }),
    firestore: () => ({
      collection: jest.fn().mockImplementation((colName) => {
        return {
          doc: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          get: jest.fn().mockResolvedValue({ 
            empty: true, 
            docs: [] 
          }),
          add: jest.fn().mockResolvedValue({ 
            id: "cita123", 
            path: `${colName}/cita123` 
          }),
          update: jest.fn().mockResolvedValue(true),
        };
      }),
      FieldValue: {
        increment: jest.fn().mockReturnValue(1),
      },
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
        
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeDefined();
    });
  });
  
  
});