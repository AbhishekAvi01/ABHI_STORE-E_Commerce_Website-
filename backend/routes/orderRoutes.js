const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrders,
    getOrderById,
    updateOrderToDelivered,
    handleStripeWebhook
} = require('../controllers/orderController'); 
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems) 
    .get(protect, admin, getOrders); 

// CRITICAL: /myorders MUST come before /:id (router matches top-to-bottom)
router.route('/myorders').get(protect, getMyOrders); 
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById);

// Stripe webhook (raw body, no JSON parsing)
router.post('/webhook/stripe', express.raw({type: 'application/json'}), handleStripeWebhook);

module.exports = router;