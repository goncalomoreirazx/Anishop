const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Rota para registro
router.post('/register', registerUser);

// Rota para login
router.post('/login', loginUser);

module.exports = router;
