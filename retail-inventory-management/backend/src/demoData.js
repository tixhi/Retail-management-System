const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('./config/env');

const users = [
  {
    _id: 'user-admin',
    name: 'Admin User',
    email: 'admin@retail.local',
    password: bcrypt.hashSync('RetailAdmin123', 10),
    role: 'Admin',
    status: 'Active',
  },
  {
    _id: 'user-customer',
    name: 'Customer User',
    email: 'customer@retail.local',
    password: bcrypt.hashSync('Customer@123', 10),
    role: 'Customer',
    status: 'Active',
  },
];

const products = [
  { _id: 'p-101', name: 'Wireless Mouse', sku: 'WM-101', category: 'Electronics', price: 899, costPrice: 640, supplier: 'Northwind Supply', status: 'In Stock', reorderLevel: 12 },
  { _id: 'p-102', name: 'Mechanical Keyboard', sku: 'MK-204', category: 'Electronics', price: 2199, costPrice: 1490, supplier: 'Prime Goods', status: 'In Stock', reorderLevel: 10 },
  { _id: 'p-103', name: 'USB-C Hub', sku: 'USB-332', category: 'Accessories', price: 1499, costPrice: 980, supplier: 'Metro Logistics', status: 'Low Stock', reorderLevel: 8 },
  { _id: 'p-104', name: 'Office Chair', sku: 'OC-009', category: 'Furniture', price: 6999, costPrice: 4700, supplier: 'Northwind Supply', status: 'In Stock', reorderLevel: 6 },
  { _id: 'p-105', name: 'Portable Speaker', sku: 'PS-118', category: 'Electronics', price: 3499, costPrice: 2300, supplier: 'Prime Goods', status: 'In Stock', reorderLevel: 9 },
  { _id: 'p-106', name: 'Smartwatch', sku: 'SW-511', category: 'Wearables', price: 5999, costPrice: 4100, supplier: 'Metro Logistics', status: 'Low Stock', reorderLevel: 7 },
];

const warehouses = [
  { _id: 'wh-001', name: 'North Hub', code: 'NH-01', city: 'Delhi', address: 'Plot 14, Industrial Area', manager: 'Aisha Khan', contactNumber: '+91 98100 00001', status: 'Active' },
  { _id: 'wh-002', name: 'Central Depot', code: 'CD-02', city: 'Bengaluru', address: '20th Cross, Electronic City', manager: 'Rohit Nair', contactNumber: '+91 98100 00002', status: 'Active' },
  { _id: 'wh-003', name: 'Coastal Store', code: 'CS-03', city: 'Mumbai', address: 'Harbor Road, Taloja', manager: 'Neha Shah', contactNumber: '+91 98100 00003', status: 'Active' },
];

const suppliers = [
  { _id: 'sup-01', companyName: 'Northwind Supply', contact: 'Ava Sharma', contactPerson: 'Ava Sharma', email: 'ava@northwind.com', phone: '+91 90000 11111', status: 'Active' },
  { _id: 'sup-02', companyName: 'Prime Goods', contact: 'Rohan Iyer', contactPerson: 'Rohan Iyer', email: 'rohan@primegoods.com', phone: '+91 90000 22222', status: 'Active' },
  { _id: 'sup-03', companyName: 'Metro Logistics', contact: 'Neha Singh', contactPerson: 'Neha Singh', email: 'neha@metrologistics.com', phone: '+91 90000 33333', status: 'Preferred' },
];

const inventory = [
  { _id: 'inv-101', productId: 'p-101', productName: 'Wireless Mouse', warehouseId: 'wh-001', warehouseName: 'North Hub', currentStock: 40, availableStock: 34, reservedStock: 6, reorderLevel: 12, stockStatus: 'Healthy' },
  { _id: 'inv-102', productId: 'p-102', productName: 'Mechanical Keyboard', warehouseId: 'wh-002', warehouseName: 'Central Depot', currentStock: 28, availableStock: 22, reservedStock: 6, reorderLevel: 10, stockStatus: 'Healthy' },
  { _id: 'inv-103', productId: 'p-103', productName: 'USB-C Hub', warehouseId: 'wh-003', warehouseName: 'Coastal Store', currentStock: 11, availableStock: 7, reservedStock: 4, reorderLevel: 8, stockStatus: 'Low Stock' },
  { _id: 'inv-104', productId: 'p-104', productName: 'Office Chair', warehouseId: 'wh-001', warehouseName: 'North Hub', currentStock: 18, availableStock: 16, reservedStock: 2, reorderLevel: 6, stockStatus: 'Healthy' },
  { _id: 'inv-105', productId: 'p-105', productName: 'Portable Speaker', warehouseId: 'wh-002', warehouseName: 'Central Depot', currentStock: 26, availableStock: 20, reservedStock: 6, reorderLevel: 9, stockStatus: 'Healthy' },
  { _id: 'inv-106', productId: 'p-106', productName: 'Smartwatch', warehouseId: 'wh-003', warehouseName: 'Coastal Store', currentStock: 9, availableStock: 5, reservedStock: 4, reorderLevel: 7, stockStatus: 'Low Stock' },
];

