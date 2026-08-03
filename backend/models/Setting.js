const mongoose = require('mongoose');

// Single-document store for site-wide settings.
// Uses a fixed key ('site') so there's always exactly one record.
const settingSchema = new mongoose.Schema({
  key: { type: String, default: 'site', unique: true },
  phone:     { type: String, default: '+57 300 123 4567' },
  whatsapp:  { type: String, default: '573001234567' },      // digits only, used in wa.me links
  instagram: { type: String, default: 'https://instagram.com' },
  facebook:  { type: String, default: 'https://facebook.com' },
  tiktok:    { type: String, default: 'https://tiktok.com/@giorgiojoyeria' },
  email:     { type: String, default: 'contacto@giorgiojoyeria.com' },
  address:   { type: String, default: 'Medellín, Antioquia, Colombia' },
  hours:     { type: String, default: 'Lun – Sáb: 8:00am – 7:00pm' },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
