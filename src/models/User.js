const pool = require('../config/db');

const User = {
  create: async (username, email, passwordHash) => {
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, passwordHash]);
    return result.insertId;
  },
  findByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  },
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  updateUsername: async (id, username) => {
    await pool.query('UPDATE users SET username = ? WHERE id = ?', [username, id]);
  },
  updateEmail: async (id, email) => {
    await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, id]);
  },
  updatePassword: async (id, password) => {
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
  }
};

module.exports = User;
