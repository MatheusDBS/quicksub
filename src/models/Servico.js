const pool = require('../config/db');

const Servico = {
  create: async (nome, descricao, preco) => {
    const [result] = await pool.query('INSERT INTO servicos (nome, descricao, preco) VALUES (?, ?, ?)', [nome, descricao, preco]);
    return result.insertId;
  },
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM servicos');
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM servicos WHERE id = ?', [id]);
    return rows[0];
  },
  update: async (id, nome, descricao, preco) => {
    await pool.query('UPDATE servicos SET nome = ?, descricao = ?, preco = ? WHERE id = ?', [nome, descricao, preco, id]);
  },
  delete: async (id) => {
    await pool.query('DELETE FROM servicos WHERE id = ?', [id]);
  }
};

module.exports = Servico;
