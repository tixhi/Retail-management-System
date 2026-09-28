const { PurchaseOrder, Transaction } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listPurchaseOrders = asyncHandler(async (req, res) => {
  const purchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: purchaseOrders });
});

const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplier, items, expectedDelivery } = req.body;

  if (!supplier || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Supplier and items are required.' });
  }

  const totalCost = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitCost), 0);
  const purchaseOrder = await PurchaseOrder.create({
    poNumber: `PO-${Date.now()}`,
    supplier,
    status: 'Draft',
    items,
    totalCost,
    expectedDelivery: expectedDelivery || new Date().toISOString(),
  });

  return res.status(201).json({ success: true, message: 'Purchase order created successfully.', data: purchaseOrder.toObject() });
});

const receivePurchaseOrder = asyncHandler(async (req, res) => {
  const purchaseOrder = await PurchaseOrder.findOne({ $or: [{ _id: req.params.id }, { poNumber: req.params.id }] });

  if (!purchaseOrder) {
    return res.status(404).json({ success: false, message: 'Purchase order not found.' });
  }

  purchaseOrder.status = 'Received';
  purchaseOrder.receivedItems = purchaseOrder.items.map((item) => ({
    ...item,
    receivedQuantity: Number(item.quantity),
  }));
  purchaseOrder.receivingDate = new Date().toISOString();
  await purchaseOrder.save();

  await Transaction.create({
    type: 'Stock In',
    product: purchaseOrder.items[0].product,
    quantity: purchaseOrder.items.reduce((sum, item) => sum + Number(item.quantity), 0),
    warehouse: purchaseOrder.warehouseName || '',
  });

  return res.json({ success: true, message: 'Goods received successfully.', data: purchaseOrder.toObject() });
});

module.exports = { listPurchaseOrders, createPurchaseOrder, receivePurchaseOrder };
