const Assinatura = require('../models/Assinatura');

exports.create = async (req, res) => {
  try {
    const { servico_id, data_inicio, data_fim, status } = req.body;
    const user_id = req.user.id;
    if (!servico_id || !data_inicio || !data_fim || !user_id) {
      return res.status(400).json({ message: 'Dados obrigatórios não informados.' });
    }
    const id = await Assinatura.create({
      servico_id,
      data_inicio,
      data_fim,
      status,
      user_id
    });
    res.status(201).json({ id, servico_id, data_inicio, data_fim, status });
  } catch (err) {
    console.error('Erro ao criar assinatura:', err);
    res.status(500).json({ message: 'Erro ao criar assinatura.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Busca apenas as assinaturas do usuário logado
    const assinaturas = await Assinatura.findAllByUser(req.user.id);
    res.json(assinaturas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar assinaturas.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const assinatura = await Assinatura.findById(req.params.id);
    if (!assinatura) return res.status(404).json({ message: 'Assinatura não encontrada.' });
    res.json(assinatura);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar assinatura.' });
  }
};

exports.update = async (req, res) => {
  const { servico_id, data_inicio, data_fim, status } = req.body;
  try {
    await Assinatura.update(req.params.id, servico_id, data_inicio, data_fim, status);
    res.json({ message: 'Assinatura atualizada.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Assinatura.delete(req.params.id);
    res.json({ message: 'Assinatura excluída.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir assinatura.' });
  }
};
