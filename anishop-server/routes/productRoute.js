const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getMostSoldProducts, 
  getProductReviews,
  addProductReview,
  getRelatedProducts,
  addProductImage,
  getFilteredProducts,
  applyDiscount,  // New controller for discounts
  removeDiscounts // New controller to remove discounts
} = require('../controllers/productController');
const authMiddleware = require ('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Rotas para produtos
router.get('/', getAllProducts); //qualquer 1 ou para o admin na dashboard/products
router.get('/top-selling', getMostSoldProducts);  // Mova esta rota ANTES da rota com parâmetro /:id
router.get('/:id', getProductById); //acho qualquer 1
router.post('/', isAdmin, addProduct); //admin
router.put('/:id', isAdmin, updateProduct); //admin
router.delete('/:id', isAdmin, deleteProduct); //admin
router.get('/:id/reviews', getProductReviews); //qualquer pessoa ve
router.post('/reviews', authMiddleware, addProductReview); // so users logados
router.get('/:productId/related', getRelatedProducts); //qualquer 1 ve
router.post('/images', isAdmin, addProductImage); //admin
router.get('/filter', getFilteredProducts); //qualquer pessoa ve

// New routes for discounts
router.post('/discounts/apply', isAdmin, applyDiscount); //admin
router.post('/discounts/remove', isAdmin, removeDiscounts); //admin

module.exports = router;