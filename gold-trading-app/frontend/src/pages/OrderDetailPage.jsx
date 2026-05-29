import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, CheckCircle, Truck, Copy } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const STATUS_MAP = {
  pending:    { label: 'Pendiente',  cls: 'badge-gray',  step: 0 },
  paid:       { label: 'Pagado',     cls: 'badge-green', step: 1 },
  processing: { label: 'Procesando', cls: 'badge-blue',  step: 2 },
  shipped:    { label: 'Enviado',    cls: 'badge-blue',  step: 3 },
  delivered:  { label: 'Entregado',  cls: 'badge-gold',  step: 4 },
  cancelled:  { label: 'Cancelado',  cls: 'badge-red',   step: -1 },
}

const STEPS = [
  { label: 'Pendiente', icon: '📋' },
  { label: 'Pagado',    icon: '✅' },
  { label: 'Preparando',icon: '📦' },
  { label: 'En camino', icon: '🚚' },
  { label: 'Entregado', icon: '🎉' },
]

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
      <div className="h-12 shimmer-bg rounded-xl w-32" />
      <div className="h-48 shimmer-bg rounded-2xl" />
      <div className="h-64 shimmer-bg rounded-2xl" />
    </div>
  )

  if (!order) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-4">📦</p>
      <p className="text-gray-400 text-lg">Pedido no encontrado</p>
      <Link to="/pedidos" className="btn-outline mt-4 inline-flex px-5 py-2.5 rounded-xl text-sm">Mis pedidos</Link>
    </div>
  )

  const st = STATUS_MAP[order.status] || STATUS_MAP.pending
  const step = st.step

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber)
    toast.success('Número copiado')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <Link to="/pedidos" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors mb-6 text-sm">
        <ArrowLeft size={15} /> Mis pedidos
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Número de pedido</p>
          <button onClick={copyOrderNumber} className="flex items-center gap-2 group">
            <h1 className="text-lg font-mono font-bold text-white group-hover:text-gold-400 transition-colors">{order.orderNumber}</h1>
            <Copy size={13} className="text-gray-600 group-hover:text-gold-400 transition-colors" />
          </button>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}
          </p>
        </div>
        <span className={`badge text-sm px-4 py-2 ${st.cls}`}>{st.label}</span>
      </div>

      {/* Progress stepper */}
      {step >= 0 && (
        <div className="glass-card p-5 sm:p-6 mb-5 border border-white/5">
          {/* Mobile: linear steps */}
          <div className="flex sm:hidden flex-col gap-3">
            {STEPS.map((s, i) => (
              <div key={s.label} className={`flex items-center gap-3 ${i > step ? 'opacity-30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${i <= step ? 'bg-gold-500' : 'bg-dark-300'}`}>
                  {i <= step ? '✓' : s.icon}
                </div>
                <span className={`text-sm font-medium ${i === step ? 'text-gold-400' : i < step ? 'text-gray-300' : 'text-gray-600'}`}>{s.label}</span>
                {i === step && <span className="text-xs text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded-full ml-auto">Actual</span>}
              </div>
            ))}
          </div>
          {/* Desktop: horizontal stepper */}
          <div className="hidden sm:flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-dark-100" />
            <div className="absolute left-0 top-4 h-0.5 bg-gold-500 transition-all duration-700"
              style={{ width: `${(step / 4) * 100}%` }} />
            {STEPS.map((s, i) => (
              <div key={s.label} className="relative flex flex-col items-center gap-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  i <= step ? 'bg-gold-500 border-gold-500' : 'bg-dark-400 border-dark-100'
                }`}>
                  {i <= step ? <CheckCircle size={14} className="text-dark-600" /> : <span className="text-xs text-gray-600">{i+1}</span>}
                </div>
                <span className={`text-xs font-medium text-center max-w-[60px] ${i <= step ? 'text-gold-400' : 'text-gray-600'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking number */}
      {order.trackingNumber && (
        <div className="glass-card p-4 mb-5 border border-blue-500/20 bg-blue-500/5 flex items-center gap-3">
          <Truck size={18} className="text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Número de guía</p>
            <p className="font-mono text-sm font-bold text-white">{order.trackingNumber}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(order.trackingNumber); toast.success('Guía copiada') }}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
            <Copy size={14} />
          </button>
        </div>
      )}

      {/* Products */}
      <div className="glass-card p-5 border border-white/5 mb-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
          <Package size={14} className="text-gold-400" /> Productos ({order.items?.length})
        </h3>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.image} alt={item.name}
                className="w-14 h-14 rounded-xl object-cover bg-dark-400 flex-shrink-0"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&q=80' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{item.weight}g · {item.purity}K · x{item.quantity}</p>
              </div>
              <p className="font-mono text-gold-400 font-bold text-sm flex-shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="glass-card p-5 border border-white/5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <MapPin size={14} className="text-gold-400" /> Envío
            </h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="text-white font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.country} {order.shippingAddress.zipCode}</p>
              {order.shippingAddress.phone && (
                <a href={`tel:${order.shippingAddress.phone}`} className="text-gold-400 hover:text-gold-300 transition-colors block mt-1">
                  {order.shippingAddress.phone}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="glass-card p-5 border border-white/5">
          <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Resumen</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-mono text-white">${order.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Envío</span>
              <span className={`font-mono ${order.shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                {order.shipping === 0 ? 'GRATIS' : `$${order.shipping?.toFixed(2)}`}
              </span>
            </div>
            <div className="divider-gold my-2" />
            <div className="flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="font-mono text-gold-400 text-base">${order.total?.toFixed(2)} {order.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gift message */}
      {order.notes && (
        <div className="glass-card p-4 mt-4 border border-gold-500/15 bg-gold-500/5">
          <p className="text-xs text-gold-500 mb-1 font-semibold uppercase tracking-wider">Mensaje de regalo</p>
          <p className="text-sm text-gray-300 italic">"{order.notes}"</p>
        </div>
      )}

      {/* Help */}
      <div className="mt-6 p-4 rounded-xl bg-dark-400/50 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-xs text-gray-500">¿Necesitas ayuda con tu pedido?</p>
        <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
          className="text-xs text-green-400 hover:text-green-300 font-semibold flex items-center gap-1.5 transition-colors">
          💬 Contáctanos por WhatsApp
        </a>
      </div>
    </div>
  )
}
