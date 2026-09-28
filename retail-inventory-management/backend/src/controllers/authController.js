const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/env');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

function createToken(user) {
  return jwt.sign({ email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const newUser = await User.create({
    name,
    email: String(email).trim().toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role: role || 'Sales Staff',
    status: 'Active',
  });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: {
      token: createToken(newUser),
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      token: createToken(user),
      user: { name: user.name, email: user.email, role: user.role },
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => res.json({ success: true, data: req.user }));

module.exports = { register, login, getCurrentUser };
