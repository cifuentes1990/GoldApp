const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  weight: Number,
  purity: Number,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
  },
  paymentMethod: { type: String, default: 'simulated' },
  paymentId: String,
  trackingNumber: { type: String, default: '' },
  notes: String,
  goldPriceAtOrder: Number,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    // timestamp + random hex — no DB query needed, collision-safe
    const rand = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    this.orderNumber = `ORD-${Date.now()}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
