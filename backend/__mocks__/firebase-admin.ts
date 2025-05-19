// para que se ejecute primero
const mockFirestore = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ empty: true, docs: [] }),
    add: jest.fn().mockResolvedValue({ id: 'mock-cita', path: 'citas/mock-cita' }),
    update: jest.fn().mockResolvedValue(true),
  };
  
  export default {
    initializeApp: jest.fn(),
    apps: [],
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'usuario-test-123',
        rol: 'adoptante',
      }),
    }),
    firestore: () => mockFirestore,
    credential: {
      cert: jest.fn(),
    },
  };
  