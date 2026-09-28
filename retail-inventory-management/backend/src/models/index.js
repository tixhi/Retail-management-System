const mongoose = require('mongoose');

const { Schema } = mongoose;
const options = { timestamps: true, strict: false, versionKey: false };

function defineModel(name, fields, indexes = []) {
  const schema = new Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    ...fields,
  }, options);

  for (const index of indexes) {
    schema.index(index.fields, index.options);
  }

  return mongoose.models[name] || mongoose.model(name, schema);
}

const User = defineModel('User', {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'Active' },
}, [{ fields: { email: 1 }, options: { unique: true } }]);

const Product = defineModel('Product', {
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, default: 0, min: 0 },
  costPrice: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },
  supplier: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  image: { type: String, default: '' },
  externalId: { type: String, default: '' },
}, [{ fields: { sku: 1 }, options: { unique: true } }]);

const Warehouse = defineModel('Warehouse', {
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  manager: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  status: { type: String, default: 'Active' },
  externalId: { type: String, default: '' },
}, [{ fields: { code: 1 }, options: { unique: true } }]);

const Supplier = defineModel('Supplier', {
  companyName: { type: String, required: true, trim: true },
  contactPerson: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  productsSupplied: { type: [String], default: [] },
  paymentTerms: { type: String, default: 'Net 30' },
  status: { type: String, default: 'Active' },
  externalId: { type: String, default: '' },
});

const Inventory = defineModel('Inventory', {
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  warehouseId: { type: String, required: true },
  warehouseName: { type: String, required: true },
  currentStock: { type: Number, default: 0, min: 0 },
  availableStock: { type: Number, default: 0, min: 0 },
  reservedStock: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },
  stockStatus: { type: String, default: 'In Stock' },
  externalId: { type: String, default: '' },
}, [{ fields: { productId: 1, warehouseId: 1 }, options: { unique: true } }]);

const Order = defineModel('Order', {
  orderId: { type: String, required: true },
  customer: { type: String, required: true },
  items: { type: [Schema.Types.Mixed], default: [] },
  warehouse: { type: String, default: '' },
  totalAmount: { type: Number, default: 0, min: 0 },
  status: { type: String, default: 'Pending' },
  paymentStatus: { type: String, default: 'Pending' },
  fulfillmentStatus: { type: String, default: 'Pending' },
  externalId: { type: String, default: '' },
}, [{ fields: { orderId: 1 }, options: { unique: true } }]);

const PurchaseOrder = defineModel('PurchaseOrder', {
  poNumber: { type: String, required: true },
  supplier: { type: String, required: true },
  status: { type: String, default: 'Draft' },
  items: { type: [Schema.Types.Mixed], default: [] },
  totalCost: { type: Number, default: 0, min: 0 },
  expectedDelivery: { type: Date },
  externalId: { type: String, default: '' },
}, [{ fields: { poNumber: 1 }, options: { unique: true } }]);

const Transaction = defineModel('Transaction', {
  type: { type: String, required: true },
  product: { type: String, default: '' },
  warehouse: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  reason: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  externalId: { type: String, default: '' },
});

module.exports = { User, Product, Warehouse, Supplier, Inventory, Order, PurchaseOrder, Transaction };
