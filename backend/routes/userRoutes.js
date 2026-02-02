const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    authUser, 
    getUsers, 
    deleteUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Auth & Base Routes
router.post('/login', authUser);
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

// 2. Profile Routes - MUST come before /:id
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// 3. Admin Only: Delete Route
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;