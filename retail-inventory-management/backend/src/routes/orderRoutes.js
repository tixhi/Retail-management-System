const express = require('express');
const { listOrders, createOrder, updateOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listOrders);
router.post('/', protect, authorize('Admin', 'Sales Staff'), createOrder);
router.put('/:id', protect, authorize('Admin', 'Sales Staff'), updateOrder);
router.patch('/:id/status', protect, authorize('Admin', 'Warehouse Staff', 'Sales Staff'), updateOrderStatus);

module.exports = router;
