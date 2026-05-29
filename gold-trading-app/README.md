# ⚜ AURUM — Gold Trading Platform

> Plataforma premium de comercialización de oro con diseño futurista. Lingotes, monedas y joyas de inversión certificadas.

![Stack](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)
![Stack](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)
![Stack](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)

---

## 🏗 Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | React 18 + Vite + TailwindCSS | Ecosistema maduro, HMR ultrarrápido, utilidades CSS |
| **Backend** | Node.js + Express.js | Liviano, rápido, perfecto para APIs REST |
| **Base de datos** | MongoDB + Mongoose | Flexibilidad de esquema ideal para catálogos de productos |
| **Autenticación** | JWT (jsonwebtoken) | Stateless, escalable, compatible con múltiples clientes |
| **Seguridad** | bcryptjs, helmet, express-rate-limit | Hashing seguro, headers HTTP, protección DDoS |
| **Gráficos** | Chart.js + react-chartjs-2 | Visualización profesional de precios |

---

## 📁 Estructura del Proyecto

```
aurum-gold-trading/
├── 📦 package.json              ← Scripts raíz (monorepo)
├── 📖 README.md
│
├── 🖥 backend/
│   ├── server.js               ← Entry point + seed DB
│   ├── .env.example            ← Variables de entorno
│   ├── package.json
│   ├── models/
│   │   ├── User.js             ← Modelo de usuario con bcrypt
│   │   ├── Product.js          ← Catálogo de productos
│   │   └── Order.js            ← Pedidos con historial de estados
│   ├── routes/
│   │   ├── auth.js             ← Register, Login, Me, Profile
│   │   ├── products.js         ← CRUD productos (admin + público)
│   │   ├── orders.js           ← Pedidos + stats admin
│   │   ├── users.js            ← Gestión usuarios (admin)
│   │   └── prices.js           ← Precio spot XAU/USD + historial
│   └── middleware/
│       └── auth.js             ← protect + adminOnly
│
└── 🌐 frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx             ← Router principal
        ├── index.css           ← Design system completo
        ├── utils/api.js        ← Axios con interceptors JWT
        ├── contexts/
        │   ├── AuthContext.jsx ← Auth global + localStorage
        │   └── CartContext.jsx ← Carrito persistente
        ├── components/
        │   ├── layout/
        │   │   ├── MainLayout.jsx   ← Navbar + Footer
        │   │   └── AdminLayout.jsx  ← Sidebar admin responsive
        │   └── ui/
        │       ├── ProductCard.jsx  ← Tarjeta con hover effect
        │       └── GoldChart.jsx    ← Gráfico Chart.js
        └── pages/
            ├── HomePage.jsx         ← Hero + Features + CTA
            ├── CatalogPage.jsx      ← Filtros avanzados + paginación
            ├── ProductPage.jsx      ← Detalle con cálculo de valor
            ├── CartPage.jsx         ← Carrito interactivo
            ├── CheckoutPage.jsx     ← Formulario + conversor moneda
            ├── OrdersPage.jsx       ← Historial de pedidos
            ├── OrderDetailPage.jsx  ← Detalle + stepper de estado
            ├── ProfilePage.jsx      ← Perfil + cambio contraseña
            ├── LoginPage.jsx        ← Login + Register
            └── admin/
                ├── AdminDashboard.jsx ← Stats + Charts + resumen
                ├── AdminProducts.jsx  ← CRUD productos + modal
                ├── AdminOrders.jsx    ← Gestión + cambio de estado
                └── AdminUsers.jsx     ← Roles + activación/eliminación
```

---

## ⚡ Inicio Rápido

### Prerequisitos

