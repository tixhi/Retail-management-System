const express = require('express');
const { getDashboardReport, getInventoryReport, getSalesReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, getDashboardReport);
router.get('/inventory', protect, getInventoryReport);
router.get('/sales', protect, getSalesReport);

module.exports = router;
