const { Order } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: orders });
});

const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, warehouse, totalAmount } = req.body;

  if (!customer || !Array.isArray(items) || items.length === 0 || !warehouse) {
    return res.status(400).json({ success: false, message: 'Customer, items and warehouse are required.' });
  }

  const order = await Order.create({
    orderId: `ORD-${Date.now()}`,
    customer,
    items,
    warehouse,
    totalAmount: Number(totalAmount) || 0,
    status: 'Pending',
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Pending',
  });

  return res.status(201).json({ success: true, message: 'Order created successfully.', data: order.toObject() });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
    req.body,
    { new: true, runValidators: true },
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({ success: true, message: 'Order updated successfully.', data: order.toObject() });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ success: false, message: 'Order status is required.' });

  const order = await Order.findOneAndUpdate(
    { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
    { status, fulfillmentStatus: status },
    { new: true, runValidators: true },
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({ success: true, message: 'Order status updated.', data: order.toObject() });
});

module.exports = { listOrders, createOrder, updateOrder, updateOrderStatus };