const orders = [
  { _id: 'ord-001', orderId: 'ORD-1001', customer: 'Aditi Verma', customerEmail: 'customer@retail.local', warehouse: 'North Hub', totalAmount: 3596, status: 'Packed', items: [{ productId: 'p-101', product: 'Wireless Mouse', quantity: 4, unitPrice: 899 }], paymentMethod: 'Cash on delivery', paymentStatus: 'Pending', shippingAddress: '14 Market Road, Delhi', createdAt: new Date().toISOString() },
  { _id: 'ord-002', orderId: 'ORD-1002', customer: 'Rahul Nair', customerEmail: 'rahul@demo.com', warehouse: 'Central Depot', totalAmount: 2199, status: 'Shipped' },
  { _id: 'ord-003', orderId: 'ORD-1003', customer: 'Meera Joshi', customerEmail: 'meera@demo.com', warehouse: 'Coastal Store', totalAmount: 1499, status: 'Delivered' },
  { _id: 'ord-004', orderId: 'ORD-1004', customer: 'Customer User', customerEmail: 'customer@retail.local', warehouse: 'North Hub', totalAmount: 6999, status: 'Processing', items: [{ productId: 'p-104', product: 'Office Chair', quantity: 1, unitPrice: 6999 }], paymentMethod: 'Cash on delivery', paymentStatus: 'Pending', shippingAddress: '14 Market Road, Delhi', createdAt: new Date().toISOString() },
];

const purchaseOrders = [
  { _id: 'po-001', poNumber: 'PO-1001', supplier: 'Northwind Supply', totalCost: 18500, status: 'Approved' },
  { _id: 'po-002', poNumber: 'PO-1002', supplier: 'Prime Goods', totalCost: 24200, status: 'In Transit' },
  { _id: 'po-003', poNumber: 'PO-1003', supplier: 'Metro Logistics', totalCost: 15600, status: 'Draft' },
];

function getDemoUser(email) {
  return users.find((user) => user.email === String(email).trim().toLowerCase()) || null;
}

function signDemoToken(user) {
  return jwt.sign({ email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
}

function getDashboardData() {
  const lowStock = inventory.filter((item) => item.availableStock <= item.reorderLevel);
  const trend = [
    { month: 'Jan', sales: 38000 },
    { month: 'Feb', sales: 44000 },
    { month: 'Mar', sales: 49000 },
    { month: 'Apr', sales: 56000 },
    { month: 'May', sales: 61000 },
    { month: 'Jun', sales: 67000 },
  ];

  return {
    kpis: [
      { title: 'Revenue', value: '₹1,28,000', change: '+10.4%', icon: 'trending-up', tone: 'blue' },
      { title: 'Orders', value: '342', change: '+8.2%', icon: 'shopping-cart', tone: 'green' },
      { title: 'Avg. Margin', value: '29.1%', change: '+1.8%', icon: 'percent', tone: 'amber' },
      { title: 'Stock health', value: '89%', change: '+3.4%', icon: 'boxes', tone: 'purple' },
    ],
    trend,
    inventoryMovement: [
      { name: 'Inbound', value: 140 },
      { name: 'Outbound', value: 95 },
      { name: 'Adjustments', value: 38 },
      { name: 'Returns', value: 20 },
    ],
    warehouseDistribution: [
      { name: 'North Hub', value: 36 },
      { name: 'Central Depot', value: 42 },
      { name: 'Coastal Store', value: 22 },
    ],
    topProducts: products.slice(0, 4).map((product, index) => ({ name: product.name, units: 48 + index * 11 })),
    recentOrders: orders.slice(0, 3).map((order) => ({ ...order, total: `₹${Number(order.totalAmount).toLocaleString('en-IN')}` })),
    transactions: [
      { type: 'Receipt', qty: '+18', product: 'Mechanical Keyboard', warehouse: 'North Hub' },
      { type: 'Transfer', qty: '-6', product: 'Portable Speaker', warehouse: 'Central Depot' },
      { type: 'Adjustment', qty: '+9', product: 'Smartwatch', warehouse: 'Coastal Store' },
    ],
    lowStock: lowStock.slice(0, 3).map((item) => ({ item: item.productName, warehouse: item.warehouseName, quantity: item.availableStock })),
  };
}

module.exports = {
  users,
  products,
  warehouses,
  suppliers,
  inventory,
  orders,
  purchaseOrders,
  getDemoUser,
  signDemoToken,
  getDashboardData,
};
