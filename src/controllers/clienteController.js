const Cliente = require('../models/Cliente');

exports.create = async (req, res) => {
  const { nome, email } = req.body;
  try {
    const id = await Cliente.create(nome, email);
    res.status(201).json({ id, nome, email });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar cliente.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar clientes.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado.' });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar cliente.' });
  }
};

exports.update = async (req, res) => {
  const { nome, email } = req.body;
  try {
    await Cliente.update(req.params.id, nome, email);
    res.json({ message: 'Cliente atualizado.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar cliente.' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Cliente.delete(req.params.id);
    res.json({ message: 'Cliente excluído.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir cliente.' });
  }
};
