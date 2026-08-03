import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, User, ShoppingBag, ChevronRight, TrendingUp, Clock, Star, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import api from '../utils/api'

const STATUS_MAP = {
  pending: { label: 'Pendiente', cls: 'badge-gray' },
  paid: { label: 'Pagado', cls: 'badge-green' },
  processing: { label: 'Procesando', cls: 'badge-blue' },
  shipped: { label: 'Enviado', cls: 'badge-blue' },
  delivered: { label: 'Entregado', cls: 'badge-gold' },
  cancelled: { label: 'Cancelado', cls: 'badge-red' },
}

export default function MiCuentaPage() {
  const { user } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders?limit=5')
      .then(res => setOrders(res.data.orders?.slice(0, 5) || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const activeOrders = orders.filter(o => ['paid', 'processing', 'shipped'].includes(o.status)).length

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Buenos días' : greetingHour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const firstName = user?.name?.split(' ')[0] || 'cliente'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Welcome banner */}
      <div className="gold-card p-7 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center flex-shrink-0 text-dark-600 text-2xl font-bold shadow-lg">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-gold-300 text-sm tracking-wider">{greeting},</p>
          <h1 className="text-2xl font-display tracking-widest text-white">{firstName.toUpperCase()} <span className="gold-text">⚜</span></h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.email}</p>
        </div>
        <Link to="/perfil" className="btn-outline flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">
          <User size={14} /> Editar perfil
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pedidos realizados', value: loading ? '…' : totalOrders, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'En camino / activos', value: loading ? '…' : activeOrders, icon: Package, color: 'text-gold-400', bg: 'bg-gold-500/10' },
          { label: 'Total gastado', value: loading ? '…' : `$${totalSpent.toFixed(0)}`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Favoritos guardados', value: wishlistCount, icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5 border border-white/5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="lg:col-span-2 glass-card border border-white/5">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Pedidos recientes</h2>
            <Link to="/pedidos" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {Array(3).fill(0).map((_, i) => <div key={i} className="h-14 shimmer-bg rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingBag size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">Aún no has realizado pedidos</p>
              <Link to="/catalogo" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">
                <Star size={14} /> Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {orders.map(order => {
                const st = STATUS_MAP[order.status] || STATUS_MAP.pending
                return (
                  <Link key={order._id} to={`/pedidos/${order._id}`}
                    className="p-4 flex items-center gap-3 hover:bg-white/3 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-white font-bold">{order.orderNumber}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-gray-600" />
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <span>·</span>
                        <p className="text-xs text-gray-600">{order.items?.length} item(s)</p>
                      </div>
                    </div>
                    <span className={`badge text-xs ${st.cls}`}>{st.label}</span>
                    <p className="font-mono text-sm text-gold-400 font-bold flex-shrink-0">${order.total?.toFixed(2)}</p>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h2 className="font-bold text-white text-sm uppercase tracking-wider px-1">Accesos rápidos</h2>

          {[
            { to: '/pedidos', icon: Package, label: 'Mis pedidos', desc: `${loading ? '…' : totalOrders} pedidos realizados`, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/15' },
            { to: '/favoritos', icon: Heart, label: 'Mis favoritos', desc: `${wishlistCount} productos guardados`, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/15' },
            { to: '/perfil', icon: User, label: 'Mi perfil', desc: 'Datos personales y dirección', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/15' },
            { to: '/catalogo', icon: Star, label: 'Catálogo', desc: 'Explorar colección completa', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/15' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-4 p-4 rounded-xl border ${item.bg} hover:border-opacity-40 transition-all group`}>
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon size={18} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight size={14} className={`${item.color} opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0`} />
            </Link>
          ))}

          {/* Loyalty badge */}
          <div className="glass-card p-4 border border-gold-500/15 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚜</span>
              <p className="text-sm font-bold text-gold-400">Cliente GIORGIO</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Gracias por tu confianza. Como cliente registrado disfrutas de envío gratuito en compras mayores a $300 USD.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
