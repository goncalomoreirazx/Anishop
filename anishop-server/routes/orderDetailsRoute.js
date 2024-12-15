const express = require('express');
const router = express.Router();
const { getLatestOrderDetails, 
getUserOrders,
getAllOrders,
getRecentOrdersAdmin 
} = require('../controllers/orderController');
const authenticate = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

console.log('Setting up order history route...');


router.get('/admin/orders',authenticate, isAdmin, getAllOrders);
router.get('/admin/recent', isAdmin, getRecentOrdersAdmin);
router.get('/latest', authenticate, getLatestOrderDetails);
router.get('/history', authenticate, getUserOrders);
console.log('Order routes initialized');


module.exports = router;