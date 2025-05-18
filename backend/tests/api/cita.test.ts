import request from "supertest";
import app from "../../src/app"; // este debe ser tu archivo que monta Express

jest.mock("firebase-admin", () => {
    const original = jest.requireActual("firebase-admin");
    return {
      ...original,
      firestore: () => ({
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
        add: jest.fn().mockResolvedValue({ id: "cita123", path: "citaPosible/cita123" }),
        update: jest.fn().mockResolvedValue(true),
      }),
    };
  });
  
  describe("POST /citaPosible", () => {
    it("debería rechazar si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/citaPosible")
        .set("Authorization", "Bearer fake-token") 
        .send({}); // falta todo
  
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });