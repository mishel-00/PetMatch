
import request from 'supertest';

import { describe, it } from 'node:test';

describe('POST /citaPosible', () => {
  it('debería rechazar si faltan datos', async () => {
    const res = await request(app).post('/citaPosible').send({});
    expect(res.statusCode).toBe(400); 
  });
});
