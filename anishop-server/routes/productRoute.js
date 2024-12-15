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
  getFilteredProducts
} = require('../controllers/productController');
const authMiddleware = require ('../middleware/authMiddleware');

const router = express.Router();

// Rotas para produtos
router.get('/', getAllProducts);
router.get('/top-selling', getMostSoldProducts);  // Mova esta rota ANTES da rota com parâmetro /:id
router.get('/:id', getProductById);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/:id/reviews', getProductReviews);
router.post('/reviews', authMiddleware, addProductReview);
router.get('/:productId/related', getRelatedProducts);
router.post('/images', addProductImage);
router.get('/filter', getFilteredProducts);

module.exports = router;