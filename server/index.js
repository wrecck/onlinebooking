'use strict';

const path = require('path');
const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'booking.db');

const app = createApp(DB_FILE);

app.listen(PORT, () => {
  console.log(`Online booking server listening on http://localhost:${PORT}`);
});
