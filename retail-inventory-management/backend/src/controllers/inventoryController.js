const { Inventory, Transaction } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort({ productName: 1, warehouseName: 1 }).lean();
  return res.json({ success: true, data: inventory });
});

const adjustInventory = asyncHandler(async (req, res) => {
  const { productId, warehouseId, quantity, reason } = req.body;

  const adjustment = Number(quantity);
  if (!productId || !warehouseId || !Number.isFinite(adjustment) || adjustment === 0) {
    return res.status(400).json({ success: false, message: 'Product, warehouse and quantity are required.' });
  }

  const item = await Inventory.findOne({ productId, warehouseId });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Inventory record not found.' });
  }

  if (item.availableStock + adjustment < 0 || item.currentStock + adjustment < 0) {
    return res.status(400).json({ success: false, message: 'Adjustment would result in negative stock.' });
  }
  item.availableStock += adjustment;
  item.currentStock += adjustment;
  item.stockStatus = item.availableStock <= 0 ? 'Out of Stock' : item.availableStock <= item.reorderLevel ? 'Low Stock' : 'In Stock';
  await item.save();

  await Transaction.create({
    type: 'Adjustment',
    product: item.productName,
    warehouse: item.warehouseName,
    quantity: adjustment,
    reason: reason || 'Manual adjustment',
  });

  return res.status(201).json({ success: true, message: 'Inventory adjusted successfully.', data: item.toObject() });
});

const transferStock = asyncHandler(async (req, res) => {
  const { sourceWarehouseId, destinationWarehouseId, productId, quantity } = req.body;
  const qty = Number(quantity);

  if (!sourceWarehouseId || !destinationWarehouseId || !productId || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ success: false, message: 'Source, destination, product and quantity are required.' });
  }

  if (sourceWarehouseId === destinationWarehouseId) {
    return res.status(400).json({ success: false, message: 'Source and destination warehouses cannot be the same.' });
  }

  const source = await Inventory.findOne({ productId, warehouseId: sourceWarehouseId });
  const destination = await Inventory.findOne({ productId, warehouseId: destinationWarehouseId });

  if (!source || source.availableStock < qty) {
    return res.status(400).json({ success: false, message: 'Insufficient stock at source warehouse.' });
  }

  source.availableStock -= qty;
  source.currentStock -= qty;
  source.stockStatus = source.availableStock <= 0 ? 'Out of Stock' : source.availableStock <= source.reorderLevel ? 'Low Stock' : 'In Stock';
  await source.save();

  if (!destination) {
    await Inventory.create({
      productId,
      productName: source.productName,
      warehouseId: destinationWarehouseId,
      warehouseName: req.body.destinationWarehouseName || 'Destination Warehouse',
      currentStock: qty,
      availableStock: qty,
      reservedStock: 0,
      reorderLevel: source.reorderLevel,
      stockStatus: 'In Stock',
    });
  } else {
    destination.availableStock += qty;
    destination.currentStock += qty;
    destination.stockStatus = destination.availableStock <= 0 ? 'Out of Stock' : destination.availableStock <= destination.reorderLevel ? 'Low Stock' : 'In Stock';
    await destination.save();
  }

  await Transaction.create({
    type: 'Transfer',
    product: source.productName,
    from: source.warehouseName,
    to: destination ? destination.warehouseName : req.body.destinationWarehouseName || 'Destination Warehouse',
    quantity: qty,
  });

  return res.status(201).json({ success: true, message: 'Stock transfer completed successfully.' });
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 }).limit(100).lean();
  return res.json({ success: true, data: transactions });
});

module.exports = { getInventory, adjustInventory, transferStock, getTransactions };
