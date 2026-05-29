import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut,
  Menu, X, ChevronRight, Home, AlertTriangle, Zap, Settings,
} from 'lucide-react'
import api from '../../utils/api'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [badges, setBadges] = useState({ lowStock: 0, urgentOrders: 0 })

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const [pRes, oRes] = await Promise.all([
          api.get('/products?limit=100'),
          api.get('/orders/admin/stats'),
        ])
        const lowStock = (pRes.data.products || []).filter(p => p.stock <= 3 && p.isActive).length
        const urgentOrders = (oRes.data.ordersByStatus || [])
          .filter(s => ['paid','processing'].includes(s._id))
          .reduce((a, s) => a + s.count, 0)
        setBadges({ lowStock, urgentOrders })
      } catch {}
    }
    fetchBadges()
    const interval = setInterval(fetchBadges, 60_000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/productos', label: 'Productos', icon: Package, badge: badges.lowStock, badgeColor: 'bg-amber-500/20 text-amber-400', badgeIcon: AlertTriangle },
    { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag, badge: badges.urgentOrders, badgeColor: 'bg-red-500/20 text-red-400', badgeIcon: Zap },
    { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  ]

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  const Sidebar = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="text-2xl">⚜</span>
          <div>
            <p className="font-display text-2xl tracking-widest gold-text leading-none">AURUM</p>
            <p className="text-xs text-gray-600 tracking-widest uppercase mt-0.5">Panel administrativo</p>
          </div>
        </Link>
      </div>

      {/* Alert strip if urgent */}
      {badges.urgentOrders > 0 && (
        <Link to="/admin/pedidos"
          className="mx-3 mt-3 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5 hover:border-amber-500/40 transition-colors">
          <Zap size={13} className="text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400 font-semibold">{badges.urgentOrders} pedido(s) sin procesar</p>
        </Link>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-1">
        <p className="text-xs text-gray-700 uppercase tracking-widest font-semibold px-3 mb-3">Gestión</p>
        {navItems.map(item => {
          const active = isActive(item)
          const BadgeIcon = item.badgeIcon
          return (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
                }`}>
              <item.icon size={17} className={active ? 'text-gold-400' : 'text-gray-500 group-hover:text-gray-300'} />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-mono px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                  {BadgeIcon && <BadgeIcon size={9} />}{item.badge}
                </span>
              )}
              {active && !item.badge && <ChevronRight size={13} className="text-gold-400" />}
            </Link>
          )
        })}

        <div className="pt-4">
          <p className="text-xs text-gray-700 uppercase tracking-widest font-semibold px-3 mb-3">Sistema</p>
          <Link to="/" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all border border-transparent">
            <Home size={17} className="text-gray-600" /> Ver tienda
          </Link>
        </div>
      </nav>

      {/* User card at bottom */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-400 border border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-dark-600 text-sm font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gold-500 truncate">⚜ Administrador</p>
          </div>
          <button onClick={logout} title="Cerrar sesión"
            className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-dark-600 overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-dark-500 border-r border-white/5">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-dark-500 border-r border-white/5 flex flex-col z-10">
            <button onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors z-10">
              <X size={18} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-16 border-b border-white/5 bg-dark-500/80 backdrop-blur-sm flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors relative">
            <Menu size={20} />
            {(badges.urgentOrders + badges.lowStock) > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
            )}
          </button>
          <span className="font-display text-xl tracking-widest gold-text flex-1">AURUM</span>
          <span className="text-xs text-gray-500 border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Settings size={10} /> ADMIN
          </span>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto bg-dark-600 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
