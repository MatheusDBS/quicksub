const pool = require('../config/db');

const Assinatura = {
  create: async ({ cliente_id, servico_id, data_inicio, data_fim, status, user_id }) => {
    const [result] = await pool.query(
      'INSERT INTO assinaturas (cliente_id, servico_id, data_inicio, data_fim, status, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [cliente_id, servico_id, data_inicio, data_fim, status, user_id]
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
  update: async (id, cliente_id, servico_id, data_inicio, data_fim, status) => {
    await pool.query(
      'UPDATE assinaturas SET cliente_id = ?, servico_id = ?, data_inicio = ?, data_fim = ?, status = ? WHERE id = ?',
      [cliente_id, servico_id, data_inicio, data_fim, status, id]
    );
  },
  delete: async (id) => {
    await pool.query('DELETE FROM assinaturas WHERE id = ?', [id]);
  }
};

module.exports = Assinatura;
