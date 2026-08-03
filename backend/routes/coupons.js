const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/coupons/validate — el cliente valida un código en el checkout
router.post('/validate', protect, [
  body('code').trim().notEmpty(),
  body('subtotal').isFloat({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos inválidos' });

  try {
    const code = String(req.body.code).toUpperCase().trim();
    const subtotal = Number(req.body.subtotal);
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ error: 'El código no existe.' });

    const result = coupon.evaluate(subtotal);
    if (!result.valid) return res.status(400).json({ error: result.reason });

    res.json({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      discount: result.discount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Admin CRUD ──────────────────────────────────────────────────────────────

// GET /api/coupons (admin) — lista todos
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/coupons (admin) — crear
router.post('/', protect, adminOnly, [
  body('code').trim().notEmpty(),
  body('value').isFloat({ min: 0 }),
  body('type').isIn(['percent', 'fixed']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Completa el código, tipo y valor.' });

  try {
    const { code, description, type, value, minPurchase, maxUses, expiresAt, isActive } = req.body;
    const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (exists) return res.status(409).json({ error: 'Ya existe un cupón con ese código.' });

    const coupon = await Coupon.create({
      code, description, type, value,
      minPurchase: minPurchase || 0,
      maxUses: maxUses || 0,
      expiresAt: expiresAt || null,
      isActive: isActive !== false,
    });
    res.status(201).json({ coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/coupons/:id (admin) — actualizar
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['description', 'type', 'value', 'minPurchase', 'maxUses', 'expiresAt', 'isActive'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ error: 'Cupón no encontrado' });
    res.json({ coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/coupons/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cupón eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
