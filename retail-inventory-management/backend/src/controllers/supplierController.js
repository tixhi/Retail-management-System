const { Supplier } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find().sort({ companyName: 1 }).lean();
  return res.json({ success: true, data: suppliers });
});

const createSupplier = asyncHandler(async (req, res) => {
  const { companyName, contactPerson, email, phone, address, paymentTerms } = req.body;

  if (!companyName || !contactPerson) {
    return res.status(400).json({ success: false, message: 'Company and contact person are required.' });
  }

  const supplier = await Supplier.create({
    companyName,
    contactPerson,
    email: email || '',
    phone: phone || '',
    address: address || '',
    productsSupplied: [],
    paymentTerms: paymentTerms || 'Net 30',
    status: 'Active',
  });

  return res.status(201).json({ success: true, message: 'Supplier created successfully.', data: supplier.toObject() });
});

module.exports = { listSuppliers, createSupplier };
