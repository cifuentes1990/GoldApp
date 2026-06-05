import { useState, useEffect, useRef, Suspense, lazy, Component, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Star, Shield, Truck, Award, RefreshCw, CheckCircle,
  ChevronRight, ChevronLeft, Zap, Heart, Gift, Gem, Clock, Mail,
  TrendingUp, Users, Package, Sparkles, Eye, BarChart2, Droplets,
  Sun, Wind, ShieldCheck, Ruler, MessageCircle, Phone, MapPin,
  CreditCard, Lock, Wifi, Smartphone, Timer, Flame, BadgeCheck,
  Search as SearchIcon, X, ChevronDown, Star as StarFill,
} from 'lucide-react'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'
import SearchBar from '../components/ui/SearchBar'
import QuickViewModal from '../components/ui/QuickViewModal'
import CompareBar from '../components/ui/CompareBar'

const GoldRing3D = lazy(() => import('../components/ui/GoldRing3D'))

// ─── Error boundary ──────────────────────────────────────────────────────────
class Ring3DBoundary extends Component {
  constructor(p) { super(p); this.state = { err: false } }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? null : this.props.children }
}

// ─── Scroll-reveal hook ──────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return { val, ref }
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(hoursFromNow = 24) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const end = new Date()
    end.setHours(end.getHours() + hoursFromNow)
    const tick = () => {
      const diff = Math.max(0, end - Date.now())
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [hoursFromNow])
  return time
}

// ─── Floating gold particles ─────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i, size: 2 + Math.random() * 4,
  left: Math.random() * 100, top: Math.random() * 100,
  delay: Math.random() * 8, dur: 6 + Math.random() * 8,
  opacity: 0.08 + Math.random() * 0.3,
}))

