const pool = require('../config/db');

const Assinatura = {
  create: async ({ servico_id, data_inicio, data_fim, status, user_id }) => {
    const [result] = await pool.query(
      'INSERT INTO assinaturas (servico_id, data_inicio, data_fim, status, user_id) VALUES (?, ?, ?, ?, ?)',
      [servico_id, data_inicio, data_fim, status, user_id]
    );
    return result.insertId;
  },
  // findAll: async () => {
  //   const [rows] = await pool.query('SELECT * FROM assinaturas');
  //   return rows;
  // },
  findAllByUser: async (user_id) => {
    const [rows] = await pool.query('SELECT * FROM assinaturas WHERE user_id = ?', [user_id]);
    return rows;
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM assinaturas WHERE id = ?', [id]);
    return rows[0];
  },
  update: async (id, servico_id, data_inicio, data_fim, status) => {
    await pool.query(
      'UPDATE assinaturas SET servico_id = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id = ?',
      [servico_id, data_inicio, data_fim, status, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM assinaturas WHERE id = ?', [id]);
  },
  deleteByServicoId: async (servicoId) => {
    await pool.query('DELETE FROM assinaturas WHERE servico_id = ?', [servicoId]);
  }
};

module.exports = Assinatura;
