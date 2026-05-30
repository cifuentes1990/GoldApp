import { useState, useEffect } from 'react'
import { TrendingUp, Users, ShoppingBag, Package, ArrowUpRight, AlertTriangle, Plus, ListOrdered, UserCog, Eye, Clock, CheckCircle2, Zap } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import api from '../../utils/api'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const STATUS_MAP = {
  pending:    { label: 'Pendiente',   cls: 'badge-gray',   urgent: false },
  paid:       { label: 'Pagado',      cls: 'badge-green',  urgent: true  },
  processing: { label: 'Procesando',  cls: 'badge-blue',   urgent: true  },
  shipped:    { label: 'Enviado',     cls: 'badge-blue',   urgent: false },
  delivered:  { label: 'Entregado',   cls: 'badge-gold',   urgent: false },
  cancelled:  { label: 'Cancelado',   cls: 'badge-red',    urgent: false },
}

const chartOpts = (yPrefix = '') => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#141414', borderColor: 'rgba(245,176,66,0.25)', borderWidth: 1,
      titleColor: '#F5B042', bodyColor: '#888',
      callbacks: { label: ctx => `${yPrefix}${ctx.parsed.y.toLocaleString('en-US')}` },
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#444', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#444', font: { size: 10 } } },
  },
})

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [urgentOrders, setUrgentOrders] = useState([])
  const [productStats, setProductStats] = useState({ active: 0, featured: 0, outOfStock: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/orders/admin/stats'),
      api.get('/users/admin/stats'),
      api.get('/products?limit=100'),
      api.get('/orders?status=paid&limit=5'),
    ]).then(([oRes, uRes, pRes, urgentRes]) => {
      setStats(oRes.data)
      setUserStats(uRes.data)

      const prods = pRes.data.products || []
      setLowStock(prods.filter(p => p.stock <= 3 && p.isActive && p.stock > 0))
      setProductStats({
        active: prods.filter(p => p.isActive).length,
        featured: prods.filter(p => p.featured).length,
        outOfStock: prods.filter(p => p.stock === 0).length,
      })

      const urgent = (urgentRes.data.orders || []).filter(o => STATUS_MAP[o.status]?.urgent)
      setUrgentOrders(urgent)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-32 shimmer-bg rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 shimmer-bg rounded-2xl" />)}
      </div>
      <div className="h-56 shimmer-bg rounded-2xl" />
    </div>
  )

  const totalRevenue = stats?.totalRevenue || 0
  const totalOrders  = stats?.totalOrders  || 0
  const totalUsers   = userStats?.totalUsers || 0
  const pendingAction = (stats?.ordersByStatus || []).filter(s => ['paid','processing'].includes(s._id)).reduce((a, s) => a + s.count, 0)

  const months   = stats?.monthlySales?.map(m => { const [y,mo] = m._id.split('-'); return new Date(y, mo-1).toLocaleDateString('es-ES',{month:'short'}) }) || []
  const revenues = stats?.monthlySales?.map(m => m.revenue) || []
  const counts   = stats?.monthlySales?.map(m => m.count)   || []

  const revenueData = {
    labels: months,
    datasets: [{ data: revenues, borderColor:'#F5B042', backgroundColor: ctx => { const g = ctx.chart.ctx.createLinearGradient(0,0,0,ctx.chart.height); g.addColorStop(0,'rgba(245,176,66,0.25)'); g.addColorStop(1,'rgba(245,176,66,0)'); return g }, fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#F5B042', borderWidth:2 }],
  }
  const countData = {
    labels: months,
    datasets: [{ data: counts, backgroundColor:'rgba(96,165,250,0.5)', borderColor:'#60A5FA', borderWidth:1, borderRadius:5 }],
  }

  return (
    <div className="space-y-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-wider text-white">DASHBOARD <span className="gold-text">ADMIN</span></h1>
          <p className="text-gray-500 mt-1 text-sm">Panel de control · {new Date().toLocaleDateString('es-CO', { weekday:'long', day:'2-digit', month:'long' })}</p>
        </div>
        {pendingAction > 0 && (
          <Link to="/admin/pedidos" className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-amber-500/50 transition-colors animate-pulse">
            <Zap size={13} /> {pendingAction} pedido(s) requieren acción
          </Link>
        )}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card group hover:border-gold-500/20 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Ingresos totales</p>
            <TrendingUp size={18} className="text-gold-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-gold-400 mb-1">${totalRevenue.toLocaleString('en-US',{maximumFractionDigits:0})}</p>
          <p className="text-xs text-gray-600">USD acumulado</p>
        </div>

        <div className="stat-card group hover:border-blue-500/20 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total pedidos</p>
            <ShoppingBag size={18} className="text-blue-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-blue-400 mb-1">{totalOrders}</p>
          <div className="flex items-center gap-1.5">
            {pendingAction > 0 && <span className="text-xs text-amber-400 font-semibold">{pendingAction} por procesar</span>}
            {pendingAction === 0 && <span className="text-xs text-gray-600">al día ✓</span>}
          </div>
        </div>

        <div className="stat-card group hover:border-purple-500/20 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Usuarios</p>
            <Users size={18} className="text-purple-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-purple-400 mb-1">{totalUsers}</p>
          <p className="text-xs text-gray-600">+{userStats?.newUsersThisMonth || 0} este mes</p>
        </div>

        <div className="stat-card group hover:border-green-500/20 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Productos activos</p>
            <Package size={18} className="text-green-400" />
          </div>
          <p className="text-2xl font-mono font-bold text-green-400 mb-1">{productStats.active}</p>
          <div className="flex gap-2 text-xs">
            <span className="text-gold-500">★{productStats.featured} dest.</span>
            {productStats.outOfStock > 0 && <span className="text-red-400">✕{productStats.outOfStock} sin stock</span>}
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/admin/productos', icon: Plus,        label: 'Nuevo producto',     desc: 'Agregar al catálogo',    color: 'text-gold-400',   border: 'border-gold-500/20   hover:border-gold-500/50   bg-gold-500/5'   },
          { to: '/admin/pedidos',   icon: ListOrdered, label: 'Gestionar pedidos',  desc: `${pendingAction} por atender`, color: 'text-blue-400',   border: `border-blue-500/20   hover:border-blue-500/50   bg-blue-500/5   ${pendingAction > 0 ? 'animate-pulse' : ''}`   },
          { to: '/admin/usuarios',  icon: UserCog,     label: 'Usuarios',           desc: `${totalUsers} registrados`, color: 'text-purple-400', border: 'border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5' },
          { to: '/catalogo',        icon: Eye,         label: 'Ver tienda',         desc: 'Como cliente',           color: 'text-green-400',  border: 'border-green-500/20  hover:border-green-500/50  bg-green-500/5'  },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${a.border}`}>
            <a.icon size={20} className={`flex-shrink-0 ${a.color}`} />
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${a.color}`}>{a.label}</p>
              <p className="text-xs text-gray-600 truncate">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Urgent orders alert ── */}
      {urgentOrders.length > 0 && (
        <div className="glass-card border border-amber-500/25 bg-amber-500/4 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/15">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-amber-400" />
              <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider">Pedidos pagados — requieren despacho</h3>
            </div>
            <Link to="/admin/pedidos" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-amber-500/10">
            {urgentOrders.map(order => (
              <Link key={order._id} to="/admin/pedidos"
                className="flex items-center gap-4 px-5 py-3 hover:bg-amber-500/5 transition-colors group">
                <Clock size={14} className="text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-white font-bold">{order.orderNumber}</span>
                  <span className="text-gray-500 text-xs ml-3">{order.user?.name}</span>
                </div>
                <span className={`badge text-xs ${STATUS_MAP[order.status]?.cls}`}>{STATUS_MAP[order.status]?.label}</span>
                <span className="font-mono text-sm text-gold-400 font-bold flex-shrink-0">${order.total?.toFixed(2)}</span>
                <ArrowUpRight size={13} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Low stock alert ── */}
      {lowStock.length > 0 && (
        <div className="glass-card border border-red-500/20 bg-red-500/3 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-400" />
              <h3 className="font-bold text-red-400 text-sm uppercase tracking-wider">Stock crítico — {lowStock.length} producto(s)</h3>
            </div>
            <Link to="/admin/productos" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              Reabastecer <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-400/50 border border-red-500/10">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-dark-300 flex-shrink-0"
                  onError={e => { e.target.style.display='none' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs font-mono font-bold text-amber-400">{p.stock} restante(s)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Ingresos mensuales</h3>
            <span className="text-xs text-gray-600 font-mono">USD</span>
          </div>
          <div style={{ height: '190px' }}>
            {revenues.length > 0
              ? <Line data={revenueData} options={chartOpts('$')} />
              : <div className="flex items-center justify-center h-full text-gray-600 text-sm">Sin datos aún</div>}
          </div>
        </div>
        <div className="glass-card p-6 border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Pedidos por mes</h3>
            <span className="text-xs text-gray-600 font-mono"># pedidos</span>
          </div>
          <div style={{ height: '190px' }}>
            {counts.length > 0
              ? <Bar data={countData} options={chartOpts()} />
              : <div className="flex items-center justify-center h-full text-gray-600 text-sm">Sin datos aún</div>}
          </div>
        </div>
      </div>

      {/* ── Bottom panel: recent orders + breakdown + top buyers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent orders */}
        <div className="lg:col-span-2 glass-card border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Pedidos recientes</h3>
            <Link to="/admin/pedidos" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {!stats?.recentOrders?.length && (
              <p className="p-8 text-gray-600 text-sm text-center">Sin pedidos aún</p>
            )}
            {stats?.recentOrders?.map(order => {
              const st = STATUS_MAP[order.status] || STATUS_MAP.pending
              const isUrgent = STATUS_MAP[order.status]?.urgent
              return (
                <div key={order._id} className={`px-5 py-3.5 flex items-center gap-3 hover:bg-white/2 transition-colors ${isUrgent ? 'border-l-2 border-amber-500/60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-white font-bold">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString('es-CO', { day:'2-digit', month:'short' })}</p>
                  </div>
                  <span className={`badge text-xs ${st.cls} flex-shrink-0`}>{st.label}</span>
                  <p className="font-mono text-sm text-gold-400 font-bold flex-shrink-0">${order.total?.toFixed(2)}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status breakdown + top buyers */}
        <div className="space-y-5">
          <div className="glass-card border border-white/5 p-5">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Estado de pedidos</h3>
            <div className="space-y-2.5">
              {stats?.ordersByStatus?.map(s => {
                const info = STATUS_MAP[s._id] || { label: s._id, cls: 'badge-gray' }
                const pct = totalOrders > 0 ? Math.round((s.count / totalOrders) * 100) : 0
                return (
                  <div key={s._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`badge text-xs ${info.cls}`}>{info.label}</span>
                      <span className="font-mono text-sm text-white">{s.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-dark-300">
                      <div className="h-1 rounded-full bg-gold-500/60 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {!stats?.ordersByStatus?.length && <p className="text-gray-600 text-sm">Sin datos</p>}
            </div>
          </div>

          <div className="glass-card border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={14} className="text-gold-400" />
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Top compradores</h3>
            </div>
            <div className="space-y-3">
              {userStats?.topBuyers?.map((b, i) => (
                <div key={b._id} className="flex items-center gap-3">
                  <span className={`text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-gold-500 text-dark-600 font-bold' : 'bg-dark-300 text-gray-500'}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate font-medium">{b.user?.name}</p>
                    <p className="text-xs text-gray-600">{b.orderCount} pedido(s)</p>
                  </div>
                  <span className="text-xs font-mono text-gold-400 font-bold">${b.totalSpent?.toFixed(0)}</span>
                </div>
              ))}
              {!userStats?.topBuyers?.length && <p className="text-gray-600 text-sm">Sin datos</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
