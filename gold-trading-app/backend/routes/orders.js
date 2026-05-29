const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/orders (user: own orders | admin: all orders)
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { user: req.user._id };
    if (status) filter.status = status;

    // Admin search: by orderNumber
    if (isAdmin && search) {
      filter.orderNumber = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    let query = Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const [orders, total] = await Promise.all([query, Order.countDocuments(filter)]);

    // If searching by client name (admin only), do a secondary filter client-side on populated name
    let result = orders;
    if (isAdmin && search && !/^ORD-/i.test(search)) {
      const User = require('../models/User');
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      const userIds = matchingUsers.map(u => u._id.toString());
      const filterByUser = { ...filter };
      delete filterByUser.orderNumber;
      filterByUser.user = { $in: matchingUsers.map(u => u._id) };
      const [byUser, byUserTotal] = await Promise.all([
        Order.find(filterByUser).populate('user','name email phone').populate('items.product','name image').sort('-createdAt').skip(skip).limit(Number(limit)),
        Order.countDocuments(filterByUser),
      ]);
      // Merge: prefer byUser results if there are more
      result = byUser.length >= orders.length ? byUser : orders;
      const mergedTotal = byUser.length >= orders.length ? byUserTotal : total;
      return res.json({ orders: result, total: mergedTotal, page: Number(page), pages: Math.ceil(mergedTotal / Number(limit)) });
    }

    res.json({ orders: result, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/admin/stats (admin) — must be before /:id
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalOrders, totalRevenue, recentOrders, ordersByStatus, monthlySales] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.find().populate('user', 'name email').populate('items.product', 'name').sort('-createdAt').limit(5),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      ordersByStatus,
      monthlySales,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image category');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes, currency } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'No items in order' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Atomic stock decrement: only succeeds if stock >= quantity
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, isActive: true, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
        { new: false } // return original doc to read price/name before update
      );
      if (!product) {
        // Rollback already-decremented products
        for (const rolled of orderItems) {
          await Product.findByIdAndUpdate(rolled.product, {
            $inc: { stock: rolled.quantity, soldCount: -rolled.quantity },
          });
        }
        const missing = await Product.findById(item.productId);
        const reason = !missing || !missing.isActive ? 'not found' : 'insufficient stock';
        return res.status(400).json({ error: `Product ${item.productId}: ${reason}` });
      }
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: product.price,
        weight: product.weight,
        purity: product.purity,
      });
    }

    const tax = subtotal * 0.0;
    const shipping = subtotal > 300 ? 0 : 15;
    const total = subtotal + tax + shipping;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      currency: currency || 'USD',
      status: 'paid',
      statusHistory: [{ status: 'pending', note: 'Order created' }, { status: 'paid', note: 'Payment processed (simulated)' }],
      shippingAddress,
      paymentMethod: paymentMethod || 'simulated',
      goldPriceAtOrder: req.body.goldSpotPrice,
      notes,
    });

    await order.populate('items.product', 'name image');
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.statusHistory.push({ status, note: note || `Estado actualizado a ${status}` });
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
