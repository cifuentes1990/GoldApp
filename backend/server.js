const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const priceRoutes = require('./routes/prices');

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── General Middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prices', priceRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Database & Server ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gold_trading')
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ─── Seed Database ─────────────────────────────────────────────────────────────
async function seedDatabase() {
  const User = require('./models/User');
  const Product = require('./models/Product');

  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'Admin Gold',
      email: 'admin@goldtrading.com',
      password: 'Admin1234!', // el hook pre('save') del modelo lo hashea automáticamente
      role: 'admin',
      isVerified: true,
      phone: '+57 300 000 0000',
      address: { street: 'Calle 1', city: 'Medellín', country: 'Colombia' },
    });
    console.log('✅ Admin user created → admin@goldtrading.com / Admin1234!');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: 'Anillo Solitario 18K',
        description: 'Elegante anillo solitario en oro amarillo 18 quilates. Diseño clásico y atemporal, acabado pulido a espejo. Disponible en tallas 6 a 10. Peso aproximado 4g.',
        category: 'anillo',
        weight: 4,
        purity: 18,
        purityLabel: '750',
        price: 580,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
        featured: true,
      },
      {
        name: 'Collar Corazón Filigrana 14K',
        description: 'Delicado collar con dije de corazón en filigrana de oro 14 quilates. Cadena tipo caja de 45 cm incluida. Ideal como regalo especial.',
        category: 'collar',
        weight: 3.5,
        purity: 14,
        purityLabel: '585',
        price: 320,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
        featured: true,
      },
      {
        name: 'Pulsera Esclava Pulida 18K',
        description: 'Pulsera esclava de oro 18K con acabado satinado y brillo en los bordes. Cierre de seguridad. Ancho 8mm, largo ajustable 18–20cm.',
        category: 'pulsera',
        weight: 12,
        purity: 18,
        purityLabel: '750',
        price: 750,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1573408301185-9519f94816a4?w=400&q=80',
        featured: true,
      },
      {
        name: 'Aretes Argolla Clásica 14K',
        description: 'Aretes de argolla lisa en oro 14 quilates. Diámetro 25mm, grosor 2mm. Cierre de palanca seguro. Diseño versátil para uso diario.',
        category: 'aretes',
        weight: 3,
        purity: 14,
        purityLabel: '585',
        price: 195,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&q=80',
        featured: false,
      },
      {
        name: 'Cadena Fígaro Italiana 18K',
        description: 'Cadena estilo fígaro en oro amarillo 18K, largo 50cm, ancho 4mm. Fabricación italiana con cierre de mosca. Brillo excepcional.',
        category: 'cadena',
        weight: 8,
        purity: 18,
        purityLabel: '750',
        price: 890,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80',
        featured: true,
      },
      {
        name: 'Dije Cruz Calada 14K',
        description: 'Dije de cruz calada en oro blanco 14 quilates. Diseño elegante con detalles en relieve. Dimensiones 20x13mm. Incluye cadena fina de 40cm.',
        category: 'dije',
        weight: 2,
        purity: 14,
        purityLabel: '585',
        price: 145,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
        featured: false,
      },
      {
        name: 'Anillo de Compromiso 18K',
        description: 'Anillo de compromiso en oro blanco 18K con zirconia central de 6mm y pavé de pequeñas piedras en los hombros. Acabado rhodiado.',
        category: 'anillo',
        weight: 5,
        purity: 18,
        purityLabel: '750',
        price: 1150,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
        featured: true,
      },
      {
        name: 'Pulsera de Tenis 18K',
        description: 'Elegante pulsera de tenis en oro 18K con zirconias redondas engastadas en montura de cuatro puntas. Largo 18cm, ancho 3mm.',
        category: 'pulsera',
        weight: 9,
        purity: 18,
        purityLabel: '750',
        price: 1380,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1611592981505-e3e01827e5c7?w=400&q=80',
        featured: true,
      },
      {
        name: 'Aretes Gota con Perla 14K',
        description: 'Aretes colgantes en forma de gota con perla cultivada blanca 7mm y montura en oro 14K. Largo total 3cm. Elegantes para ocasiones especiales.',
        category: 'aretes',
        weight: 2.5,
        purity: 14,
        purityLabel: '585',
        price: 260,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&q=80',
        featured: false,
      },
      {
        name: 'Collar Gargantilla Trenzada 18K',
        description: 'Gargantilla en trenza de oro amarillo 18K, largo 38cm, ancho 5mm. Cierre de langosta. Aspecto lujoso y moderno.',
        category: 'collar',
        weight: 7,
        purity: 18,
        purityLabel: '750',
        price: 980,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80',
        featured: false,
      },
    ]);
    console.log('✅ Joyas de muestra creadas');
  }
}
