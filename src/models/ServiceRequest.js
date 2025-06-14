// src/models/ServiceRequest.js
const pool = require('../config/db');

const ServiceRequest = {
  async create({ user_id, nome_servico, descricao }) {
    const [result] = await pool.query(
      'INSERT INTO service_requests (user_id, nome_servico, descricao) VALUES (?, ?, ?)',
      [user_id, nome_servico, descricao]
    );
    return { id: result.insertId, user_id, nome_servico, descricao, status: 'pendente' };
  },
  async findAll() {
    const [rows] = await pool.query(
      `SELECT sr.*, u.username, u.email FROM service_requests sr LEFT JOIN users u ON sr.user_id = u.id WHERE sr.lida_por_usuario = 0 ORDER BY sr.criado_em DESC`
    );
    return rows;
  },
  async findAllByUser(user_id) {
    const [rows] = await pool.query(
      `SELECT sr.* FROM service_requests sr WHERE sr.user_id = ? AND sr.lida_por_usuario = 0 ORDER BY sr.criado_em DESC`,
      [user_id]
    );
    return rows;
  },
  async findAllByUserNaoLidas(user_id) {
    const [rows] = await pool.query(
      `SELECT sr.* FROM service_requests sr WHERE sr.user_id = ? AND sr.lida_por_usuario = 0 ORDER BY sr.criado_em DESC`,
      [user_id]
    );
    return rows;
  },
  async update(id, { status, resposta_admin }) {
    await pool.query(
      'UPDATE service_requests SET status = ?, resposta_admin = ? WHERE id = ?',
      [status, resposta_admin, id]
    );
    const [rows] = await pool.query('SELECT * FROM service_requests WHERE id = ?', [id]);
    return rows[0];
  },
  async marcarComoLida(id) {
    await pool.query('UPDATE service_requests SET lida_por_usuario = 1 WHERE id = ?', [id]);
  }
};

module.exports = ServiceRequest;
