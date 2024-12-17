const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const { getAllUsers, deleteUser } = require('../controllers/userController');

// Rotas protegidas por admin
router.get('/', isAdmin, getAllUsers);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;