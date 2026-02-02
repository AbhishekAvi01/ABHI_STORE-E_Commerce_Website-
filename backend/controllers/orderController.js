const Order = require('../models/orderModel');
const mongoose = require('mongoose');

// Error wrapper
const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('Error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server error';
    res.status(statusCode).json({ message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { 
    orderItems, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice 
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    orderItems: orderItems.map((x) => ({ 
      ...x, 
      product: x._id, 
      _id: undefined 
    })),
    user: req.user._id, 
    shippingAddress, 
    paymentMethod, 
    itemsPrice, 
    taxPrice, 
    shippingPrice, 
    totalPrice,
    isPaid: paymentMethod === 'COD' ? false : false, // Default unpaid
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Logged-in user ke apne orders nikalna
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  console.log('getMyOrders called - User:', req.user?._id);
  
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  console.log('Found orders:', orders.length);
  res.json(orders);
});

// @desc    ID se order dhundna
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// @desc    Saare orders nikalna (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Order ko delivered mark karna
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID format' });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Handle Stripe webhook (test mode safe)
// @route   POST /api/orders/webhook/stripe
// @access  Public (but signature verified)
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const stripe = require('stripe');
  
  // Gracefully handle missing Stripe key (local development)
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  STRIPE_SECRET_KEY not configured - webhook disabled');
    return res.status(200).json({ received: true, warning: 'Stripe not configured' });
  }

  const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    console.warn('⚠️  Missing webhook secret or signature');
    return res.status(200).json({ received: true });
  }

  try {
    const event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    // Handle payment intent succeeded
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          await order.save();
          console.log(`✅ Order ${orderId} marked as paid via Stripe`);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('⚠️  Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = { 
  addOrderItems, 
  getMyOrders, 
  getOrderById, 
  getOrders, 
  updateOrderToDelivered,
  handleStripeWebhook
};