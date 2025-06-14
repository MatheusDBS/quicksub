const ServiceRequest = require('../models/ServiceRequest');

// Usuário faz uma solicitação de novo serviço
exports.criarRequest = async (req, res) => {
  try {
    const { nome_servico, descricao } = req.body;
    const user_id = req.user.id;
    const request = await ServiceRequest.create({ user_id, nome_servico, descricao });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar solicitação.' });
  }
};

// Admin lista todas as solicitações
exports.listarRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar solicitações.' });
  }
};

// Admin responde e aprova/rejeita
exports.responderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resposta_admin } = req.body;
    const request = await ServiceRequest.update(id, { status, resposta_admin });
    if (!request) return res.status(404).json({ message: 'Solicitação não encontrada.' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao responder solicitação.' });
  }
};

// Marcar como lida por usuário
exports.marcarComoLida = async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceRequest.marcarComoLida(id);
    res.json({ message: 'Solicitação marcada como lida.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao marcar como lida.' });
  }
};

// Listar apenas requests não lidas por usuário
exports.listarNaoLidasPorUsuario = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requests = await ServiceRequest.findAllByUserNaoLidas(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar solicitações.' });
  }
};
