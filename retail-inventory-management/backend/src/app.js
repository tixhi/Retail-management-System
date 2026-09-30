const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorMiddleware');
const { JWT_SECRET } = require('./config/env');
const { products, warehouses, suppliers, inventory, orders, purchaseOrders, getDemoUser, getDashboardData } = require('./demoData');
const authRoutes = require('./routes/authRoutes');
const customerOrderRoutes = require('./routes/customerOrderRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy.', data: { status: 'ok' } });
});

app.get('/api/auth/me', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is missing or invalid.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = getDemoUser(decoded.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User is unavailable.' });
    }

    return res.json({ success: true, data: { name: user.name, email: user.email, role: user.role, status: user.status } });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
});

app.get('/api/products', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: products }));
app.get('/api/warehouses', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: warehouses }));
app.get('/api/suppliers', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: suppliers }));
app.get('/api/inventory', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: inventory }));
app.get('/api/orders', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: orders }));
app.get('/api/my-orders', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is missing or invalid.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const customerOrders = orders.filter((order) => order.customerEmail === decoded.email || order.customer === decoded.name || order.customerEmail === (decoded.email || '').toLowerCase());
    return res.json({ success: true, data: customerOrders });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
});
app.get('/api/my-orders/:orderId', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ success: false, message: 'Access token is missing or invalid.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const order = orders.find((item) =>
      (item.orderId === req.params.orderId || item._id === req.params.orderId)
      && (item.customerEmail === decoded.email || item.customer === decoded.name)
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
});
app.get('/api/purchase-orders', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: purchaseOrders }));
app.get('/api/reports/dashboard', (req, res, next) => mongoose.connection.readyState === 1 ? next('route') : res.json({ success: true, data: getDashboardData() }));

app.post('/api/products', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const body = req.body || {};
  const newProduct = { _id: `p-${Date.now()}`, ...body, status: body.status || 'In Stock', price: Number(body.price || 0), costPrice: Number(body.costPrice || 0), reorderLevel: Number(body.reorderLevel || 8) };
  products.unshift(newProduct);
  return res.status(201).json({ success: true, data: newProduct });
});

app.post('/api/suppliers', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const body = req.body || {};
  const newSupplier = { _id: `sup-${Date.now()}`, companyName: body.companyName || 'New Supplier', contact: body.contactPerson || body.contact || 'New Contact', contactPerson: body.contactPerson || body.contact || 'New Contact', email: body.email || '', phone: body.phone || '', status: 'Active' };
  suppliers.unshift(newSupplier);
  return res.status(201).json({ success: true, data: newSupplier });
});

app.post('/api/warehouses', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const body = req.body || {};
  const newWarehouse = { _id: `wh-${Date.now()}`, name: body.name || 'Warehouse', code: body.code || `WH-${warehouses.length + 1}`, city: body.city || 'Unknown', address: body.address || '', manager: body.manager || 'Unassigned', contactNumber: body.contactNumber || '', status: 'Active' };
  warehouses.unshift(newWarehouse);
  return res.status(201).json({ success: true, data: newWarehouse });
});

app.post('/api/orders', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const body = req.body || {};
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  let authenticatedUser;
  try {
    if (token) authenticatedUser = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }

  let orderItems = Array.isArray(body.items) ? body.items : [];
  let totalAmount = Number(body.totalAmount || 0);
  if (authenticatedUser?.role === 'Customer') {
    if (!orderItems.length || !body.shippingAddress?.trim()) {
      return res.status(400).json({ success: false, message: 'Add items and a shipping address before checkout.' });
    }

    orderItems = orderItems.map((item) => {
      const product = products.find((entry) => entry._id === item.productId);
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1) return null;
      return { productId: product._id, product: product.name, quantity, unitPrice: Number(product.price || 0) };
    });
    if (orderItems.some((item) => !item)) {
      return res.status(400).json({ success: false, message: 'One or more cart items are invalid.' });
    }

    for (const item of orderItems) {
      const availableStock = inventory
        .filter((entry) => entry.productId === item.productId)
        .reduce((total, entry) => total + Number(entry.availableStock || 0), 0);
      if (item.quantity > availableStock) {
        return res.status(400).json({ success: false, message: `Only ${availableStock} units of ${item.product} are available.` });
      }
    }

    totalAmount = orderItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }

  const customerName = authenticatedUser?.role === 'Customer' ? authenticatedUser.name : (body.customer || authenticatedUser?.name || 'Demo Customer');
  const customerEmail = authenticatedUser?.role === 'Customer' ? authenticatedUser.email : (body.customerEmail || authenticatedUser?.email || 'customer@retail.local');
  const newOrder = {
    _id: `ord-${Date.now()}`,
    orderId: `ORD-${Math.floor(2000 + Math.random() * 9000)}`,
    customer: customerName,
    customerEmail,
    warehouse: body.warehouse || 'North Hub',
    totalAmount,
    status: 'Processing',
    paymentMethod: body.paymentMethod || 'Cash on delivery',
    paymentStatus: 'Pending',
    shippingAddress: body.shippingAddress || '',
    createdAt: new Date().toISOString(),
    items: orderItems.length ? orderItems : [{ product: body.product || 'Catalog Item', quantity: Number(body.quantity || 1) }],
  };

  if (authenticatedUser?.role === 'Customer') {
    for (const item of orderItems) {
      let remaining = item.quantity;
      for (const stock of inventory.filter((entry) => entry.productId === item.productId)) {
        const reserved = Math.min(remaining, Number(stock.availableStock || 0));
        stock.availableStock -= reserved;
        stock.reservedStock = Number(stock.reservedStock || 0) + reserved;
        remaining -= reserved;
        if (remaining === 0) break;
      }
    }
  }
  orders.unshift(newOrder);
  return res.status(201).json({ success: true, data: newOrder });
});

app.post('/api/purchase-orders', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const body = req.body || {};
  const firstItem = (body.items && body.items[0]) || {};
  const totalCost = Number(firstItem.unitCost || 0) * Number(firstItem.quantity || 0);
  const newPurchaseOrder = { _id: `po-${Date.now()}`, poNumber: `PO-${Math.floor(2000 + Math.random() * 9000)}`, supplier: body.supplier || 'New Supplier', totalCost, status: 'Draft' };
  purchaseOrders.unshift(newPurchaseOrder);
  return res.status(201).json({ success: true, data: newPurchaseOrder });
});

app.post('/api/inventory/adjust', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const { productId, warehouseId, quantity, reason } = req.body || {};
  const target = inventory.find((item) => item.productId === productId && item.warehouseId === warehouseId);
  if (!target) return res.status(404).json({ success: false, message: 'Selected inventory item not found.' });
  const qty = Number(quantity || 0);
  target.currentStock += qty;
  target.availableStock += qty;
  target.stockStatus = target.availableStock <= target.reorderLevel ? 'Low Stock' : 'Healthy';
  return res.json({ success: true, data: target, message: reason || 'Stock adjusted.' });
});

app.post('/api/inventory/transfer', (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next('route');
  const { productId, sourceWarehouseId, destinationWarehouseId, quantity } = req.body || {};
  const source = inventory.find((item) => item.productId === productId && item.warehouseId === sourceWarehouseId);
  if (!source || source.availableStock < Number(quantity || 0)) {
    return res.status(400).json({ success: false, message: 'Not enough stock for transfer.' });
  }

  source.currentStock -= Number(quantity || 0);
  source.availableStock -= Number(quantity || 0);
  source.stockStatus = source.availableStock <= source.reorderLevel ? 'Low Stock' : 'Healthy';

  const destination = inventory.find((item) => item.productId === productId && item.warehouseId === destinationWarehouseId) || {
    _id: `inv-${Date.now()}`,
    productId,
    productName: products.find((product) => product._id === productId)?.name || 'Product',
    warehouseId: destinationWarehouseId,
    warehouseName: warehouses.find((warehouse) => warehouse._id === destinationWarehouseId)?.name || 'Destination Warehouse',
    currentStock: 0,
    availableStock: 0,
    reservedStock: 0,
    reorderLevel: 5,
    stockStatus: 'Healthy',
  };

  destination.currentStock += Number(quantity || 0);
  destination.availableStock += Number(quantity || 0);
  destination.stockStatus = destination.availableStock <= destination.reorderLevel ? 'Low Stock' : 'Healthy';

  if (!inventory.some((item) => item._id === destination._id)) {
    inventory.push(destination);
  }

  return res.json({ success: true, data: destination, message: 'Stock transferred successfully.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/my-orders', customerOrderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/reports', reportRoutes);
app.use(errorHandler);

module.exports = app;