// ═══════════════════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="relative min-h-[96vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-700/4 rounded-full blur-[90px] animate-pulse" style={{ animationDelay:'1.5s' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage:'linear-gradient(rgba(245,176,66,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,176,66,0.1) 1px,transparent 1px)',
          backgroundSize:'64px 64px'
        }} />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full bg-gold-400"
            style={{ width:p.size, height:p.size, left:`${p.left}%`, top:`${p.top}%`,
              opacity:p.opacity, animation:`float3d ${p.dur}s ease-in-out ${p.delay}s infinite` }} />
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block pointer-events-none">
        <Ring3DBoundary>
          <Suspense fallback={null}>
            <GoldRing3D />
          </Suspense>
        </Ring3DBoundary>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full z-10">
        <div className="max-w-2xl lg:max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/30 bg-gold-500/8 mb-6">
            <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
            <span className="text-gold-400 text-xs font-semibold tracking-[0.15em] uppercase">Joyería Premium · Medellín, Colombia</span>
          </div>

          <h1 className="font-display tracking-widest leading-none mb-5" style={{ perspective:'600px' }}>
            <span className="text-white text-6xl sm:text-7xl lg:text-8xl block hero-text-3d">JOYAS QUE</span>
            <span className="gold-text glow-text text-6xl sm:text-7xl lg:text-8xl block hero-text-3d" style={{ animationDelay:'0.15s' }}>TE DEFINEN</span>
          </h1>

          <p className="text-base text-gray-400 mb-6 max-w-lg leading-relaxed font-light">
            Prendas en <strong className="text-gold-400 font-semibold">oro 14K y 18K</strong> elaboradas artesanalmente. Diseños únicos, acabados de lujo y envío seguro a todo Colombia.
          </p>

          {/* ── SEARCH BAR in hero ── */}
          <div className="mb-7 max-w-lg">
            <SearchBar size="large" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {['C','M','A','L'].map(l => (
                <div key={l} className="w-7 h-7 rounded-full bg-gold-gradient border-2 border-dark-600 flex items-center justify-center text-dark-600 text-xs font-bold">{l}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_,i) => <Star key={i} size={12} className="text-gold-400 fill-gold-400" />)}
                <span className="text-xs text-gray-400 ml-1">4.9/5</span>
              </div>
              <p className="text-xs text-gray-500">+2,400 clientes satisfechos</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/catalogo" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold rounded-xl">
              Ver colección <ArrowRight size={16} />
            </Link>
            <Link to="/nosotros" className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-4 text-sm rounded-xl">
              Nuestra historia
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-6 hidden xl:flex flex-col gap-3">
          {[
            { label:'Clientes', value:'2.400+', icon:'😊' },
            { label:'Diseños',  value:'150+',   icon:'💎' },
            { label:'Años',     value:'8+',     icon:'⚜'  },
          ].map((s,i) => (
            <div key={s.label} className="glass-card px-4 py-3 border border-gold-500/10 flex items-center gap-3 stat-card-3d"
              style={{ animationDelay:`${i*0.2}s` }}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-base font-bold text-gold-400 font-mono">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-7 bg-gradient-to-b from-gold-500/40 to-transparent" />
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOLD TICKER
// ═══════════════════════════════════════════════════════════════════════════════
function GoldTicker() {
  const [price, setPrice] = useState(null)
  useEffect(() => {
    api.get('/prices/gold').then(r => setPrice(r.data.price)).catch(() => {})
  }, [])

  const items = [
    `ORO SPOT: $${price ? price.toFixed(2) : '...'} USD/oz`,
    '✦ ORO 18K (750‰) — pureza premium',
    '✦ ORO 14K (585‰) — equilibrio ideal',
    '✦ ENVÍO GRATIS en compras +$300 USD',
    '✦ CERTIFICADO DE AUTENTICIDAD incluido',
    '✦ GARANTÍA 30 días sin preguntas',
    '✦ PAGOS SEGUROS · Encriptación SSL',
    '✦ JOYERÍA ARTESANAL · Medellín, Colombia',
    '✦ ENVÍOS a todo el territorio nacional',
    `ORO SPOT: $${price ? price.toFixed(2) : '...'} USD/oz`,
  ]
  return (
    <div className="bg-dark-500/80 border-y border-gold-500/15 py-2.5 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker-inner flex gap-8 whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="text-xs text-gold-400/80 font-mono tracking-wider">{item}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLASH SALE — countdown
// ═══════════════════════════════════════════════════════════════════════════════
function FlashSale({ onQuickView, compareItems, onToggleCompare }) {
  const { h, m, s } = useCountdown(18)
  const [products, setProducts] = useState([])
  const ref = useReveal()

  useEffect(() => {
    api.get('/products?limit=3&sort=-price').then(r => setProducts(r.data.products || [])).catch(() => {})
  }, [])

  const fmt = n => String(n).padStart(2, '0')

  return (
    <section className="py-12 bg-gradient-to-r from-dark-500/50 via-red-950/20 to-dark-500/50 border-y border-red-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 reveal-3d" ref={ref}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Flame size={20} className="text-red-400" />
            </div>
            <div>
              <p className="font-display text-2xl text-white tracking-wider flex items-center gap-2">
                OFERTA <span className="text-red-400">FLASH</span>
              </p>
              <p className="text-xs text-gray-500">Descuentos exclusivos por tiempo limitado</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-2">Termina en:</span>
            {[{v:fmt(h),l:'Horas'},{v:fmt(m),l:'Min'},{v:fmt(s),l:'Seg'}].map(({v,l}, i) => (
              <div key={l}>
                {i > 0 && <span className="text-gold-500 font-bold mx-1">:</span>}
                <div className="bg-dark-400 border border-gold-500/20 rounded-lg px-2.5 py-1.5 text-center min-w-[42px]">
                  <p className="font-mono font-bold text-gold-400 text-lg leading-none">{v}</p>
                  <p className="text-[9px] text-gray-600 uppercase">{l}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <div key={p._id} className="glass-card border border-red-500/15 overflow-hidden group reveal-3d"
              style={{ transitionDelay:`${i*0.1}s` }}>
              <div className="relative h-40 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80' }} />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <Flame size={10} /> OFERTA
                </div>
                <div className="absolute top-2 right-2 bg-dark-600/80 text-green-400 text-xs font-bold px-2 py-1 rounded-lg">
                  -15%
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-white truncate mb-1">{p.name}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-mono text-gold-400 font-bold">${(p.price * 0.85).toFixed(2)}</span>
                  <span className="text-sm font-mono text-gray-600 line-through">${p.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onQuickView(p._id)}
                    className="flex-1 btn-outline py-2 text-xs rounded-lg flex items-center justify-center gap-1">
                    <Eye size={12} /> Ver
                  </button>
                  <button onClick={() => onToggleCompare(p)}
                    className={`px-3 py-2 rounded-lg border text-xs transition-all ${compareItems.some(c => c._id === p._id) ? 'bg-gold-500/20 border-gold-500/40 text-gold-400' : 'border-white/10 text-gray-500 hover:border-white/30'}`}>
                    <BarChart2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST BAR
// ═══════════════════════════════════════════════════════════════════════════════
function TrustBar() {
  return (
    <section className="border-b border-white/5 bg-dark-500/30 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon:Shield,    text:'Oro certificado 14K y 18K' },
            { icon:Truck,     text:'Envío a toda Colombia' },
            { icon:Award,     text:'Empaque de regalo incluido' },
            { icon:RefreshCw, text:'30 días de garantía' },
          ].map(({ icon:Icon, text }) => (
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

// ═══════════════════════════════════════════════════════════════════════════════
// 3D CATEGORY FLIP CARDS
// ═══════════════════════════════════════════════════════════════════════════════
const CATS = [
  { id:'anillo',  label:'Anillos',  emoji:'💍', color:'from-yellow-500/20 to-gold-500/5',   img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', desc:'Solitarios, compromiso, eternidad y diseño artesanal.' },
  { id:'collar',  label:'Collares', emoji:'📿', color:'from-purple-500/20 to-purple-500/5', img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', desc:'Gargantillas finas, cadenas con dije y collares largos.' },
  { id:'pulsera', label:'Pulseras', emoji:'✨', color:'from-blue-500/20 to-blue-500/5',     img:'https://images.unsplash.com/photo-1573408301185-9519f94816a4?w=400&q=80', desc:'Esclavas pulidas, tennis con zirconias y articuladas.' },
  { id:'aretes',  label:'Aretes',   emoji:'🌟', color:'from-green-500/20 to-green-500/5',   img:'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=400&q=80', desc:'Argollas clásicas, dijes colgantes y dormilonas.' },
  { id:'cadena',  label:'Cadenas',  emoji:'⛓', color:'from-orange-500/20 to-orange-500/5', img:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80', desc:'Fígaro, Rolo, Veneciana y más estilos en oro fino.' },
  { id:'dije',    label:'Dijes',    emoji:'🔮', color:'from-pink-500/20 to-pink-500/5',     img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', desc:'Cruces caladas, corazones y símbolos en oro fino.' },
]

function CategoriesSection() {
  const ref = useReveal()
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 reveal-3d" ref={ref}>
        <span className="section-tag">Explora</span>
        <h2 className="text-4xl font-display tracking-wider text-white">NUESTRAS <span className="gold-text">COLECCIONES</span></h2>
        <p className="text-gray-500 mt-2 text-sm max-w-lg mx-auto">Pasa el cursor sobre cada categoría — cada una esconde su mundo</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATS.map((cat, i) => (
          <div key={cat.id} className="flip-card" style={{ height:'200px', animationDelay:`${i*0.07}s` }}>
            <div className="flip-card-inner">
              <div className={`flip-card-front bg-gradient-to-b ${cat.color} border border-white/8 rounded-2xl flex flex-col items-center justify-center p-4`}>
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <p className="font-bold text-white text-sm">{cat.label}</p>
                <div className="w-8 h-0.5 bg-gold-500/40 mt-2 rounded-full" />
              </div>
              <div className="flip-card-back rounded-2xl overflow-hidden">
                <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-600 via-dark-600/80 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <p className="font-bold text-gold-400 text-sm mb-1">{cat.label}</p>
                  <p className="text-xs text-gray-300 leading-relaxed mb-3">{cat.desc}</p>
                  <Link to={`/catalogo?category=${cat.id}`} className="text-xs font-semibold text-gold-400 flex items-center gap-1 hover:gap-2 transition-all">
                    Ver colección <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED COUNTERS
// ═══════════════════════════════════════════════════════════════════════════════
function CounterItem({ target, suffix, label, icon:Icon, color }) {
  const { val, ref } = useCounter(target)
  return (
    <div ref={ref} className="text-center p-6 glass-card border border-white/5 reveal-3d visible group hover:-translate-y-1 transition-all duration-300" style={{ transform:'none' }}>
      <Icon size={24} className={`${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
      <p className={`font-display text-5xl tracking-wider ${color}`}>{val.toLocaleString('es-CO')}{suffix}</p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  )
}
function CounterSection() {
  return (
    <section className="py-16 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { target:2400, suffix:'+',    label:'Clientes felices', icon:Users,   color:'text-gold-400'   },
            { target:150,  suffix:'+',    label:'Diseños únicos',   icon:Gem,     color:'text-purple-400' },
            { target:8,    suffix:' años',label:'De experiencia',   icon:Award,   color:'text-blue-400'   },
            { target:99,   suffix:'%',    label:'Satisfacción',     icon:StarFill,color:'text-green-400'  },
          ].map(s => <CounterItem key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURED PRODUCTS — with quick view + compare
// ═══════════════════════════════════════════════════════════════════════════════
function ProductGrid({ title, tag, query, onQuickView, compareItems, onToggleCompare }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useReveal()

  useEffect(() => {
    api.get(`/products?${query}&limit=4`)
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query])

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-8 reveal-3d" ref={ref}>
        <div>
          <span className="section-tag">{tag}</span>
          <h2 className="text-4xl font-display tracking-wider text-white" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <Link to="/catalogo" className="btn-outline px-4 py-2 text-sm hidden sm:flex items-center gap-2">
          Ver todo <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array(4).fill(0).map((_,i) => <div key={i} className="h-80 shimmer-bg rounded-2xl" />)
          : products.map(p => (
            <div key={p._id} className="relative group/wrap">
              <ProductCard product={p} />
              {/* Action overlay */}
              <div className="absolute top-2 right-10 opacity-0 group-hover/wrap:opacity-100 transition-opacity flex flex-col gap-1 z-20">
                <button onClick={() => onQuickView(p._id)}
                  title="Vista rápida"
                  className="w-8 h-8 rounded-full bg-dark-600/90 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all">
                  <Eye size={13} />
                </button>
                <button onClick={() => onToggleCompare(p)}
                  title="Comparar"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${compareItems.some(c => c._id === p._id) ? 'bg-gold-500/20 border-gold-500/40 text-gold-400' : 'bg-dark-600/90 border-white/10 text-gray-400 hover:text-gold-400'}`}>
                  <BarChart2 size={13} />
                </button>
              </div>
            </div>
          ))
        }
      </div>
      <div className="text-center mt-6 sm:hidden">
        <Link to="/catalogo" className="btn-outline px-6 py-2.5 text-sm inline-flex items-center gap-2">
          Ver toda la colección <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRENDING NOW — most viewed
// ═══════════════════════════════════════════════════════════════════════════════
function TrendingSection({ onQuickView }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const ref = useReveal()

  useEffect(() => {
    api.get('/products?limit=6&sort=-soldCount')
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const views = [1248, 943, 876, 654, 589, 412]

  return (
    <section className="py-16 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 reveal-3d" ref={ref}>
          <div>
            <span className="section-tag">Popular ahora</span>
            <h2 className="text-4xl font-display tracking-wider text-white">
              TENDENCIAS <span className="gold-text">HOY</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Actualizado en vivo
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array(6).fill(0).map((_,i) => <div key={i} className="h-24 shimmer-bg rounded-2xl" />)
            : products.map((p, i) => (
              <div key={p._id} className="flex items-center gap-4 glass-card border border-white/5 p-4 group hover:border-gold-500/20 transition-all reveal-3d cursor-pointer"
                style={{ transitionDelay:`${i*0.07}s` }}
                onClick={() => onQuickView(p._id)}>
                <div className="font-display text-3xl text-white/10 w-8 text-center flex-shrink-0">{i+1}</div>
                <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-dark-400 flex-shrink-0 group-hover:scale-105 transition-transform"
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&q=60' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category} · {p.purity}K</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Eye size={10} className="text-gray-600" />
                    <span className="text-xs text-gray-600">{views[i]?.toLocaleString()} vistas</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-gold-400 font-bold text-sm">${p.price.toFixed(2)}</p>
                  {i < 3 && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">🔥 Hot</span>}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MATERIAL QUALITY 3D COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════
function MaterialsSection() {
  const ref = useReveal()
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 reveal-3d" ref={ref}>
        <span className="section-tag">Calidad garantizada</span>
        <h2 className="text-4xl font-display tracking-wider text-white">ELIGE TU <span className="gold-text">TIPO DE ORO</span></h2>
        <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">Cada tipo tiene propiedades únicas para cada ocasión y estilo de vida</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { karat:'18K', purity:'75%', label:'Oro Amarillo 18K', color:'from-yellow-500/20 to-amber-500/10', border:'border-yellow-500/30', features:['Brillo más intenso','Mayor pureza (750‰)','Ideal piezas premium','Resistencia excelente'], badge:'PREMIUM', badgeColor:'bg-yellow-500/20 text-yellow-400', emoji:'🌟', hot:true },
          { karat:'14K', purity:'58.5%', label:'Oro Amarillo 14K', color:'from-gold-500/15 to-gold-500/5', border:'border-gold-500/25', features:['Durabilidad superior','Uso diario ideal','Excelente relación valor','Amplia variedad'], badge:'POPULAR', badgeColor:'bg-gold-500/20 text-gold-400', emoji:'💛' },
          { karat:'18K', purity:'75%', label:'Oro Blanco 18K', color:'from-blue-500/15 to-slate-500/10', border:'border-blue-500/20', features:['Acabado plateado elegante','Rodio protector','Perfecto con zirconias','Estilo contemporáneo'], badge:'ELEGANTE', badgeColor:'bg-blue-500/20 text-blue-400', emoji:'🤍' },
        ].map((c, i) => (
          <div key={c.karat+c.label} className={`glass-card border ${c.border} p-6 relative overflow-hidden reveal-3d ${c.hot ? 'scale-[1.02]' : ''}`}
            style={{ transitionDelay:`${i*0.1}s` }}
            onMouseEnter={e => { e.currentTarget.style.transform='perspective(600px) rotateY(-4deg) rotateX(2deg) translateY(-6px) scale(1.02)'; e.currentTarget.style.transition='transform 0.3s ease' }}
            onMouseLeave={e => { e.currentTarget.style.transform='perspective(600px) rotateY(0) rotateX(0) translateY(0) scale(1)' }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-60`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{c.emoji}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badgeColor}`}>{c.badge}</span>
              </div>
              <div className="mb-1">
                <span className="font-display text-5xl text-white tracking-widest">{c.karat}</span>
                <span className="text-xs text-gray-500 ml-2">({c.purity} oro puro)</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{c.label}</p>
              <div className="space-y-2 mb-5">
                {c.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={12} className="text-gold-400 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Link to={`/catalogo`} className="btn-outline w-full py-2.5 text-sm flex items-center justify-center gap-2">
                Ver en {c.karat} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONALIZATION CTA
// ═══════════════════════════════════════════════════════════════════════════════
function PersonalizationSection() {
  const ref = useReveal()
  const options = [
    { icon:'✍️', title:'Grabados personales', desc:'Nombres, fechas, coordenadas o mensajes secretos en tu joya' },
    { icon:'💎', title:'Piedras a tu gusto', desc:'Selecciona el tipo y color de piedra semipreciosa' },
    { icon:'📏', title:'Talla exacta', desc:'Fabricamos a tu medida exacta para el ajuste perfecto' },
    { icon:'🎨', title:'Diseño propio', desc:'Traemos tu boceto a la vida en oro 14K o 18K' },
  ]
  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal-3d" ref={ref}>
            <span className="section-tag">Personalización</span>
            <h2 className="text-4xl font-display tracking-wider text-white mb-4">
              TU JOYA, <span className="gold-text">TU HISTORIA</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Cada pieza es única como tú. Personalizamos grabados, piedras, tallas y diseños completamente a tu gusto. Cuéntanos tu idea y la hacemos realidad.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {options.map(o => (
                <div key={o.title} className="p-4 glass-card border border-white/5 hover:border-gold-500/20 transition-all group">
                  <div className="text-2xl mb-2">{o.icon}</div>
                  <p className="text-sm font-semibold text-white mb-1 group-hover:text-gold-400 transition-colors">{o.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{o.desc}</p>
                </div>
              ))}
            </div>
            <a href="https://wa.me/573001234567?text=Quiero%20personalizar%20una%20joya"
              target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold">
              <MessageCircle size={16} /> Consultar por WhatsApp
            </a>
          </div>

          <div className="relative reveal-3d">
            <div className="aspect-square rounded-3xl overflow-hidden bg-dark-400">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80"
                alt="Personalización" className="w-full h-full object-cover opacity-80" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-600/60 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 glass-card border border-gold-500/30 px-5 py-3 bg-dark-500">
              <p className="text-xs text-gray-500">Tiempo de entrega</p>
              <p className="text-gold-400 font-bold">5 – 7 días hábiles</p>
            </div>
            <div className="absolute -top-4 -right-4 glass-card border border-green-500/30 px-5 py-3 bg-dark-500">
              <p className="text-xs text-gray-500">Costo adicional</p>
              <p className="text-green-400 font-bold text-sm">Desde $0 USD</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRAFTSMANSHIP PROCESS
// ═══════════════════════════════════════════════════════════════════════════════
function CraftProcess() {
  const ref = useReveal()
  const steps = [
    { n:'01', icon:'⛏', title:'Extracción responsable', desc:'Solo oro de origen certificado y minería responsable en Colombia.' },
    { n:'02', icon:'🔥', title:'Fundición y refinado', desc:'El oro se funde a 1064°C y se refina hasta la pureza exacta.' },
    { n:'03', icon:'🔨', title:'Forja artesanal', desc:'Maestros joyeros con 20+ años forjan cada pieza a mano.' },
    { n:'04', icon:'💎', title:'Engaste de piedras', desc:'Zirconias engastadas con precisión micrónica.' },
    { n:'05', icon:'✨', title:'Pulido 5 fases', desc:'Proceso de 5 fases para el brillo espejo característico.' },
    { n:'06', icon:'📜', title:'Certificación', desc:'Certificado con pureza, peso y número de serie.' },
  ]
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 reveal-3d" ref={ref}>
        <span className="section-tag">Artesanía</span>
        <h2 className="text-4xl font-display tracking-wider text-white">CÓMO SE HACE <span className="gold-text">TU JOYA</span></h2>
        <p className="text-gray-500 mt-2 text-sm">6 etapas que garantizan perfección</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((s, i) => (
          <div key={i} className="glass-card border border-white/5 p-6 group hover:border-gold-500/20 transition-all reveal-3d"
            style={{ transitionDelay:`${i*0.08}s` }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/8 border border-gold-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-gold-500/15 group-hover:border-gold-500/40 transition-all">
                {s.icon}
              </div>
              <div>
                <span className="text-xs text-gold-500/50 font-display tracking-widest">{s.n}</span>
                <h3 className="font-bold text-white text-sm group-hover:text-gold-400 transition-colors mt-0.5 mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUNDLE DEALS
// ═══════════════════════════════════════════════════════════════════════════════
function BundleDeals({ onQuickView }) {
  const ref = useReveal()
  const bundles = [
    { title:'Set Novia Completo', items:['Anillo 18K','Collar Corazón','Aretes Argolla'], price:850, regular:1050, img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80', badge:'Ahorra $200', hot:true },
    { title:'Kit Diario Elegante', items:['Cadena Fígaro','Pulsera Esclava','Aretes Botón'], price:620, regular:780, img:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80', badge:'Ahorra $160' },
    { title:'Colección Juvenil', items:['Dije Cruz 14K','Pulsera 14K','Aretes Argolla 14K'], price:380, regular:490, img:'https://images.unsplash.com/photo-1573408301185-9519f94816a4?w=400&q=80', badge:'Ahorra $110' },
  ]
  return (
    <section className="py-16 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-3d" ref={ref}>
          <span className="section-tag">Combos exclusivos</span>
          <h2 className="text-4xl font-display tracking-wider text-white">SETS <span className="gold-text">ESPECIALES</span></h2>
          <p className="text-gray-500 mt-2 text-sm">Colecciones curadas que combinan perfecto — con descuento por llevarlas juntas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bundles.map((b, i) => (
            <div key={b.title} className={`glass-card border reveal-3d overflow-hidden group ${b.hot ? 'border-gold-500/30' : 'border-white/5'}`}
              style={{ transitionDelay:`${i*0.1}s` }}>
              {b.hot && <div className="bg-gradient-to-r from-gold-500 to-amber-500 text-dark-600 text-xs font-bold px-4 py-1.5 text-center">⭐ MÁS POPULAR</div>}
              <div className="relative h-40 overflow-hidden">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-600 via-dark-600/50 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">{b.badge}</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <div className="space-y-1 mb-4">
                  {b.items.map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle size={11} className="text-gold-400 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-mono font-bold text-gold-400">${b.price}</span>
                  <span className="text-sm font-mono text-gray-600 line-through">${b.regular}</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                    -{Math.round((1 - b.price/b.regular)*100)}%
                  </span>
                </div>
                <Link to="/contacto" className="btn-gold w-full py-3 text-sm rounded-xl flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> Pedir set
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIFT OCCASIONS
// ═══════════════════════════════════════════════════════════════════════════════
function GiftOccasions() {
  const ref = useReveal()
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 reveal-3d" ref={ref}>
        <span className="section-tag">Regalos</span>
        <h2 className="text-4xl font-display tracking-wider text-white">EL REGALO <span className="gold-text">PERFECTO</span></h2>
        <p className="text-gray-500 mt-2 text-sm">Para cada momento especial, la joya ideal</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon:'💑', label:'San Valentín',     color:'from-red-500/20 to-pink-500/10',    border:'border-red-500/20',    cat:'anillo'  },
          { icon:'💍', label:'Compromiso',       color:'from-gold-500/20 to-yellow-500/10', border:'border-gold-500/20',   cat:'anillo'  },
          { icon:'🎂', label:'Cumpleaños',       color:'from-purple-500/20 to-pink-500/10', border:'border-purple-500/20', cat:'aretes'  },
          { icon:'👩‍👧', label:'Día de la Madre', color:'from-rose-500/20 to-orange-500/10', border:'border-rose-500/20',   cat:'collar'  },
          { icon:'🎓', label:'Graduación',       color:'from-blue-500/20 to-indigo-500/10', border:'border-blue-500/20',   cat:'cadena'  },
          { icon:'🎄', label:'Navidad',          color:'from-green-500/20 to-teal-500/10',  border:'border-green-500/20',  cat:'pulsera' },
        ].map((o, i) => (
          <Link key={o.label} to={`/catalogo?category=${o.cat}`}
            className={`glass-card border ${o.border} p-5 text-center group hover:-translate-y-2 transition-all duration-300 reveal-3d`}
            style={{ transitionDelay:`${i*0.07}s` }}>
            <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${o.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>{o.icon}</div>
            <p className="text-xs font-semibold text-white leading-tight">{o.label}</p>
            <p className="text-[10px] text-gold-500/70 mt-1 flex items-center justify-center gap-0.5">Ver <ArrowRight size={9} /></p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// JEWELRY CARE GUIDE — interactive tabs
// ═══════════════════════════════════════════════════════════════════════════════
function JewelryCare() {
  const [tab, setTab] = useState(0)
  const ref = useReveal()
  const tips = [
    {
      tab:'Limpieza', icon:'✨',
      items: [
        { icon:<Droplets size={16}/>, title:'Agua tibia con jabón', desc:'Sumerge la joya 5 minutos y frota suavemente con cepillo de cerdas blandas.' },
        { icon:<Wind size={16}/>, title:'Sécala bien', desc:'Usa un paño de microfibra. Evita la humedad prolongada para mantener el brillo.' },
        { icon:<Sun size={16}/>, title:'Pulido mensual', desc:'Un paño para plata o un paño dorado restaura el brillo original en minutos.' },
      ]
    },
    {
      tab:'Almacenaje', icon:'📦',
      items: [
        { icon:<Package size={16}/>, title:'Bolsas individuales', desc:'Guarda cada pieza en su bolsita anti-rayaduras para evitar choques entre joyas.' },
        { icon:<Shield size={16}/>, title:'Evita la humedad', desc:'Un ambiente seco prolonga la vida del acabado. Usa bolsas de gel de sílice.' },
        { icon:<ShieldCheck size={16}/>, title:'Caja forrada', desc:'El interior de terciopelo protege el acabado y evita oxidaciones.' },
      ]
    },
    {
      tab:'Uso diario', icon:'💪',
      items: [
        { icon:<Ruler size={16}/>, title:'Quítate al ejercitar', desc:'El sudor y los golpes pueden dañar el engaste y el acabado superficial.' },
        { icon:<Droplets size={16}/>, title:'No al cloro', desc:'Piscinas y jacuzzis contienen cloro que daña el oro con el tiempo.' },
        { icon:<Sun size={16}/>, title:'Crema corporal último', desc:'Aplica perfume y cremas antes de ponerte las joyas para evitar residuos.' },
      ]
    },
  ]

  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-3d" ref={ref}>
          <span className="section-tag">Guía de cuidado</span>
          <h2 className="text-4xl font-display tracking-wider text-white">CUIDA TU <span className="gold-text">TESORO</span></h2>
          <p className="text-gray-500 mt-2 text-sm">Consejos de nuestros maestros joyeros para mantener tu joya perfecta</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8">
          {tips.map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${tab === i ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' : 'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/20'}`}>
              <span>{t.icon}</span>{t.tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tips[tab].items.map((item, i) => (
            <div key={i} className="glass-card border border-white/5 p-5 hover:border-gold-500/20 transition-all group reveal-3d visible"
              style={{ transform:'none', transitionDelay:`${i*0.1}s` }}>
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-3 group-hover:bg-gold-500/20 transition-all">
                {item.icon}
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { name:'Valentina Ríos',   city:'Medellín',     rating:5, avatar:'V', text:'Compré el anillo de compromiso y mi pareja quedó sin palabras. La calidad del oro es impresionante.', product:'Anillo de Compromiso 18K' },
  { name:'Camilo Herrera',   city:'Bogotá',       rating:5, avatar:'C', text:'El pedido llegó en 2 días, perfectamente empacado. La pulsera de tenis superó todas mis expectativas.', product:'Pulsera de Tenis 18K' },
  { name:'Luisa Gómez',      city:'Cali',         rating:5, avatar:'L', text:'Llevo 3 años comprando y siempre quedo satisfecha. El certificado de autenticidad da mucha confianza.', product:'Aretes Argolla 14K' },
  { name:'Andrea Morales',   city:'Barranquilla', rating:5, avatar:'A', text:'La cadena fígaro es exactamente como en las fotos. La calidad del oro se nota al tocarlo.', product:'Cadena Fígaro 18K' },
  { name:'Sebastián Torres', city:'Pereira',      rating:5, avatar:'S', text:'El empaque es increíble y el asesor de WhatsApp me ayudó a elegir el tamaño perfecto.', product:'Collar Gargantilla 18K' },
  { name:'María Castro',     city:'Manizales',    rating:5, avatar:'M', text:'Pedí una personalización con grabado y quedó hermosa. Superó mis expectativas totalmente.', product:'Pulsera personalizada' },
]

function TestimonialCard({ t, delay = 0 }) {
  return (
    <div className="testimonial-card reveal-3d" style={{ transitionDelay:`${delay}s` }}>
      <div className="flex gap-1 mb-3">
        {[...Array(t.rating)].map((_,j) => <Star key={j} size={13} className="text-gold-400 fill-gold-400" />)}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
      <p className="text-xs text-gold-500/70 mb-3">— {t.product}</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-dark-600 text-xs font-bold flex-shrink-0">{t.avatar}</div>
        <div>
          <p className="text-sm font-semibold text-white">{t.name}</p>
          <p className="text-xs text-gray-600">{t.city}, Colombia</p>
        </div>
        <CheckCircle size={13} className="text-green-400 ml-auto" />
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  const ref = useReveal()
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 reveal-3d" ref={ref}>
        <span className="section-tag">+2,400 opiniones verificadas</span>
        <h2 className="text-4xl font-display tracking-wider text-white">LO QUE DICEN <span className="gold-text">NUESTROS CLIENTES</span></h2>
      </div>
      <div className="hidden md:grid grid-cols-3 gap-6 mb-8">
        {TESTIMONIALS.slice(0, 3).map((t, i) => <TestimonialCard key={i} t={t} delay={i * 0.1} />)}
      </div>
      <div className="hidden md:grid grid-cols-3 gap-6">
        {TESTIMONIALS.slice(3, 6).map((t, i) => <TestimonialCard key={i} t={t} delay={i * 0.15} />)}
      </div>
      <div className="md:hidden">
        <TestimonialCard t={TESTIMONIALS[idx]} />
        <div className="flex justify-center gap-2 mt-4">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-gold-400 w-5' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// RING SIZE GUIDE
// ═══════════════════════════════════════════════════════════════════════════════
const SIZES = [
  {us:'5',mm:'15.7',label:'XS'},{us:'6',mm:'16.5',label:'S'},{us:'7',mm:'17.3',label:'M'},
  {us:'8',mm:'18.2',label:'L'},{us:'9',mm:'19.0',label:'XL'},{us:'10',mm:'19.8',label:'XXL'},
]
function RingSizeGuide() {
  const [sel, setSel] = useState(2)
  const ref = useReveal()
  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-3d" ref={ref}>
          <span className="section-tag">Guía de tallas</span>
          <h2 className="text-4xl font-display tracking-wider text-white">ENCUENTRA TU <span className="gold-text">TALLA PERFECTA</span></h2>
          <p className="text-gray-500 mt-2 text-sm">Selecciona y visualiza en tiempo real</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            <div className="relative flex items-center justify-center" style={{ width:'220px', height:'220px' }}>
              <div className="absolute inset-0 rounded-full border border-gold-500/10 animate-pulse" />
              <div className="rounded-full flex items-center justify-center" style={{
                width:`${100 + sel * 18}px`, height:`${100 + sel * 18}px`,
                border:'8px solid transparent',
                background:'linear-gradient(#141414, #141414) padding-box, linear-gradient(135deg, #F5B042, #FFD700, #C8860A) border-box',
                transition:'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow:'0 0 30px rgba(245,176,66,0.3)',
              }}>
                <div className="text-center">
                  <p className="font-display text-2xl gold-text">{SIZES[sel].us}</p>
                  <p className="text-xs text-gray-500">US / {SIZES[sel].mm}mm</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-4">Selecciona tu talla:</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {SIZES.map((s, i) => (
                <button key={i} onClick={() => setSel(i)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 ${i === sel ? 'bg-gold-500/15 border-gold-500/40 text-gold-400' : 'bg-dark-400/50 border-white/5 text-gray-400 hover:border-white/20'}`}>
                  <p className="font-bold text-sm">US {s.us}</p>
                  <p className="text-xs opacity-70">{s.mm}mm · {s.label}</p>
                </button>
              ))}
            </div>
            <div className="glass-card p-4 border border-gold-500/15 bg-gold-500/3 mb-4">
              <p className="text-xs text-gray-500 mb-1">¿No sabes tu talla?</p>
              <p className="text-sm text-gray-300 leading-relaxed">Envuelve un hilo alrededor de tu dedo, mide en mm y compara. O escríbenos y te ayudamos.</p>
            </div>
            <a href="https://wa.me/573001234567?text=Necesito%20ayuda%20con%20la%20talla%20de%20mi%20anillo"
              target="_blank" rel="noreferrer"
              className="btn-outline w-full py-3 text-sm flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Asesoría gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECENTLY VIEWED
// ═══════════════════════════════════════════════════════════════════════════════
function RecentlyViewed({ onQuickView }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('velora_recent') || '[]')
      if (raw.length > 0) setItems(raw.slice(0, 4))
    } catch {}
  }, [])
  if (items.length === 0) return null
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="section-tag">Tus favoritos</span>
          <h2 className="text-3xl font-display tracking-wider text-white">VISTOS <span className="gold-text">RECIENTEMENTE</span></h2>
        </div>
        <button onClick={() => { localStorage.removeItem('velora_recent'); setItems([]) }} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Limpiar</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map(p => (
          <button key={p._id} onClick={() => onQuickView(p._id)}
            className="glass-card border border-white/5 p-3 text-left group hover:border-gold-500/20 transition-all">
            <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded-xl mb-2 bg-dark-400 group-hover:scale-105 transition-transform"
              onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=60' }} loading="lazy" />
            <p className="text-xs font-semibold text-white truncate">{p.name}</p>
            <p className="text-xs font-mono text-gold-400">${p.price?.toFixed(2)}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOYALTY VIP
// ═══════════════════════════════════════════════════════════════════════════════
function LoyaltySection() {
  const ref = useReveal()
  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-3d" ref={ref}>
          <span className="section-tag">Programa VIP</span>
          <h2 className="text-4xl font-display tracking-wider text-white">CLUB <span className="gold-text">VELORA</span></h2>
          <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">Cada compra te acumula beneficios — cuanto más compras, más privilegios</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { name:'VELORA',   icon:'⚜',  min:'$0',     color:'text-gray-400', border:'border-gray-700',      bg:'bg-gray-700/20',  perks:['Envío estándar','Certificado incluido','Soporte WhatsApp'] },
            { name:'PLATA',    icon:'🥈',  min:'$500',   color:'text-slate-300',border:'border-slate-400/30',  bg:'bg-slate-400/10', perks:['Todo VELORA','5% descuento','Empaque premium'] },
            { name:'ORO',      icon:'🥇',  min:'$1.500', color:'text-gold-400', border:'border-gold-500/40',   bg:'bg-gold-500/10',  perks:['Todo PLATA','10% descuento','Acceso anticipado'], hot:true },
            { name:'DIAMANTE', icon:'💎',  min:'$5.000', color:'text-blue-300', border:'border-blue-400/30',   bg:'bg-blue-500/8',   perks:['Todo ORO','15% descuento VIP','Asesor exclusivo'] },
          ].map((t, i) => (
            <div key={t.name} className={`glass-card border ${t.border} ${t.bg} p-6 relative reveal-3d ${t.hot ? 'scale-[1.03]' : ''}`}
              style={{ transitionDelay:`${i*0.1}s` }}>
              {t.hot && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-600 text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">⭐ MÁS POPULAR</div>}
              <div className="text-3xl mb-3">{t.icon}</div>
              <p className={`font-display text-xl tracking-widest ${t.color} mb-1`}>{t.name}</p>
              <p className="text-xs text-gray-600 mb-4">desde {t.min} en compras</p>
              <div className="space-y-2">
                {t.perks.map(p => (
                  <div key={p} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle size={11} className={t.color} /> {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/registro" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold">
            Crear cuenta y empezar <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════════════════
const FAQS = [
  { q:'¿Cómo sé que el oro es auténtico?', a:'Cada pieza viene con Certificado de Autenticidad con número de serie, pureza (ley), peso exacto y sello de nuestro taller. También puedes solicitar un ensayo de calidad.' },
  { q:'¿Cuánto tiempo tarda el envío?', a:'Medellín y área metropolitana: 1 día hábil. Bogotá, Cali, Barranquilla: 1–2 días. Resto del país: 2–3 días. Todos con seguro y número de guía.' },
  { q:'¿Puedo devolver o cambiar una joya?', a:'Sí, tienes 30 días para hacer cambio o devolución si la pieza está en su estado original con empaque y certificado. Sin preguntas.' },
  { q:'¿Hacen grabados y personalizaciones?', a:'Por supuesto. Personalizamos grabados, tallas y hasta diseños desde cero. Los pedidos personalizados toman 5–7 días adicionales.' },
  { q:'¿Cuáles son los métodos de pago?', a:'Aceptamos tarjetas de crédito/débito Visa y Mastercard, PSE, transferencias bancarias y pago contra entrega en Medellín.' },
  { q:'¿El empaque es para regalo?', a:'Todos los pedidos vienen en caja de regalo con listón dorado, tarjeta de autenticidad y bolsa de almacenamiento sin costo adicional.' },
  { q:'¿Tienen descuentos por volumen?', a:'Sí, para pedidos corporativos o por cantidad manejamos precios especiales. Contáctanos por WhatsApp para una cotización personalizada.' },
  { q:'¿Cómo cuido mi joya de oro?', a:'Evita el contacto con cloro, perfumes y cremas. Guárdala en su bolsita individual. Límpiala con agua tibia y jabón suave. Consulta nuestra guía de cuidado.' },
]

function FAQSection() {
  const [open, setOpen] = useState(null)
  const ref = useReveal()
  return (
    <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14 reveal-3d" ref={ref}>
        <span className="section-tag">Preguntas frecuentes</span>
        <h2 className="text-4xl font-display tracking-wider text-white">TODO LO QUE <span className="gold-text">NECESITAS SABER</span></h2>
        <p className="text-gray-500 mt-2 text-sm">¿No encuentras respuesta? Escríbenos por WhatsApp</p>
      </div>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <div key={i} className={`glass-card border transition-all duration-300 overflow-hidden ${open === i ? 'border-gold-500/30 bg-gold-500/3' : 'border-white/5 hover:border-white/10'}`}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
              <span className={`text-sm font-semibold transition-colors ${open === i ? 'text-gold-400' : 'text-white'}`}>{f.q}</span>
              <ChevronDown size={16} className={`text-gray-500 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180 text-gold-400' : ''}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">{f.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors font-semibold">
          <MessageCircle size={16} /> ¿Otra pregunta? Escríbenos ahora
        </a>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════════════════════
const GALLERY = [
  { src:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80', label:'Anillos 18K', span:'col-span-1 row-span-2' },
  { src:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', label:'Collares' },
  { src:'https://images.unsplash.com/photo-1573408301185-9519f94816a4?w=600&q=80', label:'Pulseras' },
  { src:'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80', label:'Cadenas', span:'col-span-2' },
  { src:'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&q=80', label:'Aretes' },
]
function GallerySection() {
  const ref = useReveal()
  return (
    <section className="py-20 bg-dark-500/20 border-y border-white/4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal-3d" ref={ref}>
          <span className="section-tag">Galería</span>
          <h2 className="text-4xl font-display tracking-wider text-white">BELLEZA EN <span className="gold-text">CADA DETALLE</span></h2>
        </div>
        <div className="grid grid-cols-3 gap-3 auto-rows-[160px]">
          {GALLERY.map((g, i) => (
            <Link key={i} to="/catalogo" className={`${g.span || ''} relative overflow-hidden rounded-2xl group`} style={{ perspective:'600px' }}>
              <img src={g.src} alt={g.label} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-90" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-600/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <p className="text-white font-bold text-sm">{g.label}</p>
                <p className="text-gold-400 text-xs flex items-center gap-1">Ver colección <ArrowRight size={10} /></p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background:'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT METHODS
// ═══════════════════════════════════════════════════════════════════════════════
function PaymentMethods() {
  const ref = useReveal()
  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card border border-white/5 p-8 reveal-3d" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Lock size={16} className="text-gold-400" /> Compra 100% segura</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Todas las transacciones están protegidas con encriptación SSL de 256 bits. Tus datos nunca se comparten.</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Métodos de pago</p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon:<CreditCard size={16}/>, label:'Visa' },
                { icon:<CreditCard size={16}/>, label:'Mastercard' },
                { icon:<Smartphone size={16}/>, label:'PSE' },
                { icon:<Package size={16}/>,   label:'Contraentrega' },
                { icon:<Wifi size={16}/>,       label:'Nequi' },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-400 border border-white/8 text-xs text-gray-400">
                  {m.icon} {m.label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Garantías</p>
            <div className="space-y-2">
              {[
                { icon:<ShieldCheck size={13}/>, text:'Certificado de autenticidad' },
                { icon:<RefreshCw size={13}/>,  text:'30 días de garantía total' },
                { icon:<Truck size={13}/>,      text:'Envío asegurado y rastreable' },
                { icon:<BadgeCheck size={13}/>, text:'Joyería 100% artesanal' },
              ].map(g => (
                <div key={g.text} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-gold-400">{g.icon}</span> {g.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════════════════════════════
function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const ref = useReveal()
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14 text-center reveal-3d" ref={ref}
        style={{ background:'linear-gradient(135deg, #0D0900 0%, #1E1400 40%, #0D0900 100%)', border:'1px solid rgba(245,176,66,0.25)' }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[18rem]">⚜</span>
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <div className="relative">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
            <Mail size={22} className="text-gold-400" />
          </div>
          <span className="section-tag">Newsletter exclusivo</span>
          <h2 className="text-4xl sm:text-5xl font-display tracking-widest text-white mb-2">
            ACCESO <span className="gold-text">ANTICIPADO</span>
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">
            Nuevas colecciones, ofertas exclusivas y guías de joyería — antes que nadie.
            <strong className="text-gold-400"> + 10% OFF</strong> en tu primera compra.
          </p>
          {sent ? (
            <div className="flex items-center justify-center gap-3 text-green-400">
              <CheckCircle size={20} /> <span className="font-semibold">¡Listo! Revisa tu correo.</span>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if(email) setSent(true) }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="input-gold px-4 py-3.5 text-sm flex-1" />
              <button type="submit" className="btn-gold px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <Sparkles size={14} /> Suscribirme
              </button>
            </form>
          )}
          <p className="text-xs text-gray-600 mt-3">Sin spam. Cancela cuando quieras.</p>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// CTA FINAL
// ═══════════════════════════════════════════════════════════════════════════════
function CTABanner() {
  const ref = useReveal()
  return (
    <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden p-10 sm:p-14 reveal-3d" ref={ref}
        style={{ background:'linear-gradient(135deg,rgba(245,176,66,0.12) 0%,rgba(200,134,10,0.06) 100%)', border:'1px solid rgba(245,176,66,0.3)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="section-tag">Oferta especial</span>
            <h2 className="text-4xl sm:text-5xl font-display tracking-widest text-white">ENVÍO GRATIS <span className="gold-text">HOY</span></h2>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              En compras mayores a <strong className="text-gold-400">$300 USD</strong>. Entrega en 1 a 3 días con seguimiento en tiempo real y empaque de regalo incluido.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Link to="/registro" className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 text-sm font-bold rounded-xl">
              Crear cuenta gratis <ArrowRight size={16} />
            </Link>
            <Link to="/catalogo" className="btn-outline inline-flex items-center justify-center gap-2 px-10 py-4 text-sm rounded-xl">
              Explorar catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [quickViewId, setQuickViewId]   = useState(null)
  const [compareItems, setCompareItems] = useState([])

  // Save to recently viewed
  const handleQuickView = useCallback((id) => {
    setQuickViewId(id)
    // fetch and save to recent
    api.get(`/products/${id}`).then(r => {
      const p = r.data.product
      if (!p) return
      try {
        const prev = JSON.parse(localStorage.getItem('velora_recent') || '[]')
        const updated = [p, ...prev.filter(x => x._id !== p._id)].slice(0, 6)
        localStorage.setItem('velora_recent', JSON.stringify(updated))
      } catch {}
    }).catch(() => {})
  }, [])

  const handleToggleCompare = useCallback((product) => {
    setCompareItems(prev => {
      if (prev.some(p => p._id === product._id)) return prev.filter(p => p._id !== product._id)
      if (prev.length >= 2) return [...prev.slice(1), product]
      return [...prev, product]
    })
  }, [])

  return (
    <div className={compareItems.length > 0 ? 'pb-48' : ''}>
      {/* Modals */}
      {quickViewId && <QuickViewModal productId={quickViewId} onClose={() => setQuickViewId(null)} />}
      <CompareBar items={compareItems} onRemove={id => setCompareItems(p => p.filter(x => x._id !== id))} onClear={() => setCompareItems([])} />

      {/* Sections */}
      <HeroSection />
      <GoldTicker />
      <TrustBar />
      <FlashSale onQuickView={handleQuickView} compareItems={compareItems} onToggleCompare={handleToggleCompare} />
      <CategoriesSection />
      <CounterSection />
      <ProductGrid title='JOYAS <span class="gold-text">DESTACADAS</span>' tag="Lo más popular" query="featured=true" onQuickView={handleQuickView} compareItems={compareItems} onToggleCompare={handleToggleCompare} />
      <TrendingSection onQuickView={handleQuickView} />
      <MaterialsSection />
      <PersonalizationSection />
      <CraftProcess />
      <ProductGrid title='NUEVAS <span class="gold-text">LLEGADAS</span>' tag="Recién llegados" query="sort=-createdAt" onQuickView={handleQuickView} compareItems={compareItems} onToggleCompare={handleToggleCompare} />
      <BundleDeals onQuickView={handleQuickView} />
      <GiftOccasions />
      <JewelryCare />
      <TestimonialsSection />
      <RingSizeGuide />
      <RecentlyViewed onQuickView={handleQuickView} />
      <LoyaltySection />
      <FAQSection />
      <GallerySection />
      <PaymentMethods />
      <NewsletterSection />
      <CTABanner />
    </div>
  )
}
