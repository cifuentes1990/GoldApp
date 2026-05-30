import { useState, useEffect, useCallback } from 'react'
import { Search, Eye, Loader2, X, Download, Zap, ChevronLeft, ChevronRight, MapPin, Phone } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

const STATUS_MAP = {
  pending:    { label: 'Pendiente',   cls: 'badge-gray',   urgent: false },
  paid:       { label: 'Pagado',      cls: 'badge-green',  urgent: true  },
  processing: { label: 'Procesando',  cls: 'badge-blue',   urgent: true  },
  shipped:    { label: 'Enviado',     cls: 'badge-blue',   urgent: false },
  delivered:  { label: 'Entregado',   cls: 'badge-gold',   urgent: false },
  cancelled:  { label: 'Cancelado',   cls: 'badge-red',    urgent: false },
}

const STATUS_FILTERS = [
  { key: '', label: 'Todos' },
  { key: 'paid', label: 'Pagados' },
  { key: 'processing', label: 'Procesando' },
  { key: 'shipped', label: 'Enviados' },
  { key: 'delivered', label: 'Entregados' },
  { key: 'cancelled', label: 'Cancelados' },
]

function OrderModal({ order, onClose, onStatusChanged }) {
  const [newStatus, setNewStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const st = STATUS_MAP[order.status] || STATUS_MAP.pending

  const handleSave = async () => {
    const changed = newStatus !== order.status || trackingNumber !== (order.trackingNumber || '')
    if (!changed) { toast('Sin cambios'); return }
    setSaving(true)
    try {
      await api.patch(`/orders/${order._id}/status`, { status: newStatus, note, trackingNumber })
      toast.success(`Estado actualizado: ${STATUS_MAP[newStatus]?.label}`)
      onStatusChanged(); onClose()
    } catch (err) { toast.error(err.response?.data?.error || 'Error al actualizar') } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-dark-500 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-dark-500 px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Pedido</p>
              <h2 className="font-mono font-bold text-white">{order.orderNumber}</h2>
            </div>
            <span className={`badge ${st.cls}`}>{st.label}</span>
            {STATUS_MAP[order.status]?.urgent && (
              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                <Zap size={10} /> Requiere acción
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Cliente</p>
              <p className="font-semibold text-white">{order.user?.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{order.user?.email}</p>
              {order.user?.phone && (
                <a href={`https://wa.me/${order.user.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-green-400 text-xs mt-2 hover:text-green-300 transition-colors">
                  <Phone size={11} /> {order.user.phone}
                </a>
              )}
            </div>
            {order.shippingAddress && (
              <div className="glass-card p-4 border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><MapPin size={10} /> Enviar a</p>
                <p className="font-semibold text-white text-sm">{order.shippingAddress.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                  {order.shippingAddress.country} {order.shippingAddress.zipCode}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Productos ({order.items?.length})</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-dark-400/50 border border-white/5">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-dark-400 flex-shrink-0"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&q=60' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity} · {item.weight}g · {item.purity}K</p>
                  </div>
                  <p className="font-mono text-gold-400 text-sm font-bold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="glass-card p-4 border border-white/5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-mono text-white">${order.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Envío</span><span className={`font-mono ${order.shipping === 0 ? 'text-green-400' : 'text-white'}`}>{order.shipping === 0 ? 'GRATIS' : `$${order.shipping?.toFixed(2)}`}</span></div>
            <div className="divider-gold my-1" />
            <div className="flex justify-between font-bold"><span className="text-white">Total</span><span className="font-mono text-gold-400 text-base">${order.total?.toFixed(2)} {order.currency}</span></div>
          </div>

          {/* Status + tracking */}
          <div className="bg-dark-400/50 border border-white/5 rounded-xl p-5 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Actualizar pedido</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Nuevo estado</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-gold px-3 py-2.5 text-sm cursor-pointer">
                  {Object.entries(STATUS_MAP).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Número de guía (opcional)</label>
                <input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="Ej: SRV-123456789" className="input-gold px-3 py-2.5 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Nota interna (opcional)</label>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Comentario sobre el cambio..."
                className="input-gold px-3 py-2.5 text-sm" />
            </div>

            <button onClick={handleSave} disabled={saving}
              className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null} Guardar cambios
            </button>
          </div>

          {/* Status history */}
          {order.statusHistory?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Historial de cambios</p>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className={`badge ${STATUS_MAP[h.status]?.cls || 'badge-gray'} flex-shrink-0 mt-0.5`}>{STATUS_MAP[h.status]?.label || h.status}</span>
                    <div className="flex-1">
                      {h.note && <p className="text-gray-400">{h.note}</p>}
                      <p className="text-gray-600">{new Date(h.date).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function exportToCSV(orders) {
  const headers = ['Número','Cliente','Email','Teléfono','Fecha','Items','Subtotal','Envío','Total','Moneda','Estado','Método de pago','Ciudad','Departamento']
  const rows = orders.map(o => [
    o.orderNumber, o.user?.name||'', o.user?.email||'', o.shippingAddress?.phone||'',
    new Date(o.createdAt).toLocaleDateString('es-CO'), o.items?.length||0,
    o.subtotal?.toFixed(2), o.shipping?.toFixed(2), o.total?.toFixed(2),
    o.currency, STATUS_MAP[o.status]?.label||o.status, o.paymentMethod||'',
    o.shippingAddress?.city||'', o.shippingAddress?.state||'',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿'+csv], { type:'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=`pedidos-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [statusCounts, setStatusCounts] = useState({})
  const debouncedSearch = useDebounce(search, 400)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 15, ...(statusFilter ? { status: statusFilter } : {}), ...(debouncedSearch ? { search: debouncedSearch } : {}) })
      const res = await api.get(`/orders?${params}`)
      setOrders(res.data.orders)
      setTotal(res.data.total)
      setPages(res.data.pages || 1)
    } catch { } finally { setLoading(false) }
  }, [page, statusFilter, debouncedSearch])

  // Status counts for tab badges
  useEffect(() => {
    api.get('/orders/admin/stats').then(res => {
      const counts = {}
      ;(res.data.ordersByStatus || []).forEach(s => { counts[s._id] = s.count })
      setStatusCounts(counts)
    }).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const urgentInView = orders.filter(o => STATUS_MAP[o.status]?.urgent).length

  return (
    <div className="space-y-6">
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChanged={load} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-wider text-white">GESTIÓN <span className="gold-text">PEDIDOS</span></h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{total} pedidos</span>
            {urgentInView > 0 && (
              <><span>·</span><span className="flex items-center gap-1 text-amber-400"><Zap size={10} />{urgentInView} requieren acción</span></>
            )}
          </div>
        </div>
        <button onClick={() => exportToCSV(orders)} disabled={orders.length === 0}
          className="btn-outline flex items-center gap-2 px-4 py-2.5 text-sm disabled:opacity-40 flex-shrink-0">
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_FILTERS.map(f => {
          const count = f.key ? (statusCounts[f.key] || 0) : Object.values(statusCounts).reduce((a,b)=>a+b,0)
          const isActive = statusFilter === f.key
          const isUrgentTab = ['paid','processing'].includes(f.key)
          return (
            <button key={f.key} onClick={() => { setStatusFilter(f.key); setPage(1) }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                  : `bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15 hover:text-gray-200 ${isUrgentTab && count > 0 ? 'border-amber-500/20' : ''}`
              }`}>
              {isUrgentTab && count > 0 && !isActive && <Zap size={9} className="text-amber-400" />}
              {f.label}
              {count > 0 && (
                <span className={`font-mono text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-gold-500/20 text-gold-400' : isUrgentTab ? 'bg-amber-500/15 text-amber-400' : 'bg-dark-300 text-gray-600'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Número de pedido o cliente..."
          className="input-gold pl-9 pr-4 py-2.5 text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={13} /></button>}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {loading && Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-24 shimmer-bg rounded-2xl" />
        ))}
        {!loading && orders.map(order => {
          const st = STATUS_MAP[order.status] || STATUS_MAP.pending
          const urgent = STATUS_MAP[order.status]?.urgent
          return (
            <button key={order._id} onClick={() => setSelectedOrder(order)}
              className={`w-full glass-card p-4 border text-left transition-all active:scale-[.98] ${urgent ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {urgent && <Zap size={11} className="text-amber-400 flex-shrink-0" />}
                  <span className="font-mono text-xs font-bold text-white truncate">{order.orderNumber}</span>
                </div>
                <span className={`badge ${st.cls} flex-shrink-0`}>{st.label}</span>
              </div>
              <p className="text-sm text-gray-300 font-medium truncate">{order.user?.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('es-CO',{day:'2-digit',month:'short'})} · {order.items?.length} ítem{order.items?.length !== 1 ? 's' : ''}
                </span>
                <span className="font-mono text-gold-400 font-bold text-sm">${order.total?.toFixed(2)}</span>
              </div>
            </button>
          )
        })}
        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-600 py-12">No se encontraron pedidos</p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-dark-400/30">
                {['Número','Cliente','Fecha','Ciudad','Items','Total','Estado','Acción'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && Array(10).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 shimmer-bg rounded-lg" /></td></tr>
              ))}
              {!loading && orders.map(order => {
                const st = STATUS_MAP[order.status] || STATUS_MAP.pending
                const urgent = STATUS_MAP[order.status]?.urgent
                return (
                  <tr key={order._id} className={`table-row hover:bg-white/2 transition-colors ${urgent ? 'border-l-2 border-amber-500/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {urgent && <Zap size={11} className="text-amber-400 flex-shrink-0" />}
                        <span className="font-mono text-xs text-white font-bold">{order.orderNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs font-medium truncate max-w-[130px]">{order.user?.name}</p>
                      <p className="text-xs text-gray-600 truncate max-w-[130px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'2-digit'})}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{order.shippingAddress?.city || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{order.items?.length}</td>
                    <td className="px-4 py-3 font-mono text-gold-400 font-bold text-xs">${order.total?.toFixed(2)}</td>
                    <td className="px-4 py-3"><span className={`badge ${st.cls}`}>{st.label}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 text-xs font-medium transition-colors">
                        <Eye size={12} /> Ver
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-14 text-center text-gray-600">No se encontraron pedidos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">Página {page} de {pages} · {total} pedidos</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-outline p-2 disabled:opacity-30"><ChevronLeft size={15} /></button>
            {Array.from({length:Math.min(pages,7)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p===page?'bg-gold-500 text-dark-600':'btn-outline'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-outline p-2 disabled:opacity-30"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
