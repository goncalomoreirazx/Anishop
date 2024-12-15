const express = require('express');
const { createOrder } = require('../controllers/checkoutController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para processar o checkout
router.post('/checkout',authenticate, createOrder);

module.exports = router;
