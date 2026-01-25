const Product = require('../models/productModel');

const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error('Error:', err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server error';
    res.status(statusCode).json({ message });
  }
};

// @desc    Get all products with search, filter, and sorting
// @route   GET /api/products?search=keyword&category=name&sort=price_asc
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  
  // Build MongoDB query
  let query = {};
  
  // Search by product name (case-insensitive)
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  // Filter by category
  if (category) {
    query.category = category;
  }
  
  // Build sort object
  let sortOptions = {};
  if (sort === 'price_asc') {
    sortOptions.price = 1;
  } else if (sort === 'price_desc') {
    sortOptions.price = -1;
  }
  
  const products = await Product.find(query).sort(sortOptions);
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// @desc    Naya product create karna (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Product delete karna (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne(); 
  res.json({ message: 'Product deleted successfully' });
});

// @desc    Product update karna
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  product.name = name || product.name;
  product.price = price !== undefined ? price : product.price;
  product.description = description || product.description;
  product.image = image || product.image;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };
