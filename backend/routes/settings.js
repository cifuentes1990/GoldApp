const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/settings  — public, used by frontend to load contact/social data
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'site' });
    if (!settings) settings = await Setting.create({ key: 'site' });
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// PUT /api/settings  — admin only
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const allowed = ['phone', 'whatsapp', 'instagram', 'facebook', 'tiktok', 'email', 'address', 'hours'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

    const settings = await Setting.findOneAndUpdate(
      { key: 'site' },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

module.exports = router;
