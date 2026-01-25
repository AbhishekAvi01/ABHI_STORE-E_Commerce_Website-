const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    getProductById, 
    createProduct, 
    deleteProduct,
    updateProduct
} = require('../controllers/productController');

const { protect, admin } = require('../middleware/authMiddleware');

// Get all products (public) + Create product (admin only)
router.route('/')
    .get(getProducts) 
    .post(protect, admin, createProduct); 

// Individual product routes
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;