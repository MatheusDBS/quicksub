const Servico = require('../models/Servico');

exports.create = async (req, res) => {
  const { nome, descricao, preco } = req.body;
  try {
    const id = await Servico.create(nome, descricao, preco);
    res.status(201).json({ id, nome, descricao, preco });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar serviço.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const servicos = await Servico.findAll();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviços.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) return res.status(404).json({ message: 'Serviço não encontrado.' });
    res.json(servico);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar serviço.' });
  }
};

exports.update = async (req, res) => {
  const { nome, descricao, preco } = req.body;
  try {
    await Servico.update(req.params.id, nome, descricao, preco);
    res.json({ message: 'Serviço atualizado.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar serviço.' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Servico.delete(req.params.id);
    res.json({ message: 'Serviço excluído.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir serviço.' });
  }
};
