const { Warehouse } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().sort({ name: 1 }).lean();
  return res.json({ success: true, data: warehouses });
});

const createWarehouse = asyncHandler(async (req, res) => {
  const { name, code, address, city, manager, contactNumber } = req.body;

  if (!name || !code || !city) {
    return res.status(400).json({ success: false, message: 'Warehouse name, code and city are required.' });
  }

  const warehouse = await Warehouse.create({
    name,
    code,
    address: address || '',
    city,
    manager: manager || 'Unassigned',
    contactNumber: contactNumber || '',
    status: 'Active',
  });

  return res.status(201).json({ success: true, message: 'Warehouse created successfully.', data: warehouse.toObject() });
});

module.exports = { listWarehouses, createWarehouse };
