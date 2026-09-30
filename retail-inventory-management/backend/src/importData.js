const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { Product, Warehouse, Supplier, Inventory, Order, PurchaseOrder, Transaction } = require('./models');

const collections = {
  products: Product,
  warehouses: Warehouse,
  suppliers: Supplier,
  inventory: Inventory,
  orders: Order,
  purchaseOrders: PurchaseOrder,
  transactions: Transaction,
};

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Import file must contain a JSON object with named collection arrays.');
  }

  for (const [collectionName, records] of Object.entries(payload)) {
    if (!collections[collectionName]) throw new Error(`Unsupported collection: ${collectionName}.`);
    if (!Array.isArray(records)) throw new Error(`${collectionName} must be an array.`);
    for (const [index, record] of records.entries()) {
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new Error(`${collectionName}[${index}] must be an object.`);
      }
      if (!record.externalId || typeof record.externalId !== 'string') {
        throw new Error(`${collectionName}[${index}] requires a stable string externalId.`);
      }
      if (Object.hasOwn(record, 'password')) {
        throw new Error(`Passwords cannot be imported through ${collectionName}; use the account bootstrap or login integration.`);
      }
    }
  }
}

async function importData() {
  const fileArgument = process.argv[2];
  if (!fileArgument) throw new Error('Pass the path to a normalized JSON import file.');

  const filePath = path.resolve(process.cwd(), fileArgument);
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  validatePayload(payload);
  await connectDB();

  const results = {};
  for (const [collectionName, records] of Object.entries(payload)) {
    if (records.length === 0) {
      results[collectionName] = 0;
      continue;
    }

    const Model = collections[collectionName];
    const operations = [];
    for (const record of records) {
      const document = new Model({ ...record, _id: record.externalId, externalId: record.externalId });
      await document.validate();
      const update = document.toObject();
      delete update._id;
      operations.push({
        updateOne: {
          filter: { _id: record.externalId },
          update: { $set: update, $setOnInsert: { _id: record.externalId } },
          upsert: true,
        },
      });
    }

    const result = await Model.bulkWrite(operations, { ordered: true });
    results[collectionName] = result.upsertedCount + result.modifiedCount;
  }

  for (const [collectionName, count] of Object.entries(results)) {
    console.log(`${collectionName}: ${count} imported or updated`);
  }
}

importData()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
