const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');

// Rota para buscar todos os usuários
router.get('/users', getAllUsers);

// Rota para apagar um usuário
router.delete('/users/:id', deleteUser);

module.exports = router;
