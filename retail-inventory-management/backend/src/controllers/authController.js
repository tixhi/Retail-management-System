const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { timingSafeEqual } = require('crypto');
const { JWT_SECRET, ADMIN_SIGNUP_CODE } = require('../config/env');
const { User } = require('../models');
const { getDemoUser } = require('../demoData');
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

const registerAdmin = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }
  if (password.length < 12) {
    return res.status(400).json({ success: false, message: 'Admin passwords must be at least 12 characters.' });
  }

  const admin = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'Admin',
    status: 'Active',
  });

  return res.status(201).json({
    success: true,
    message: 'Admin account created. They can now sign in with their email and password.',
    data: { user: { name: admin.name, email: admin.email, role: admin.role } },
  });
});

const signUpAdmin = asyncHandler(async (req, res) => {
  if (!ADMIN_SIGNUP_CODE) {
    return res.status(503).json({ success: false, message: 'Admin signup is not configured on the server.' });
  }

  const suppliedCode = Buffer.from(String(req.body.inviteCode || ''));
  const configuredCode = Buffer.from(ADMIN_SIGNUP_CODE);
  if (suppliedCode.length !== configuredCode.length || !timingSafeEqual(suppliedCode, configuredCode)) {
    return res.status(403).json({ success: false, message: 'The administrator invite code is invalid.' });
  }
  if (User.db.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Admin signup is unavailable while MongoDB is disconnected.' });
  }

  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }
  if (password.length < 12) {
    return res.status(400).json({ success: false, message: 'Admin passwords must be at least 12 characters.' });
  }

  const admin = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'Admin',
    status: 'Active',
  });
  return res.status(201).json({
    success: true,
    message: 'Admin account created successfully.',
    data: {
      token: createToken(admin),
      user: { name: admin.name, email: admin.email, role: admin.role },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const databaseConnected = User.db.readyState === 1;
  const persistentUser = databaseConnected
    ? await User.findOne({ email: normalizedEmail })
    : null;
  const demoUser = getDemoUser(normalizedEmail);
  const user = persistentUser || (!databaseConnected || demoUser?.role === 'Customer' ? demoUser : null);

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

module.exports = { register, registerAdmin, signUpAdmin, login, getCurrentUser };
