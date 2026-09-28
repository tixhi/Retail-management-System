const express = require('express');
const { listWarehouses, createWarehouse } = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listWarehouses);
router.post('/', protect, authorize('Admin', 'Inventory Manager'), createWarehouse);

module.exports = router;
