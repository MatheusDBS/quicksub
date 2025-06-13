const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Usuário, email e senha obrigatórios.' });
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) return res.status(409).json({ message: 'Usuário já existe.' });
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) return res.status(409).json({ message: 'Email já cadastrado.' });
    const hash = await bcrypt.hash(password, 10);
    const userId = await User.create(username, email, hash);
    res.status(201).json({ id: userId, username, email });
  } catch (err) {
    console.error('Erro detalhado no cadastro:', err);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    // Inclui o email no token
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao autenticar.' });
  }
};

// Atualização de dados do usuário
exports.update = async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.id;
  try {
    if (username) await User.updateUsername(userId, username);
    if (email) await User.updateEmail(userId, email);
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await User.updatePassword(userId, hash);
    }
    res.json({ message: 'Dados atualizados com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar dados.' });
  }
};
