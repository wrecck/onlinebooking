# onlinebooking

A small full-stack **online booking** application: browse services, pick an
available time slot, and confirm a reservation. Built with Express and SQLite
with a lightweight vanilla-JS frontend.

## Stack

- **Backend:** Node.js 22 + Express
- **Database:** SQLite (via `better-sqlite3`), auto-created and seeded on first run
- **Frontend:** Static HTML/CSS/JS served by Express from `public/`
- **Tests:** Node's built-in test runner + `supertest`

## Getting started

```bash
npm install     # install dependencies
npm start       # start the server on http://localhost:3000
npm test        # run the API test suite
```

Environment variables:

| Variable  | Default              | Description                        |
| --------- | -------------------- | ---------------------------------- |
| `PORT`    | `3000`               | Port the HTTP server listens on    |
| `DB_FILE` | `data/booking.db`    | SQLite database file location      |

## API

| Method   | Path                          | Description                                   |
| -------- | ----------------------------- | --------------------------------------------- |
| `GET`    | `/api/health`                 | Health check                                  |
| `GET`    | `/api/services`               | List bookable services                        |
| `GET`    | `/api/services/:id/slots`     | Available time slots for a service on a `date` |
| `GET`    | `/api/bookings`               | List all bookings                             |
| `POST`   | `/api/bookings`               | Create a booking                              |
| `DELETE` | `/api/bookings/:id`           | Cancel a booking                              |

## Project layout

```
server/     Express app, routes and SQLite setup
public/     Frontend (HTML/CSS/JS)
test/       API tests
```
