'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../server/app');

// Each app instance uses its own in-memory database.
function freshApp() {
  return createApp(':memory:');
}

test('health check responds ok', async () => {
  const res = await request(freshApp()).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('seeds and lists services', async () => {
  const res = await request(freshApp()).get('/api/services');
  assert.equal(res.status, 200);
  assert.ok(res.body.length >= 4);
  assert.ok(res.body.every((s) => s.name && s.duration_minutes > 0));
});

test('returns slots for a service and date', async () => {
  const app = freshApp();
  const services = (await request(app).get('/api/services')).body;
  const res = await request(app)
    .get(`/api/services/${services[0].id}/slots`)
    .query({ date: '2999-01-01' });
  assert.equal(res.status, 200);
  assert.ok(res.body.slots.length > 0);
  assert.ok(res.body.slots.every((s) => s.available === true));
});

test('rejects slot lookup without a valid date', async () => {
  const app = freshApp();
  const services = (await request(app).get('/api/services')).body;
  const res = await request(app).get(`/api/services/${services[0].id}/slots`);
  assert.equal(res.status, 400);
});

test('creates a booking and marks the slot unavailable', async () => {
  const app = freshApp();
  const services = (await request(app).get('/api/services')).body;
  const service = services[0];

  const create = await request(app)
    .post('/api/bookings')
    .send({
      serviceId: service.id,
      customerName: 'Ada Lovelace',
      customerEmail: 'ada@example.com',
      date: '2999-01-01',
      time: '09:00',
    });
  assert.equal(create.status, 201);
  assert.equal(create.body.service_name, service.name);

  const slots = (
    await request(app)
      .get(`/api/services/${service.id}/slots`)
      .query({ date: '2999-01-01' })
  ).body.slots;
  const nine = slots.find((s) => s.time === '09:00');
  assert.equal(nine.available, false);
});

test('prevents double-booking the same slot', async () => {
  const app = freshApp();
  const service = (await request(app).get('/api/services')).body[0];
  const payload = {
    serviceId: service.id,
    customerName: 'Grace Hopper',
    customerEmail: 'grace@example.com',
    date: '2999-02-02',
    time: '10:00',
  };
  await request(app).post('/api/bookings').send(payload);
  const dup = await request(app).post('/api/bookings').send(payload);
  assert.equal(dup.status, 409);
});

test('validates booking input', async () => {
  const app = freshApp();
  const service = (await request(app).get('/api/services')).body[0];
  const res = await request(app)
    .post('/api/bookings')
    .send({ serviceId: service.id, customerName: 'X', date: '2999-01-01', time: '09:00' });
  assert.equal(res.status, 400);

  const badEmail = await request(app).post('/api/bookings').send({
    serviceId: service.id,
    customerName: 'X',
    customerEmail: 'not-an-email',
    date: '2999-01-01',
    time: '09:00',
  });
  assert.equal(badEmail.status, 400);
});

test('cancels a booking and frees the slot', async () => {
  const app = freshApp();
  const service = (await request(app).get('/api/services')).body[0];
  const created = (
    await request(app).post('/api/bookings').send({
      serviceId: service.id,
      customerName: 'Alan Turing',
      customerEmail: 'alan@example.com',
      date: '2999-03-03',
      time: '11:00',
    })
  ).body;

  const del = await request(app).delete(`/api/bookings/${created.id}`);
  assert.equal(del.status, 204);

  const missing = await request(app).delete(`/api/bookings/${created.id}`);
  assert.equal(missing.status, 404);
});
