const { Product } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');

const listProducts = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ name: new RegExp(escaped, 'i') }, { sku: new RegExp(escaped, 'i') }];
  }

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  return res.json({ success: true, data: products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  return res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, description, price, costPrice, reorderLevel, supplier, status } = req.body;

  if (!name || !sku || !category) {
    return res.status(400).json({ success: false, message: 'Name, SKU and category are required.' });
  }

  const product = await Product.create({
    name,
    sku,
    category,
    description: description || '',
    price: Number(price) || 0,
    costPrice: Number(costPrice) || 0,
    reorderLevel: Number(reorderLevel) || 0,
    supplier: supplier || 'Unassigned',
    status: status || 'Active',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
  });

  return res.status(201).json({ success: true, message: 'Product created successfully.', data: product.toObject() });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  return res.json({ success: true, message: 'Product updated successfully.', data: product.toObject() });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  return res.json({ success: true, message: 'Product deleted successfully.' });
});

module.exports = { listProducts, getProductById, createProduct, updateProduct, deleteProduct };
