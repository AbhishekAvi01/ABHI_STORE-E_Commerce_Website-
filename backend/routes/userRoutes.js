const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    authUser, 
    getUsers, 
    deleteUser,
    getUserProfile 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Auth & Base Routes
router.post('/login', authUser); // Login ke liye
router.route('/')
    .post(registerUser) // Signup ke liye
    .get(protect, admin, getUsers); // Admin ke liye saare users ki list

// 2. Profile Route
router.route('/profile').get(protect, getUserProfile); // Login user ki apni profile

// 3. Admin Only: Delete Route
router.route('/:id').delete(protect, admin, deleteUser); // Admin kisi user ko delete kar sake

module.exports = router;