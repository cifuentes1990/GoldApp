const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, trim: true, maxlength: 600 },
  verified: { type: Boolean, default: false },  // true si el usuario compró el producto
}, { timestamps: true });

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
  rating: { type: Number, default: 0, min: 0, max: 5 },   // promedio calculado
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
}, { timestamps: true });

// Recalcula el promedio y el conteo a partir de las reseñas
productSchema.methods.recalcRating = function () {
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.length
    ? Math.round((this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length) * 10) / 10
    : 0;
};

productSchema.index({ category: 1, price: 1, purity: 1 });
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 10, description: 3 } });

module.exports = mongoose.model('Product', productSchema);
