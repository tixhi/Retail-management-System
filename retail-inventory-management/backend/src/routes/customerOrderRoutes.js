const express = require('express');
const { listCustomerOrders, getCustomerOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Customer'), listCustomerOrders);
router.get('/:id', protect, authorize('Customer'), getCustomerOrder);

module.exports = router;
