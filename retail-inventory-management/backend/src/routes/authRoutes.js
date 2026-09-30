const express = require('express');
const { login, register, registerAdmin, signUpAdmin, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/signup-admin', signUpAdmin);
router.post('/register', protect, authorize('Admin'), register);
router.post('/register-admin', protect, authorize('Admin'), registerAdmin);
router.get('/me', protect, getCurrentUser);

module.exports = router;
