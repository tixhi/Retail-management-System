const express = require('express');
const { login, register, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', protect, authorize('Admin'), register);
router.get('/me', protect, getCurrentUser);

module.exports = router;
