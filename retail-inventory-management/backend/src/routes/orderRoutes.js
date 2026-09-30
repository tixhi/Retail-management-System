const express = require('express');
const { listOrders, listCustomerOrders, getCustomerOrder, createOrder, updateOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Admin', 'Sales Staff', 'Warehouse Staff'), listOrders);
router.get('/my-orders', protect, authorize('Customer'), listCustomerOrders);
router.get('/my-orders/:id', protect, authorize('Customer'), getCustomerOrder);
router.post('/', protect, authorize('Admin', 'Sales Staff', 'Customer'), createOrder);
router.put('/:id', protect, authorize('Admin', 'Sales Staff'), updateOrder);
router.patch('/:id/status', protect, authorize('Admin', 'Warehouse Staff', 'Sales Staff'), updateOrderStatus);

module.exports = router;
