import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight, Clock, LayoutGrid } from 'lucide-react'
import api from '../utils/api'

const STATUS_MAP = {
  pending: { label: 'Pendiente', cls: 'badge-gray' },
  paid: { label: 'Pagado', cls: 'badge-green' },
  processing: { label: 'Procesando', cls: 'badge-blue' },
  shipped: { label: 'Enviado', cls: 'badge-blue' },
  delivered: { label: 'Entregado', cls: 'badge-gold' },
  cancelled: { label: 'Cancelado', cls: 'badge-red' },
}

const STATUS_FILTERS = [
  { key: '', label: 'Todos' },
  { key: 'paid', label: 'Pagado' },
  { key: 'processing', label: 'Procesando' },
  { key: 'shipped', label: 'Enviado' },
  { key: 'delivered', label: 'Entregado' },
  { key: 'cancelled', label: 'Cancelado' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [activeFilter, setActiveFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = activeFilter ? `?status=${activeFilter}` : ''
    api.get(`/orders${params}`)
      .then(res => { setOrders(res.data.orders); setTotal(res.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeFilter])

  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-1">Historial</p>
          <h1 className="text-3xl font-display tracking-wider text-white">MIS <span className="gold-text">PEDIDOS</span></h1>
          {total > 0 && <p className="text-gray-500 mt-1 text-sm">{total} pedidos realizados</p>}
        </div>
        <Link to="/mi-cuenta" className="btn-outline flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap self-start sm:self-auto">
          <LayoutGrid size={14} /> Mi cuenta
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map(f => {
          const count = f.key ? counts[f.key] || 0 : Object.values(counts).reduce((a, b) => a + b, 0)
          const isActive = activeFilter === f.key
          return (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'bg-dark-400/60 text-gray-400 border border-white/5 hover:border-white/10 hover:text-gray-300'
              }`}>
              {f.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-gold-500/20 text-gold-400' : 'bg-dark-300 text-gray-600'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => <div key={i} className="h-24 shimmer-bg rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400 mb-2">
            {activeFilter ? `Sin pedidos con estado "${STATUS_MAP[activeFilter]?.label}"` : 'Sin pedidos aún'}
          </p>
          {activeFilter ? (
            <button onClick={() => setActiveFilter('')} className="btn-outline mt-4 px-5 py-2.5 rounded-xl text-sm">
              Ver todos
            </button>
          ) : (
            <Link to="/catalogo" className="btn-gold inline-flex mt-4 px-6 py-3 rounded-xl text-sm font-bold">
              Ver catálogo
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.pending
            return (
              <Link key={order._id} to={`/pedidos/${order._id}`}
                className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-white/5 hover:border-gold-500/20 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                    <span className={`badge ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(order.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span>{order.items?.length} item(s)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-gold-400 text-lg">${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-gray-600">{order.currency}</p>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
