const router = require('express').Router();
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const ALLOWED_SORTS = ['-createdAt', 'createdAt', 'price', '-price', 'name', '-name', '-soldCount'];
    const rawSort = req.query.sort || '-createdAt';
    const sort = ALLOWED_SORTS.includes(rawSort) ? rawSort : '-createdAt';
    const { category, minPrice, maxPrice, purity, minWeight, maxWeight, featured, search, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (purity) filter.purity = Number(purity);
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minWeight || maxWeight) {
      filter.weight = {};
      if (minWeight) filter.weight.$gte = Number(minWeight);
      if (maxWeight) filter.weight.$lte = Number(maxWeight);
    }
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (admin)
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('weight').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('category').isIn(['anillo', 'collar', 'pulsera', 'aretes', 'cadena', 'dije']),
  body('purity').isIn([8, 10, 14, 18, 21, 22, 24]),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, description, category, weight, purity, purityLabel, price, stock, image, priceModifier, featured } = req.body;
    const product = await Product.create({ name, description, category, weight, purity, purityLabel, price, stock, image, priceModifier, featured });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, category, weight, purity, purityLabel, price, stock, image, priceModifier, featured, isActive } = req.body;
    const updates = { name, description, category, weight, purity, purityLabel, price, stock, image, priceModifier, featured, isActive };
    // Remove undefined keys so partial updates don't overwrite with undefined
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
