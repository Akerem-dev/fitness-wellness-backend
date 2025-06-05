// backend_ready/config/db.js
require("dotenv").config();
const mysql = require("mysql2/promise"); // Promise tabanlı mysql2

let connection = null;

/**
 * initMySQL(): Eğer bağlantı yoksa yeni MySQL bağlantısı açar.
 *               Mevcut bağlantı varsa, aynı bağlantıyı return eder.
 */
async function initMySQL() {
  if (connection) return connection;

  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  console.log("✅ MySQL bağlantısı başarılı");
  return connection;
}

module.exports = { initMySQL };
