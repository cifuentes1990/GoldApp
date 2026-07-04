import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useSettings } from '../../contexts/SettingsContext'
import Logo, { LogoEmblem } from '../ui/Logo'
import {
  ShoppingCart, User, Menu, X, Shield, LogOut,
  Package, ChevronDown, Heart, Phone, MapPin,
  Instagram, Facebook, MessageCircle, Search
} from 'lucide-react'

// ─── WhatsApp floating button ───────────────────────────────────────────────
function WhatsAppButton({ whatsapp }) {
  const num = whatsapp || '573001234567'
  return (
    <a
      href={`https://wa.me/${num}?text=Hola%2C%20quiero%20información%20sobre%20sus%20joyas`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      title="Chatea con nosotros"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

// ─── Announcement bar ────────────────────────────────────────────────────────
function AnnouncementBar() {
  const items = [
    '🚚 Envío GRATIS en compras mayores a $300 USD',
    '💎 Oro 14K y 18K con certificado de autenticidad',
    '📦 Entrega en 1-3 días hábiles a todo Colombia',
    '⚜️ Fabricación artesanal · Medellín, Colombia',
  ]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="announcement-bar">
      <span className="transition-all duration-500">{items[idx]}</span>
    </div>
  )
}

// ─── Main layout ─────────────────────────────────────────────────────────────
export default function MainLayout() {
  const { user, logout, isAdmin } = useAuth()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { settings } = useSettings()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/combinar', label: 'Combinar', badge: 'Nuevo' },
    { to: '/probador', label: 'Probador IA', badge: 'IA' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ]

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-dark-600 flex flex-col">
      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-600/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-dark-600/80 backdrop-blur-md border-b border-white/3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <Logo size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`nav-link text-sm font-medium relative flex items-center gap-1.5 ${isActive(l.to) ? 'active' : ''}`}>
                  {l.label}
                  {l.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      l.badge === 'IA' ? 'bg-gold-500/20 text-gold-400' : 'bg-green-500/20 text-green-400'
                    }`}>{l.badge}</span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">

              {/* Wishlist */}
              <Link to="/favoritos"
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group"
                title="Mis favoritos">
                <Heart size={19} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/carrito"
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group"
                title="Carrito">
                <ShoppingCart size={19} className="text-gray-400 group-hover:text-gold-400 transition-colors" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-dark-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                      <span className="text-dark-600 text-xs font-bold">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300 font-medium max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={13} className={`text-gray-500 transition-transform hidden sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass-card border border-white/10 py-1 shadow-2xl">
                      <div className="px-4 py-2.5 border-b border-white/5">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-400 hover:bg-gold-500/10 transition-colors">
                          <Shield size={13} /> Panel Admin
                        </Link>
                      )}
                      {!isAdmin && (
                        <Link to="/mi-cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-300 hover:bg-gold-500/10 transition-colors">
                          <User size={13} /> Mi Cuenta
                        </Link>
                      )}
                      <Link to="/pedidos" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <Package size={13} /> Mis Pedidos
                      </Link>
                      <Link to="/perfil" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                        <User size={13} /> Mi Perfil
                      </Link>
                      <div className="border-t border-white/5 mt-1">
                        <button onClick={logout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <LogOut size={13} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-outline px-4 py-2 text-sm">Entrar</Link>
                  <Link to="/registro" className="btn-gold px-4 py-2 text-sm rounded-lg">Registrarse</Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors ml-1">
                {mobileOpen ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-dark-500/98 backdrop-blur-xl border-t border-white/5">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(l.to)
                      ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}>
                  {l.label}
                  {l.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      l.badge === 'IA' ? 'bg-gold-500/20 text-gold-400' : 'bg-green-500/20 text-green-400'
                    }`}>{l.badge}</span>
                  )}
                </Link>
              ))}
              {!user ? (
                <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                  <Link to="/login" className="btn-outline flex-1 px-4 py-2.5 text-sm text-center rounded-xl">Entrar</Link>
                  <Link to="/registro" className="btn-gold flex-1 px-4 py-2.5 text-sm text-center rounded-xl">Registrarse</Link>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                  {isAdmin ? (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-400 hover:bg-gold-500/10 rounded-xl font-bold border border-gold-500/20">
                      <Shield size={14} /> Panel Admin
                    </Link>
                  ) : (
                    <Link to="/mi-cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gold-400 hover:bg-gold-500/10 rounded-xl font-medium">
                      <User size={14} /> Mi Cuenta
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link to="/pedidos" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl">
                      <Package size={14} /> Mis Pedidos
                    </Link>
                  )}
                  <Link to="/perfil" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl">
                    <User size={14} /> Mi Perfil
                  </Link>
                  <button onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl">
                    <LogOut size={14} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-500/60 mt-20">
        {/* Top footer */}
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center group mb-4">
                <Logo size="sm" />
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Joyería premium en oro 14K y 18K, elaborada artesanalmente en Medellín, Colombia. Diseños únicos con certificado de autenticidad.
              </p>
              <div className="flex items-center gap-3">
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-300 hover:bg-gold-500/15 text-gray-500 hover:text-gold-400 transition-colors">
                    <Instagram size={16} />
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-300 hover:bg-gold-500/15 text-gray-500 hover:text-gold-400 transition-colors">
                    <Facebook size={16} />
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-300 hover:bg-pink-500/15 text-gray-500 hover:text-pink-400 transition-colors"
                    title="TikTok">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
                    </svg>
                  </a>
                )}
                {settings.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg bg-dark-300 hover:bg-green-500/15 text-gray-500 hover:text-green-400 transition-colors">
                    <MessageCircle size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Colecciones */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Colecciones</h4>
              <div className="space-y-2.5">
                {[
                  ['Anillos', '/catalogo?category=anillo'],
                  ['Collares', '/catalogo?category=collar'],
                  ['Pulseras', '/catalogo?category=pulsera'],
                  ['Aretes', '/catalogo?category=aretes'],
                  ['Cadenas', '/catalogo?category=cadena'],
                  ['Dijes', '/catalogo?category=dije'],
                ].map(([label, path]) => (
                  <Link key={label} to={path}
                    className="block text-sm text-gray-500 hover:text-gold-400 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Información */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Información</h4>
              <div className="space-y-2.5">
                {[
                  ['Nosotros', '/nosotros'],
                  ['Contacto', '/contacto'],
                  ['Envíos y Devoluciones', '/politicas'],
                  ['Catálogo completo', '/catalogo'],
                ].map(([label, path]) => (
                  <Link key={label} to={path}
                    className="block text-sm text-gray-500 hover:text-gold-400 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-gray-500">
                  <MapPin size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
                  <span>{settings.address || 'Medellín, Antioquia, Colombia'}</span>
                </div>
                {settings.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <Phone size={14} className="text-gold-500 flex-shrink-0" />
                    <a href={`tel:${settings.phone.replace(/\s/g,'')}`} className="hover:text-gold-400 transition-colors">{settings.phone}</a>
                  </div>
                )}
                {settings.whatsapp && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-500">
                    <MessageCircle size={14} className="text-green-500 flex-shrink-0" />
                    <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
                      className="hover:text-green-400 transition-colors">WhatsApp disponible</a>
                  </div>
                )}
                {settings.hours && (
                  <p className="text-xs text-gray-600 mt-2">{settings.hours}</p>
                )}
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '🔒', text: 'Pago 100% Seguro' },
              { icon: '🚚', text: 'Envío a toda Colombia' },
              { icon: '💎', text: 'Oro certificado' },
              { icon: '↩️', text: '30 días de garantía' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-dark-400/50 border border-white/5">
                <span className="text-lg">{b.icon}</span>
                <span className="text-xs text-gray-400 font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="divider-gold mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} GIORGIO Joyería. Medellín, Colombia. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/politicas" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Política de envíos</Link>
              <span className="text-gray-700">·</span>
              <Link to="/politicas" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Devoluciones</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp floating button */}
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </div>
  )
}
