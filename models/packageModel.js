// models/packageModel.js
const db = require('../config/db');

const Package = {
  getAll:    cb => db.query('SELECT * FROM packages', cb),
  create:   (data, cb) => db.query('INSERT INTO packages SET ?', data, cb),
  update:   (id, data, cb) => db.query('UPDATE packages SET ? WHERE id = ?', [data, id], cb),
  delete:   (id, cb) => db.query('DELETE FROM packages WHERE id = ?', [id], cb),
};

module.exports = Package;
