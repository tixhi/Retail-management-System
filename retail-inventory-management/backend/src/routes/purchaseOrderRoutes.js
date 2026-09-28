const express = require('express');
const { listPurchaseOrders, createPurchaseOrder, receivePurchaseOrder } = require('../controllers/purchaseOrderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listPurchaseOrders);
router.post('/', protect, authorize('Admin', 'Procurement Manager'), createPurchaseOrder);
router.post('/:id/receive', protect, authorize('Admin', 'Procurement Manager', 'Warehouse Staff'), receivePurchaseOrder);

module.exports = router;
