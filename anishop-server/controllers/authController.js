const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

// Secret para JWT
const JWT_SECRET = process.env.JWT_SECRET || '123456789';

// Registrar usuário
const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Validar campos
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Verificar se o e-mail já existe
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'E-mail já registrado.' });
    }

    // Criptografar senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Erro ao criptografar a senha.' });

      // Inserir novo usuário
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao registrar usuário.' });

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
    });
  });
};

// Fazer login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Verificar se o usuário existe
  const findUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(findUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const user = results[0];

    // Verificar senha
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar a senha.' });

      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      // Gerar token JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '10h',
      });

      res.status(200).json({
        message: 'Login bem-sucedido!',
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    });
  });
};

module.exports = { registerUser, loginUser };
