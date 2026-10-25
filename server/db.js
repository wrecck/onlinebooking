'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const SEED_SERVICES = [
  {
    name: 'Haircut & Styling',
    description: 'A classic cut finished with a wash and style.',
    duration_minutes: 30,
    price_cents: 4500,
  },
  {
    name: 'Dental Check-up',
    description: 'Routine examination and cleaning with a hygienist.',
    duration_minutes: 60,
    price_cents: 9000,
  },
  {
    name: 'Personal Training',
    description: 'One-on-one session tailored to your fitness goals.',
    duration_minutes: 45,
    price_cents: 6000,
  },
  {
    name: 'Massage Therapy',
    description: 'Relaxing full-body massage to relieve tension.',
    duration_minutes: 60,
    price_cents: 8000,
  },
];

// Business hours used to generate bookable slots (24h clock).
const OPENING_HOUR = 9;
const CLOSING_HOUR = 17;

function createDb(filename = ':memory:') {
  if (filename !== ':memory:') {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
  }

  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      duration_minutes INTEGER NOT NULL,
      price_cents INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (service_id, date, time)
    );
  `);

  const count = db.prepare('SELECT COUNT(*) AS n FROM services').get().n;
  if (count === 0) {
    const insert = db.prepare(
      `INSERT INTO services (name, description, duration_minutes, price_cents)
       VALUES (@name, @description, @duration_minutes, @price_cents)`
    );
    const seed = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    seed(SEED_SERVICES);
  }

  return db;
}

module.exports = { createDb, OPENING_HOUR, CLOSING_HOUR };
