import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Shield, Truck, Award, RefreshCw, CheckCircle, ChevronRight } from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'

// ─── Hero ────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* BG effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-500/6 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold-700/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(245,176,66,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(245,176,66,0.08) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
        {/* Decorative ring */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[420px] h-[420px] border border-gold-500/6 rounded-full hidden xl:block" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[280px] h-[280px] border border-gold-500/10 rounded-full hidden xl:block" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-[160px] h-[160px] border border-gold-500/15 rounded-full hidden xl:block" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/8 mb-8">
            <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-gold-400 text-xs font-semibold tracking-[0.15em] uppercase">Joyería Premium · Medellín, Colombia</span>
          </div>

          {/* Headline */}
          <h1 className="font-display tracking-widest leading-none mb-6">
            <span className="text-white text-6xl sm:text-7xl lg:text-8xl block">JOYAS QUE</span>
            <span className="gold-text glow-text text-6xl sm:text-7xl lg:text-8xl block">TE DEFINEN</span>
          </h1>

          <p className="text-lg text-gray-400 mb-4 max-w-xl leading-relaxed font-light">
            Prendas y joyas en <strong className="text-gold-400 font-semibold">oro 14K y 18K</strong> elaboradas artesanalmente. Diseños únicos, acabados de lujo y envío seguro a todo Colombia.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex -space-x-2">
              {['C','M','A','L'].map(l => (
                <div key={l} className="w-7 h-7 rounded-full bg-gold-gradient border-2 border-dark-600 flex items-center justify-center text-dark-600 text-xs font-bold">{l}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-gold-400 fill-gold-400" />)}
                <span className="text-xs text-gray-400 ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-gray-500">+2,400 clientes satisfechos</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalogo"
              className="btn-gold inline-flex items-center justify-center gap-2 px-9 py-4 text-sm font-bold rounded-xl">
              Ver colección <ArrowRight size={16} />
            </Link>
            <Link to="/nosotros"
              className="btn-outline inline-flex items-center justify-center gap-2 px-9 py-4 text-sm rounded-xl">
              Nuestra historia
            </Link>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="absolute bottom-12 right-6 hidden xl:flex flex-col gap-3">
          {[
            { label: 'Clientes satisfechos', value: '2.400+', icon: '😊' },
            { label: 'Diseños únicos', value: '150+', icon: '💎' },
            { label: 'Años de experiencia', value: '8+', icon: '⚜' },
          ].map(s => (
            <div key={s.label} className="glass-card px-4 py-3 text-right border border-gold-500/10 flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-base font-bold text-gold-400 font-mono">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust bar ───────────────────────────────────────────────────────────────
function TrustBar() {
  const items = [
    { icon: Shield, text: 'Oro certificado 14K y 18K' },
    { icon: Truck, text: 'Envío a toda Colombia' },
    { icon: Award, text: 'Empaque de regalo incluido' },
    { icon: RefreshCw, text: '30 días de garantía' },
  ]
  return (
    <section className="border-y border-white/5 bg-dark-500/30 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="trust-badge">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gold-400" />
              </div>
              <span className="text-xs text-gray-400 font-medium leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Categories ──────────────────────────────────────────────────────────────
const CATS = [
  { id: 'anillo',  label: 'Anillos',   emoji: '💍', desc: 'Solitarios, compromiso y diseño' },
  { id: 'collar',  label: 'Collares',  emoji: '📿', desc: 'Gargantillas y cadenas con dije' },
  { id: 'pulsera', label: 'Pulseras',  emoji: '✨', desc: 'Esclavas, tenis y cadenas' },
  { id: 'aretes',  label: 'Aretes',    emoji: '🌟', desc: 'Argollas, gotas y botón' },
  { id: 'cadena',  label: 'Cadenas',   emoji: '⛓', desc: 'Figaro, Rolo y tejidos' },
  { id: 'dije',    label: 'Dijes',     emoji: '🔮', desc: 'Cruces, corazones y símbolos' },
]

function CategoriesSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="section-tag">Explora</span>
        <h2 className="text-4xl font-display tracking-wider text-white">
          NUESTRAS <span className="gold-text">COLECCIONES</span>
        </h2>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
          Cada categoría elaborada con los más altos estándares de joyería artesanal
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATS.map(cat => (
          <Link key={cat.id} to={`/catalogo?category=${cat.id}`} className="category-card group block">
            <div className="p-5 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gold-500/8 border border-gold-500/15 flex items-center justify-center text-3xl group-hover:bg-gold-500/15 transition-colors">
                {cat.emoji}
              </div>
              <p className="font-semibold text-white text-sm mb-1">{cat.label}</p>
              <p className="text-xs text-gray-600 leading-tight hidden sm:block">{cat.desc}</p>
            </div>
            <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gold-gradient mx-0" />
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Featured products ───────────────────────────────────────────────────────
function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?featured=true&limit=4')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="section-tag">Lo más popular</span>
          <h2 className="text-4xl font-display tracking-wider text-white">
            JOYAS <span className="gold-text">DESTACADAS</span>
          </h2>
        </div>
        <Link to="/catalogo" className="btn-outline px-5 py-2.5 text-sm flex items-center gap-2 hidden sm:flex">
          Ver todo <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <div key={i} className="h-80 shimmer-bg rounded-2xl" />)
          : products.map(p => <ProductCard key={p._id} product={p} />)
        }
      </div>

      <div className="text-center mt-8 sm:hidden">
        <Link to="/catalogo" className="btn-outline px-6 py-2.5 text-sm inline-flex items-center gap-2">
          Ver toda la colección <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  )
}

// ─── How it works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', icon: '🔍', title: 'Explora la colección', desc: 'Navega nuestro catálogo de joyas en oro 14K y 18K. Filtra por categoría, pureza o precio.' },
    { n: '02', icon: '🛒', title: 'Agrega al carrito', desc: 'Selecciona tus piezas favoritas, elige la cantidad y procede al pago de forma segura.' },
    { n: '03', icon: '📦', title: 'Recibe en casa', desc: 'Enviamos a todo Colombia en 1 a 3 días hábiles, con empaque de regalo y certificado.' },
  ]
  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-tag">Proceso</span>
          <h2 className="text-4xl font-display tracking-wider text-white">
            ASÍ DE <span className="gold-text">FÁCIL</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
          {steps.map((s, i) => (
            <div key={i} className="step-card relative">
              <div className="absolute top-4 right-4 font-display text-5xl text-white/4 select-none">{s.n}</div>
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-3xl mx-auto mb-5">
                {s.icon}
              </div>
              <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── New arrivals ────────────────────────────────────────────────────────────
function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?sort=-createdAt&limit=4')
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="section-tag">Recién llegados</span>
          <h2 className="text-4xl font-display tracking-wider text-white">
            NUEVAS <span className="gold-text">LLEGADAS</span>
          </h2>
        </div>
        <Link to="/catalogo?sort=-createdAt" className="btn-outline px-5 py-2.5 text-sm flex items-center gap-2 hidden sm:flex">
          Ver más <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <div key={i} className="h-80 shimmer-bg rounded-2xl" />)
          : products.map(p => <ProductCard key={p._id} product={p} />)
        }
      </div>
    </section>
  )
}

// ─── Testimonials ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Valentina Ríos',
    city: 'Medellín',
    rating: 5,
    text: 'Compré un anillo de compromiso para mi pareja y quedó enamorada. La calidad del oro es impresionante y el empaque llegó precioso. ¡100% recomendado!',
    avatar: 'V',
    product: 'Anillo de Compromiso 18K',
  },
  {
    name: 'Camilo Herrera',
    city: 'Bogotá',
    rating: 5,
    text: 'Excelente servicio. El pedido llegó en 2 días a Bogotá, perfectamente empacado. La pulsera de tenis superó mis expectativas, brilla muchísimo.',
    avatar: 'C',
    product: 'Pulsera de Tenis 18K',
  },
  {
    name: 'Luisa Gómez',
    city: 'Cali',
    rating: 5,
    text: 'Llevo 3 años comprando en VELORA y siempre quedo satisfecha. Los aretes que pedí esta vez son hermosos y el certificado de autenticidad da mucha confianza.',
    avatar: 'L',
    product: 'Aretes Argolla 14K',
  },
]

function TestimonialsSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="section-tag">Opiniones</span>
        <h2 className="text-4xl font-display tracking-wider text-white">
          LO QUE DICEN <span className="gold-text">NUESTROS CLIENTES</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={14} className="text-gold-400 fill-gold-400" />
              ))}
            </div>
            {/* Quote */}
            <p className="text-gray-400 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
            {/* Product tag */}
            <p className="text-xs text-gold-500/70 mb-4 font-medium">— {t.product}</p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-dark-600 text-sm font-bold flex-shrink-0">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-gray-600">{t.city}, Colombia</p>
              </div>
              <CheckCircle size={14} className="text-green-400 ml-auto" title="Compra verificada" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── CTA Banner ──────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
        style={{ background: 'linear-gradient(135deg, #0D0900 0%, #1E1400 40%, #0D0900 100%)', border: '1px solid rgba(245,176,66,0.25)' }}>
        {/* BG decoration */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
          <span className="text-[18rem] select-none">⚜</span>
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <div className="relative">
          <span className="section-tag">Oferta especial</span>
          <h2 className="text-4xl sm:text-5xl font-display tracking-widest text-white mb-4">
            ENVÍO GRATIS EN TU <span className="gold-text">PRIMER PEDIDO</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
            Crea tu cuenta gratis, explora nuestra colección y recibe tu primera compra sin costo de envío, sin importar el valor.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/registro"
              className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold rounded-xl">
              Crear cuenta gratis <ArrowRight size={16} />
            </Link>
            <Link to="/contacto"
              className="btn-outline inline-flex items-center justify-center gap-2 px-10 py-4 text-sm rounded-xl">
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorks />
      <NewArrivals />
      <TestimonialsSection />
      <CTABanner />
    </div>
  )
}
