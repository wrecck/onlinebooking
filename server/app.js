'use strict';

const path = require('path');
const express = require('express');
const { createDb, OPENING_HOUR, CLOSING_HOUR } = require('./db');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pad(n) {
  return String(n).padStart(2, '0');
}

// Generate every candidate start time between opening and closing hours,
// stepping by the service duration.
function generateSlots(durationMinutes) {
  const slots = [];
  const start = OPENING_HOUR * 60;
  const end = CLOSING_HOUR * 60;
  for (let t = start; t + durationMinutes <= end; t += durationMinutes) {
    slots.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return slots;
}

function createApp(dbFile) {
  const db = createDb(dbFile);
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/services', (_req, res) => {
    const services = db.prepare('SELECT * FROM services ORDER BY name').all();
    res.json(services);
  });

  app.get('/api/services/:id/slots', (req, res) => {
    const service = db
      .prepare('SELECT * FROM services WHERE id = ?')
      .get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const { date } = req.query;
    if (!date || !DATE_RE.test(date)) {
      return res
        .status(400)
        .json({ error: 'A valid date query parameter (YYYY-MM-DD) is required' });
    }

    const taken = new Set(
      db
        .prepare(
          `SELECT time FROM bookings
           WHERE service_id = ? AND date = ? AND status = 'confirmed'`
        )
        .all(service.id, date)
        .map((row) => row.time)
    );

    const slots = generateSlots(service.duration_minutes).map((time) => ({
      time,
      available: !taken.has(time),
    }));

    res.json({ serviceId: service.id, date, slots });
  });

  app.get('/api/bookings', (_req, res) => {
    const bookings = db
      .prepare(
        `SELECT b.*, s.name AS service_name, s.price_cents
         FROM bookings b
         JOIN services s ON s.id = b.service_id
         ORDER BY b.date, b.time`
      )
      .all();
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { serviceId, customerName, customerEmail, date, time } = req.body || {};

    if (!serviceId || !customerName || !customerEmail || !date || !time) {
      return res.status(400).json({
        error:
          'serviceId, customerName, customerEmail, date and time are all required',
      });
    }
    if (!DATE_RE.test(date)) {
      return res.status(400).json({ error: 'date must be formatted YYYY-MM-DD' });
    }
    if (!EMAIL_RE.test(customerEmail)) {
      return res.status(400).json({ error: 'customerEmail must be a valid email' });
    }

    const service = db
      .prepare('SELECT * FROM services WHERE id = ?')
      .get(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const validSlot = generateSlots(service.duration_minutes).includes(time);
    if (!validSlot) {
      return res
        .status(400)
        .json({ error: 'time is not a valid slot for this service' });
    }

    try {
      const info = db
        .prepare(
          `INSERT INTO bookings (service_id, customer_name, customer_email, date, time)
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(service.id, customerName, customerEmail, date, time);
      const booking = db
        .prepare(
          `SELECT b.*, s.name AS service_name, s.price_cents
           FROM bookings b JOIN services s ON s.id = b.service_id
           WHERE b.id = ?`
        )
        .get(info.lastInsertRowid);
      res.status(201).json(booking);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res
          .status(409)
          .json({ error: 'That time slot has already been booked' });
      }
      throw err;
    }
  });

  app.delete('/api/bookings/:id', (req, res) => {
    const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).end();
  });

  app.locals.db = db;
  return app;
}

module.exports = { createApp, generateSlots };
