
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "Bghyu23!",
  port: process.env.DB_PORT,
});

console.log('DB_PASSWORD FUCKKKKKKKKKK:', pool.options.password);

module.exports = pool;