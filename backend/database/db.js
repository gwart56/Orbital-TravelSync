// old local database connection
// This file is used to connect to the PostgreSQL database using the pg library.

require('dotenv').config({ path: __dirname + '/.env' });

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Connecting to DB with:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "******", // Don't log the password for security
  port: process.env.DB_PORT,
});


module.exports = pool;