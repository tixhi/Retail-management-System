const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { User } = require('../models');
const { asyncHandler } = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token is missing or invalid.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email }).select('-password').lean();
    if (!user || user.status !== 'Active') {
      return res.status(401).json({ success: false, message: 'User is unavailable.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
});

module.exports = { protect };
