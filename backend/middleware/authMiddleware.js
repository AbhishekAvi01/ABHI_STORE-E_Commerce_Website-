const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Authorization header check karein
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token nikaalein
      token = req.headers.authorization.split(' ')[1];

      // Token verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko find karein aur password hatakar request mein attach karein
      req.user = await User.findById(decoded.id).select('-password');

      // Agar user nahi milta (deleted user with valid token)
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, not authorized' });
      }

      if (typeof next === 'function') {
        next();
      }
    } catch (error) {
      console.error("Token Error:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin access check karne ke liye
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    if (typeof next === 'function') {
      next();
    }
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };