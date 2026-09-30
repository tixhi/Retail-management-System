const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const mongoose = require('mongoose');
const inviteCode = 'test-only-admin-invite-code';
process.env.ADMIN_SIGNUP_CODE = inviteCode;
const app = require('../src/app');
const { JWT_SECRET } = require('../src/config/env');
const { User, Product, Inventory, Order } = require('../src/models');

test('Mongo-backed admin registration and customer order tracking', async (context) => {
  const originalReadyState = mongoose.connection.readyState;
  const originals = {
    userFindOne: User.findOne,
    userCreate: User.create,
    productFind: Product.find,
    inventoryFind: Inventory.find,
    inventoryUpdateOne: Inventory.updateOne,
    orderCreate: Order.create,
    orderFind: Order.find,
    orderFindOne: Order.findOne,
  };

  context.after(() => {
    delete mongoose.connection.readyState;
    assert.equal(mongoose.connection.readyState, originalReadyState);
    User.findOne = originals.userFindOne;
    User.create = originals.userCreate;
    Product.find = originals.productFind;
    Inventory.find = originals.inventoryFind;
    Inventory.updateOne = originals.inventoryUpdateOne;
    Order.create = originals.orderCreate;
    Order.find = originals.orderFind;
    Order.findOne = originals.orderFindOne;
  });

  Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, value: 1, writable: true });
  const users = new Map();
  const orders = [];
  const stock = {
    _id: 'stock-1',
    productId: 'product-1',
    productName: 'Test item',
    warehouseName: 'North Hub',
    availableStock: 8,
    reservedStock: 0,
    reorderLevel: 2,
    stockStatus: 'In Stock',
  };
  const product = { _id: 'product-1', name: 'Test item', price: 1250, status: 'Active' };

  const addUser = async (user) => {
    users.set(user.email, user);
  };
  const queryForUser = (email) => {
    const user = users.get(email) || null;
    const safeUser = user ? Object.fromEntries(Object.entries(user).filter(([key]) => key !== 'password')) : null;
    return {
      select() { return this; },
      lean() { return Promise.resolve(safeUser); },
      then(resolve, reject) { return Promise.resolve(user).then(resolve, reject); },
    };
  };

  await addUser({
    _id: 'admin-1',
    name: 'Bootstrap Admin',
    email: 'bootstrap@example.test',
    password: await bcrypt.hash('BootstrapPass123', 10),
    role: 'Admin',
    status: 'Active',
  });
  await addUser({
    _id: 'customer-1',
    name: 'Test Customer',
    email: 'customer@example.test',
    password: await bcrypt.hash('CustomerPass123', 10),
    role: 'Customer',
    status: 'Active',
  });

  User.findOne = (filter) => queryForUser(filter.email);
  User.create = async (fields) => {
    const user = { _id: `user-${users.size + 1}`, ...fields };
    await addUser(user);
    return { ...user, toObject() { return { ...user }; } };
  };
  Product.find = () => ({
    sort() { return this; },
    lean: async () => [product],
  });
  Inventory.find = () => ({ sort: async () => [stock] });
  Inventory.updateOne = async (filter, update) => {
    const quantity = update.$inc.availableStock;
    if (stock._id !== filter._id || stock.availableStock < -quantity) return { modifiedCount: 0 };
    stock.availableStock += quantity;
    stock.reservedStock += update.$inc.reservedStock;
    stock.stockStatus = update.$set.stockStatus;
    return { modifiedCount: 1 };
  };
  Order.create = async (fields) => {
    const order = { _id: `order-${orders.length + 1}`, ...fields };
    orders.unshift(order);
    return { ...order, toObject() { return { ...order }; } };
  };
  Order.find = (filter) => ({
    sort() {
      return {
        lean: async () => orders.filter((order) => order.customerEmail === filter.customerEmail),
      };
    },
  });
  Order.findOne = (filter) => ({
    lean: async () => {
      const [identity, owner] = filter.$and;
      return orders.find((order) =>
        (identity.$or.some((condition) => Object.values(condition)[0] === order._id || Object.values(condition)[0] === order.orderId))
        && order.customerEmail === owner.customerEmail
      ) || null;
    },
  });

  const adminToken = jwt.sign({ email: 'bootstrap@example.test', role: 'Admin', name: 'Bootstrap Admin' }, JWT_SECRET);
  const invalidSignup = await request(app)
    .post('/api/auth/signup-admin')
    .send({ name: 'Invalid Signup', email: 'invalid@example.test', password: 'LongSignupPassword123', inviteCode: 'wrong-code' });
  assert.equal(invalidSignup.status, 403);

  const signup = await request(app)
    .post('/api/auth/signup-admin')
    .send({ name: 'Signup Admin', email: 'signup-admin@example.test', password: 'SignupAdminPassword123', inviteCode });
  assert.equal(signup.status, 201);
  assert.equal(signup.body.data.user.role, 'Admin');
  assert.notEqual(users.get('signup-admin@example.test').password, 'SignupAdminPassword123');

  const signupLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'signup-admin@example.test', password: 'SignupAdminPassword123' });
  assert.equal(signupLogin.status, 200);
  assert.equal(signupLogin.body.data.user.role, 'Admin');

  const registered = await request(app)
    .post('/api/auth/register-admin')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'New Admin', email: 'new-admin@example.test', password: 'NewAdminPassword123' });
  assert.equal(registered.status, 201);
  assert.equal(users.get('new-admin@example.test').role, 'Admin');
  assert.notEqual(users.get('new-admin@example.test').password, 'NewAdminPassword123');

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'new-admin@example.test', password: 'NewAdminPassword123' });
  assert.equal(adminLogin.status, 200);
  assert.equal(adminLogin.body.data.user.role, 'Admin');

  const catalog = await request(app)
    .get('/api/products')
    .set('Authorization', `Bearer ${adminLogin.body.data.token}`);
  assert.equal(catalog.status, 200);
  assert.equal(catalog.body.data[0]._id, 'product-1');

  const customerToken = jwt.sign({ email: 'customer@example.test', role: 'Customer', name: 'Test Customer' }, JWT_SECRET);
  const checkout = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      customer: 'Forged name',
      totalAmount: 1,
      items: [{ productId: 'product-1', quantity: 2 }],
      shippingAddress: '1 Test Street',
    });
  assert.equal(checkout.status, 201);
  assert.equal(checkout.body.data.customer, 'Test Customer');
  assert.equal(checkout.body.data.totalAmount, 2500);
  assert.equal(checkout.body.data.status, 'Pending');
  assert.equal(stock.availableStock, 6);
  assert.equal(stock.stockStatus, 'In Stock');

  const customerOrders = await request(app).get('/api/my-orders').set('Authorization', `Bearer ${customerToken}`);
  assert.equal(customerOrders.status, 200);
  assert.equal(customerOrders.body.data.length, 1);

  const detail = await request(app)
    .get(`/api/my-orders/${checkout.body.data.orderId}`)
    .set('Authorization', `Bearer ${customerToken}`);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.data.items[0].unitPrice, 1250);

  const adminTokenForDetails = adminLogin.body.data.token;
  const hiddenDetail = await request(app)
    .get(`/api/my-orders/${checkout.body.data.orderId}`)
    .set('Authorization', `Bearer ${adminTokenForDetails}`);
  assert.equal(hiddenDetail.status, 403);
});