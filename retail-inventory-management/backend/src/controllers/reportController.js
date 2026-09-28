const { Product, Inventory, Order, Warehouse, Supplier, PurchaseOrder, Transaction } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const getDashboardReport = asyncHandler(async (req, res) => {
  const [products, inventory, orders, warehouses, suppliers, purchaseOrders, transactions] = await Promise.all([
    Product.find().select('name costPrice').lean(),
    Inventory.find().sort({ availableStock: 1 }).lean(),
    Order.find().sort({ createdAt: -1 }).limit(1000).lean(),
    Warehouse.find().select('name city status').lean(),
    Supplier.countDocuments({ status: 'Active' }),
    PurchaseOrder.find().sort({ createdAt: -1 }).limit(100).lean(),
    Transaction.find().sort({ date: -1 }).limit(100).lean(),
  ]);

  const productCosts = new Map(products.map((product) => [product._id, Number(product.costPrice) || 0]));
  const productNames = new Map(products.map((product) => [product._id, product.name]));
  const inventoryValue = inventory.reduce((sum, item) => sum + (Number(item.currentStock) || 0) * (productCosts.get(item.productId) || 0), 0);
  const lowStock = inventory.filter((item) => item.availableStock <= item.reorderLevel);
  const warehouseTotals = new Map();
  for (const item of inventory) {
    const name = item.warehouseName || 'Unassigned';
    warehouseTotals.set(name, (warehouseTotals.get(name) || 0) + (Number(item.currentStock) || 0));
  }

  const monthKeys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    return date.toISOString().slice(0, 7);
  });
  const trend = monthKeys.map((month) => ({
    month: new Date(`${month}-01T00:00:00`).toLocaleString('en', { month: 'short' }),
    sales: orders.filter((order) => String(order.createdAt || '').startsWith(month)).reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
  }));

  const movementTotals = new Map();
  for (const transaction of transactions) {
    movementTotals.set(transaction.type, (movementTotals.get(transaction.type) || 0) + Math.abs(Number(transaction.quantity) || 0));
  }

  const topProductTotals = new Map();
  for (const order of orders) {
    for (const item of order.items || []) {
      const productId = item.productId || item.product;
      const productName = productNames.get(productId) || item.productName || item.product || 'Unknown product';
      topProductTotals.set(productName, (topProductTotals.get(productName) || 0) + (Number(item.quantity) || 0));
    }
  }

  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  return res.json({
    success: true,
    data: {
      kpis: [
        { title: 'Total Products', value: products.length, change: 'Live catalog count', tone: 'blue' },
        { title: 'Total Inventory', value: inventory.reduce((sum, item) => sum + (Number(item.currentStock) || 0), 0), change: 'Across all warehouses', tone: 'green' },
        { title: 'Low Stock Items', value: lowStock.length, change: 'At or below reorder level', tone: 'amber' },
        { title: 'Pending Orders', value: orders.filter((order) => order.status === 'Pending').length, change: 'Awaiting processing', tone: 'red' },
        { title: 'Active Warehouses', value: warehouses.filter((warehouse) => warehouse.status === 'Active').length, change: 'Live warehouse count', tone: 'purple' },
        { title: 'Active Suppliers', value: suppliers, change: 'Live supplier count', tone: 'blue' },
        { title: 'Purchase Orders', value: purchaseOrders.length, change: 'All recorded statuses', tone: 'amber' },
        { title: 'Inventory Value', value: currency.format(inventoryValue), change: 'Quantity × unit cost', tone: 'green' },
      ],
      trend,
      warehouseDistribution: [...warehouseTotals].map(([name, value]) => ({ name, value })),
      inventoryMovement: [...movementTotals].map(([name, value]) => ({ name, value })),
      topProducts: [...topProductTotals].map(([name, units]) => ({ name, units })).sort((a, b) => b.units - a.units).slice(0, 5),
      recentOrders: orders.slice(0, 3).map((order) => ({
        orderId: order.orderId,
        customer: order.customer,
        total: currency.format(Number(order.totalAmount) || 0),
        status: order.status,
      })),
      lowStock: lowStock.slice(0, 3).map((item) => ({ item: item.productName, warehouse: item.warehouseName, quantity: item.availableStock })),
      transactions: transactions.slice(0, 3).map((transaction) => ({
        type: transaction.type,
        product: transaction.product,
        qty: `${transaction.quantity > 0 ? '+' : ''}${transaction.quantity}`,
        warehouse: transaction.warehouse,
      })),
      purchaseOrders: purchaseOrders.slice(0, 2).map((purchaseOrder) => ({
        poId: purchaseOrder.poNumber,
        supplier: purchaseOrder.supplier,
        status: purchaseOrder.status,
        eta: purchaseOrder.expectedDelivery,
      })),
    },
  });
});

const getInventoryReport = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find().sort({ productName: 1 }).lean();
  return res.json({ success: true, data: inventory });
});

const getSalesReport = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: orders });
});

module.exports = { getDashboardReport, getInventoryReport, getSalesReport };
