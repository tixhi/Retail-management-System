const { Order, Product, Inventory } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: orders });
});

const listCustomerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerEmail: req.user.email }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: orders });
});

const getCustomerOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    $and: [
      { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
      { customerEmail: req.user.email },
    ],
  }).lean();
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  return res.json({ success: true, data: order });
});

const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, warehouse, totalAmount } = req.body;

  if (req.user.role === 'Customer') {
    const shippingAddress = String(req.body.shippingAddress || '').trim();
    if (!shippingAddress || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Add items and a shipping address before checkout.' });
    }

    const productIds = items.map((item) => item.productId);
    if (productIds.some((id) => !id) || new Set(productIds).size !== productIds.length) {
      return res.status(400).json({ success: false, message: 'Cart items must contain unique product IDs.' });
    }
    const [products, stockRecords] = await Promise.all([
      Product.find({ _id: { $in: productIds }, status: { $ne: 'Discontinued' } }).lean(),
      Inventory.find({ productId: { $in: productIds } }).sort({ availableStock: -1 }),
    ]);
    const productById = new Map(products.map((product) => [product._id, product]));
    const stockByProduct = new Map();
    for (const stock of stockRecords) {
      const records = stockByProduct.get(stock.productId) || [];
      records.push(stock);
      stockByProduct.set(stock.productId, records);
    }

    const reservedPlan = [];
    const orderItems = [];
    let calculatedTotal = 0;
    for (const item of items) {
      const product = productById.get(item.productId);
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: 'One or more cart items are invalid.' });
      }

      let remaining = quantity;
      for (const stock of stockByProduct.get(item.productId) || []) {
        const allocated = Math.min(remaining, Number(stock.availableStock) || 0);
        if (allocated > 0) reservedPlan.push({ stock, quantity: allocated });
        remaining -= allocated;
        if (remaining === 0) break;
      }
      if (remaining > 0) {
        const available = quantity - remaining;
        return res.status(400).json({ success: false, message: `Only ${available} units of ${product.name} are available.` });
      }

      const unitPrice = Number(product.price) || 0;
      calculatedTotal += unitPrice * quantity;
      orderItems.push({ productId: product._id, product: product.name, quantity, unitPrice });
    }

    const reserved = [];
    try {
      for (const entry of reservedPlan) {
        const result = await Inventory.updateOne(
          { _id: entry.stock._id, availableStock: { $gte: entry.quantity } },
          {
            $inc: { availableStock: -entry.quantity, reservedStock: entry.quantity },
            $set: {
              stockStatus: entry.stock.availableStock - entry.quantity <= 0
                ? 'Out of Stock'
                : entry.stock.availableStock - entry.quantity <= entry.stock.reorderLevel ? 'Low Stock' : 'In Stock',
            },
          },
        );
        if (result.modifiedCount !== 1) throw new Error('Stock changed during checkout. Please retry.');
        reserved.push(entry);
      }

      const order = await Order.create({
        orderId: `ORD-${Date.now()}`,
        customer: req.user.name,
        customerEmail: req.user.email,
        items: orderItems,
        warehouse: reservedPlan[0]?.stock.warehouseName || 'Unassigned',
        totalAmount: calculatedTotal,
        status: 'Pending',
        paymentStatus: 'Pending',
        paymentMethod: req.body.paymentMethod || 'Cash on delivery',
        shippingAddress,
        fulfillmentStatus: 'Pending',
      });
      return res.status(201).json({ success: true, message: 'Order created successfully.', data: order.toObject() });
    } catch (error) {
      await Promise.all(reserved.map(({ stock, quantity }) => Inventory.updateOne(
        { _id: stock._id },
        { $inc: { availableStock: quantity, reservedStock: -quantity } },
      )));
      throw error;
    }
  }

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

module.exports = { listOrders, listCustomerOrders, getCustomerOrder, createOrder, updateOrder, updateOrderStatus };
