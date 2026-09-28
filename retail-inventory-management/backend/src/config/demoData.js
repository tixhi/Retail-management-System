const bcrypt = require('bcryptjs');
const createId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const demoStore = {
  users: [
    { _id: createId('user'), name: 'Admin User', email: 'admin@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Admin', status: 'Active' },
    { _id: createId('user'), name: 'Harish Kumar', email: 'inventory@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Inventory Manager', status: 'Active' },
    { _id: createId('user'), name: 'Meera Shah', email: 'sales@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Sales Staff', status: 'Active' },
    { _id: createId('user'), name: 'Amit Joshi', email: 'procurement@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Procurement Manager', status: 'Active' },
    { _id: createId('user'), name: 'Sonal Patil', email: 'warehouse@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Warehouse Staff', status: 'Active' },
    { _id: createId('user'), name: 'Deepak Nair', email: 'management@example.com', password: bcrypt.hashSync('Admin@123', 10), role: 'Management', status: 'Active' },
  ],
  categories: [
    { _id: createId('cat'), name: 'Laptops', description: 'Portable computing devices', status: 'Active' },
    { _id: createId('cat'), name: 'Accessories', description: 'Peripheral devices and components', status: 'Active' },
    { _id: createId('cat'), name: 'Displays', description: 'Monitors and screen displays', status: 'Active' },
    { _id: createId('cat'), name: 'Networking', description: 'Routers and network devices', status: 'Active' },
    { _id: createId('cat'), name: 'Printing', description: 'Printers and consumables', status: 'Active' },
    { _id: createId('cat'), name: 'Audio', description: 'Headphones and audio devices', status: 'Active' },
    { _id: createId('cat'), name: 'Power', description: 'Chargers and power banks', status: 'Active' },
    { _id: createId('cat'), name: 'Cables', description: 'Connectivity and charging cables', status: 'Active' },
  ],
  suppliers: [
    { _id: createId('sup'), companyName: 'TechSource India', contactPerson: 'Rahul Verma', email: 'rahul@techsource.in', phone: '+91 9876543210', address: 'Bengaluru', productsSupplied: ['Laptops', 'Accessories'], paymentTerms: 'Net 30', status: 'Active' },
    { _id: createId('sup'), companyName: 'Northwind Components', contactPerson: 'Sonia Iyer', email: 'sonia@northwind.in', phone: '+91 9988776655', address: 'Mumbai', productsSupplied: ['Displays', 'Networking'], paymentTerms: 'Net 45', status: 'Active' },
    { _id: createId('sup'), companyName: 'Metro Supplies', contactPerson: 'Deepak Rao', email: 'deepak@metrosupplies.in', phone: '+91 9811122233', address: 'Delhi', productsSupplied: ['Printing', 'Power'], paymentTerms: 'Net 15', status: 'Active' },
  ],
  warehouses: [
    { _id: createId('wh'), name: 'Mumbai Central', code: 'MUM', address: 'Andheri East', city: 'Mumbai', manager: 'Asha Kulkarni', contactNumber: '+91 9876500001', status: 'Active' },
    { _id: createId('wh'), name: 'Bengaluru Hub', code: 'BLR', address: 'Whitefield', city: 'Bengaluru', manager: 'Rohit Nair', contactNumber: '+91 9876500002', status: 'Active' },
    { _id: createId('wh'), name: 'Delhi West', code: 'DEL', address: 'Dwarka', city: 'Delhi', manager: 'Neha Sharma', contactNumber: '+91 9876500003', status: 'Active' },
  ],
  products: [
    { _id: createId('prod'), name: 'Dell Inspiron 14', sku: 'DL-INS-14', category: 'Laptops', description: '14-inch business laptop with 16GB RAM', price: 68900, costPrice: 53400, reorderLevel: 12, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'HP EliteBook 840', sku: 'HP-EL-840', category: 'Laptops', description: 'Enterprise workstation laptop', price: 74900, costPrice: 58200, reorderLevel: 10, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Wireless Mouse', sku: 'LOG-MX-01', category: 'Accessories', description: 'Wireless ergonomic mouse', price: 5999, costPrice: 3800, reorderLevel: 25, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Mechanical Keyboard', sku: 'KEY-MECH-01', category: 'Accessories', description: 'Compact mechanical keyboard', price: 8999, costPrice: 6100, reorderLevel: 20, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: '24-inch Monitor', sku: 'HP-M24', category: 'Displays', description: 'Full HD monitor for retail counters', price: 12999, costPrice: 9800, reorderLevel: 15, supplier: 'Northwind Components', status: 'Active', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'USB-C Cable', sku: 'USB-C-001', category: 'Cables', description: 'High-speed USB C charging cable', price: 799, costPrice: 480, reorderLevel: 30, supplier: 'Northwind Components', status: 'Active', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Power Bank', sku: 'PB-20000', category: 'Power', description: '20000mAh power bank for mobile devices', price: 2499, costPrice: 1650, reorderLevel: 18, supplier: 'Metro Supplies', status: 'Active', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9c1d1f', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Bluetooth Headphones', sku: 'HP-HP-001', category: 'Audio', description: 'Wireless Bluetooth over-ear headphones', price: 3799, costPrice: 2150, reorderLevel: 16, supplier: 'Metro Supplies', status: 'Active', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Webcam', sku: 'WEB-CAM-01', category: 'Accessories', description: '1080p webcam for workstations', price: 3499, costPrice: 2300, reorderLevel: 14, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Printer', sku: 'PRN-ALX-01', category: 'Printing', description: 'Office laser printer', price: 19999, costPrice: 14900, reorderLevel: 8, supplier: 'Metro Supplies', status: 'Active', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'Router', sku: 'RT-AX-01', category: 'Networking', description: 'Dual-band Wi-Fi router', price: 7999, costPrice: 5600, reorderLevel: 12, supplier: 'Northwind Components', status: 'Active', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3', createdAt: new Date().toISOString() },
    { _id: createId('prod'), name: 'USB Hub', sku: 'USB-HUB-04', category: 'Accessories', description: 'Multi-port USB hub', price: 1899, costPrice: 1250, reorderLevel: 20, supplier: 'TechSource India', status: 'Active', image: 'https://images.unsplash.com/photo-1555618560-d29f4c8d80d5', createdAt: new Date().toISOString() },
  ],
  inventory: [
    { _id: createId('inv'), productId: 'prod_1', productName: 'Dell Inspiron 14', warehouseId: 'wh_1', warehouseName: 'Mumbai Central', currentStock: 26, availableStock: 22, reservedStock: 4, reorderLevel: 12, stockStatus: 'In Stock' },
    { _id: createId('inv'), productId: 'prod_2', productName: 'Wireless Mouse', warehouseId: 'wh_2', warehouseName: 'Bengaluru Hub', currentStock: 18, availableStock: 15, reservedStock: 3, reorderLevel: 20, stockStatus: 'Low Stock' },
    { _id: createId('inv'), productId: 'prod_3', productName: '24-inch Monitor', warehouseId: 'wh_3', warehouseName: 'Delhi West', currentStock: 8, availableStock: 6, reservedStock: 2, reorderLevel: 15, stockStatus: 'Low Stock' },
    { _id: createId('inv'), productId: 'prod_4', productName: 'Power Bank', warehouseId: 'wh_1', warehouseName: 'Mumbai Central', currentStock: 7, availableStock: 6, reservedStock: 1, reorderLevel: 18, stockStatus: 'Low Stock' },
    { _id: createId('inv'), productId: 'prod_5', productName: 'Router', warehouseId: 'wh_2', warehouseName: 'Bengaluru Hub', currentStock: 5, availableStock: 3, reservedStock: 2, reorderLevel: 12, stockStatus: 'Low Stock' },
    { _id: createId('inv'), productId: 'prod_6', productName: 'Printer', warehouseId: 'wh_3', warehouseName: 'Delhi West', currentStock: 0, availableStock: 0, reservedStock: 0, reorderLevel: 8, stockStatus: 'Out of Stock' },
  ],
  orders: [
    { _id: createId('ord'), orderId: 'ORD-1001', customer: 'Aarav Retail', items: [{ product: 'Dell Inspiron 14', quantity: 2 }], warehouse: 'Mumbai Central', totalAmount: 137800, status: 'Confirmed', paymentStatus: 'Paid', fulfillmentStatus: 'Processing' },
    { _id: createId('ord'), orderId: 'ORD-1002', customer: 'CityHub', items: [{ product: 'Wireless Mouse', quantity: 18 }], warehouse: 'Bengaluru Hub', totalAmount: 107982, status: 'Packed', paymentStatus: 'Paid', fulfillmentStatus: 'Packed' },
    { _id: createId('ord'), orderId: 'ORD-1003', customer: 'Karnataka Mart', items: [{ product: '24-inch Monitor', quantity: 4 }], warehouse: 'Delhi West', totalAmount: 51996, status: 'Shipped', paymentStatus: 'Pending', fulfillmentStatus: 'Dispatched' },
  ],
  purchaseOrders: [
    { _id: createId('po'), poNumber: 'PO-2281', supplier: 'TechSource India', status: 'Approved', items: [{ product: 'Dell Inspiron 14', quantity: 25, unitCost: 53400 }], totalCost: 1335000, expectedDelivery: '2026-10-12' },
    { _id: createId('po'), poNumber: 'PO-2286', supplier: 'Northwind Components', status: 'Submitted', items: [{ product: '24-inch Monitor', quantity: 30, unitCost: 9800 }], totalCost: 294000, expectedDelivery: '2026-10-15' },
  ],
  transactions: [
    { _id: createId('txn'), type: 'Stock In', quantity: 40, product: 'Wireless Mouse', warehouse: 'Bengaluru Hub', date: new Date().toISOString() },
    { _id: createId('txn'), type: 'Transfer', quantity: 18, product: 'Keyboard', warehouse: 'Delhi West', date: new Date().toISOString() },
    { _id: createId('txn'), type: 'Adjustment', quantity: 6, product: 'Monitor', warehouse: 'Bengaluru Hub', date: new Date().toISOString() },
  ],
};

module.exports = { demoStore, createId };
