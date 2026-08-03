const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, trim: true, default: '' },
  type:        { type: String, enum: ['percent', 'fixed'], default: 'percent' }, // % o monto fijo USD
  value:       { type: Number, required: true, min: 0 },                          // 10 = 10% o $10
  minPurchase: { type: Number, default: 0 },                                      // compra mínima en USD
  maxUses:     { type: Number, default: 0 },                                      // 0 = ilimitado
  usedCount:   { type: Number, default: 0 },
  expiresAt:   { type: Date },                                                    // null = sin vencimiento
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Evalúa si el cupón es aplicable a un subtotal dado. Devuelve { valid, reason?, discount? }
couponSchema.methods.evaluate = function (subtotal) {
  if (!this.isActive) return { valid: false, reason: 'Este cupón ya no está activo.' };
  if (this.expiresAt && this.expiresAt < new Date()) return { valid: false, reason: 'Este cupón ha expirado.' };
  if (this.maxUses > 0 && this.usedCount >= this.maxUses) return { valid: false, reason: 'Este cupón alcanzó su límite de usos.' };
  if (subtotal < this.minPurchase) {
    return { valid: false, reason: `Compra mínima de $${this.minPurchase.toFixed(2)} para usar este cupón.` };
  }
  let discount = this.type === 'percent'
    ? subtotal * (this.value / 100)
    : this.value;
  discount = Math.min(discount, subtotal); // el descuento nunca supera el subtotal
  discount = Math.round(discount * 100) / 100;
  return { valid: true, discount };
};

module.exports = mongoose.model('Coupon', couponSchema);
