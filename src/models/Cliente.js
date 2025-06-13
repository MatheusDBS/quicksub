const pool = require('../config/db');
const Assinatura = require('../models/Assinatura');

const Cliente = {
  create: async (nome, email) => {
    const [result] = await pool.query('INSERT INTO clientes (nome, email) VALUES (?, ?)', [nome, email]);
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM clientes');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  },
  update: async (id, nome, email) => {
    await pool.query('UPDATE clientes SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
  },
  delete: async (id) => {
    // Exclui assinaturas relacionadas ao cliente
    await Assinatura.deleteByClienteId(id);
    await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
  }
};

module.exports = Cliente;
