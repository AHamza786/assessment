const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../app');

describe('Items routes', () => {
  test('GET /api/items returns items array and total header', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const totalHeader = res.headers['x-total-count'];
    if (totalHeader) {
      expect(Number.isNaN(parseInt(totalHeader, 10))).toBe(false);
      expect(res.body.length).toBeLessThanOrEqual(parseInt(totalHeader, 10));
    }
  });

  test('GET /api/items supports search via q', async () => {
    const res = await request(app).get('/api/items?q=laptop');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    const names = res.body.map(i => i.name.toLowerCase());
    expect(names.some(n => n.includes('laptop'))).toBe(true);
  });

  test('GET /api/items supports pagination', async () => {
    const res = await request(app).get('/api/items?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(2);
    const totalHeader = res.headers['x-total-count'];
    expect(totalHeader).toBeDefined();
  });

  test('GET /api/items/:id returns item by id', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  test('GET /api/items/:id returns 404 for missing item', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.status).toBe(404);
  });

  test('POST /api/items returns 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ category: 'Test', price: 123 });
    expect(res.status).toBe(400);
  });
});


