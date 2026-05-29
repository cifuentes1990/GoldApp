const router = require('express').Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
    ]);

    // Enrich with order stats
    const userIds = users.map(u => u._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: userIds }, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$user', orderCount: { $sum: 1 }, totalSpent: { $sum: '$total' } } },
    ]);
    const statsMap = {};
    orderStats.forEach(s => { statsMap[String(s._id)] = s; });
    const enriched = users.map(u => ({
      ...u,
      orderCount: statsMap[String(u._id)]?.orderCount || 0,
      totalSpent: statsMap[String(u._id)]?.totalSpent || 0,
    }));

    res.json({ users: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/role (admin)
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/status (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/admin/stats (admin)
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, newUsersThisMonth, topBuyers] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: '$user', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
      ]),
    ]);
    res.json({ totalUsers, newUsersThisMonth, topBuyers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
