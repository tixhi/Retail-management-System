const express = require('express');
const { listProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, listProducts);
router.post('/', protect, authorize('Admin', 'Inventory Manager'), createProduct);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, authorize('Admin', 'Inventory Manager'), updateProduct);
router.delete('/:id', protect, authorize('Admin', 'Inventory Manager'), deleteProduct);

module.exports = router;
