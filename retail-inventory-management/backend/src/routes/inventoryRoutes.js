const express = require('express');
const { getInventory, adjustInventory, transferStock, getTransactions } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getInventory);
router.post('/adjust', protect, authorize('Admin', 'Inventory Manager', 'Warehouse Staff'), adjustInventory);
router.post('/transfer', protect, authorize('Admin', 'Inventory Manager'), transferStock);
router.get('/transactions', protect, getTransactions);

module.exports = router;
