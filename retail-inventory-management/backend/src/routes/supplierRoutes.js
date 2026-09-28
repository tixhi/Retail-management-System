const express = require('express');
const { listSuppliers, createSupplier } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listSuppliers);
router.post('/', protect, authorize('Admin', 'Procurement Manager'), createSupplier);

module.exports = router;
