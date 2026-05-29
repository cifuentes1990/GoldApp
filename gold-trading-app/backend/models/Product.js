const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['anillo', 'collar', 'pulsera', 'aretes', 'cadena', 'dije'], required: true },
  weight: { type: Number, required: true, min: 0 },
  purity: { type: Number, required: true, enum: [8, 10, 14, 18, 21, 22, 24] },
  purityLabel: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  image: { type: String },
  images: [String],
  priceModifier: { type: Number, default: 1.05 },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  soldCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ user: String, comment: String, rating: Number, date: Date }],
}, { timestamps: true });

productSchema.index({ category: 1, price: 1, purity: 1 });
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 10, description: 3 } });

module.exports = mongoose.model('Product', productSchema);