- **Node.js** ≥ 18.x
- **MongoDB** corriendo localmente en `mongodb://localhost:27017`  
  → O una URL de [MongoDB Atlas](https://www.mongodb.com/atlas) gratuita

### 1. Clonar e instalar dependencias

```bash
# Instalar todas las dependencias (backend + frontend)
npm run install:all

# O manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gold_trading
JWT_SECRET=tu_clave_super_secreta_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Importante**: Cambia `JWT_SECRET` por una cadena aleatoria larga y segura en producción.

### 3. Iniciar la aplicación

```bash
# Opción A: Ambos servidores simultáneamente (requiere concurrently)
npm install  # instala concurrently en raíz
npm run dev

# Opción B: Terminales separadas
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### 4. Acceder a la aplicación

| Servicio | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:5173 |
| 🔌 Backend API | http://localhost:5000/api |
| ❤️ Health check | http://localhost:5000/api/health |

---

## 🔑 Credenciales de Prueba

Al iniciar el servidor por primera vez, se crean automáticamente:

### Administrador
```
Email:    admin@goldtrading.com
Password: Admin1234!
```

### Cliente (crear desde /registro)
```
URL: http://localhost:5173/registro
```

---

## 🚀 API Endpoints

### Auth
```
POST   /api/auth/register       → Registro
POST   /api/auth/login          → Login → JWT
GET    /api/auth/me             → Perfil propio [auth]
PUT    /api/auth/profile        → Actualizar perfil [auth]
PUT    /api/auth/change-password → Cambiar contraseña [auth]
```

### Products (Públicos)
```
GET    /api/products            → Catálogo con filtros
GET    /api/products/:id        → Detalle producto
POST   /api/products            → Crear [admin]
PUT    /api/products/:id        → Editar [admin]
DELETE /api/products/:id        → Eliminar (soft) [admin]
```

### Orders
```
GET    /api/orders              → Mis pedidos [auth] / Todos [admin]
GET    /api/orders/:id          → Detalle [auth]
POST   /api/orders              → Crear pedido [auth]
PATCH  /api/orders/:id/status   → Cambiar estado [admin]
GET    /api/orders/admin/stats  → Estadísticas [admin]
```

### Users (Admin)
```
GET    /api/users               → Listar usuarios [admin]
PATCH  /api/users/:id/role      → Cambiar rol [admin]
PATCH  /api/users/:id/status    → Activar/desactivar [admin]
DELETE /api/users/:id           → Eliminar [admin]
GET    /api/users/admin/stats   → Estadísticas usuarios [admin]
```

### Prices
```
GET    /api/prices/gold         → Precio spot XAU/USD (caché 5min)
GET    /api/prices/history      → Historial 12 meses (simulado)
```

---

## 🎨 Design System

**Paleta de colores:**
```css
--gold:      #F5B042   /* Acento principal */
--gold-dark: #C8860A   /* Hover / activo */
--dark-bg:   #0A0A0A   /* Fondo base */
--dark-card: #141414   /* Tarjetas */
--glass:     rgba(255,255,255,0.04)  /* Glassmorphism */
```

**Tipografía:**
- Display: `Bebas Neue` (títulos dramáticos)
- Body: `Montserrat` (legibilidad premium)
- Mono: `JetBrains Mono` (precios, códigos)

**Componentes reutilizables:**
- `.gold-text` — degradado dorado en texto
- `.glass-card` — glassmorphism con blur
- `.btn-gold` — botón dorado con efecto shimmer
- `.product-card` — hover lift + glow border
- `.badge-*` — etiquetas de estado por color
- `.shimmer-bg` — skeleton loading

---

## 🛡 Seguridad Implementada

| Medida | Descripción |
|--------|-----------|
| **bcryptjs** | Hashing de contraseñas con salt rounds 12 |
| **JWT** | Tokens firmados con expiración configurable |
| **helmet** | Headers HTTP seguros (CSP, HSTS, etc.) |
| **express-rate-limit** | Límite 200 req / 15min por IP |
| **express-validator** | Validación y sanitización de inputs |
| **CORS** | Restricción de origen configurable |
| **Soft delete** | Productos se desactivan, no se eliminan |

---

## 🌐 Despliegue en Producción

### Backend (Railway / Render / Fly.io)
```bash
# Variables de entorno en plataforma:
NODE_ENV=production
MONGODB_URI=mongodb+srv://...   # Atlas
JWT_SECRET=clave_muy_segura
FRONTEND_URL=https://tu-dominio.com
```

### Frontend (Vercel / Netlify)
```bash
npm run build
# Servir carpeta: frontend/dist
# Variable: VITE_API_URL=https://tu-api.com
```

> Para Vercel/Netlify, actualiza `frontend/src/utils/api.js` baseURL a tu URL de producción.

---

## 📄 Licencia

MIT — Libre para uso personal y comercial.

---

*Construido con ⚜ por AURUM — La plataforma premium de metales preciosos*
