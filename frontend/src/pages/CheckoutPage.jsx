import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, CheckCircle, Loader2, Lock, Tag, X } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const CURRENCIES = [
  { code: 'USD', label: 'USD – Dólar estadounidense', rate: 1 },
  { code: 'COP', label: 'COP – Peso colombiano', rate: 4150 },
]

const DEPARTAMENTOS = [
  'Antioquia','Atlántico','Bogotá D.C.','Bolívar','Boyacá','Caldas','Caquetá',
  'Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Huila','La Guajira',
  'Magdalena','Meta','Nariño','Norte de Santander','Quindío','Risaralda',
  'San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca',
  'Arauca','Casanare','Putumayo','Amazonas','Guainía','Guaviare','Vaupés','Vichada',
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState('COP')
  const [coupon, setCoupon] = useState('')          // texto del input
  const [applied, setApplied] = useState(null)      // { code, discount, description }
  const [couponMsg, setCouponMsg] = useState('')    // mensaje de error
  const [applying, setApplying] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || 'Antioquia',
    country: 'Colombia',
    zipCode: user?.address?.zipCode || '',
    phone: user?.phone || '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    giftMessage: '',
  })

  const cur = CURRENCIES.find(c => c.code === currency)
  const shipping = total > 300 ? 0 : 15
  const discount = applied?.discount || 0
  const totalUSD = Math.max(0, total + shipping - discount)
  const totalConverted = totalUSD * cur.rate

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    setApplying(true)
    setCouponMsg('')
    try {
      const res = await api.post('/coupons/validate', { code: coupon.trim(), subtotal: total })
      setApplied(res.data)
      setCouponMsg('')
      toast.success(`Cupón aplicado · -$${res.data.discount.toFixed(2)}`)
    } catch (err) {
      setApplied(null)
      setCouponMsg(err.response?.data?.error || 'Cupón inválido')
    } finally { setApplying(false) }
  }

  const removeCoupon = () => { setApplied(null); setCoupon(''); setCouponMsg('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.street || !form.city) {
      toast.error('Completa la dirección de envío')
      return
    }
    if (!form.cardName || !form.cardNumber || !form.cardExpiry || !form.cardCvv) {
      toast.error('Completa los datos de pago')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/orders', {
        items: items.map(i => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: {
          name: form.name, street: form.street, city: form.city,
          state: form.state, country: form.country, zipCode: form.zipCode, phone: form.phone,
        },
        paymentMethod: 'card',
        currency,
        notes: form.giftMessage || undefined,
        couponCode: applied?.code || undefined,
      })
      clearCart()
      toast.success('¡Pedido realizado con éxito! ⚜')
      navigate(`/pedidos/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al procesar el pedido')
    } finally { setLoading(false) }
  }

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const inp = 'input-gold px-3 py-3 text-sm'
  const lbl = 'text-xs text-gray-500 uppercase tracking-wider mb-1.5 block'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-1">Pago</p>
        <h1 className="text-3xl font-display tracking-wider text-white">CHECKOUT <span className="gold-text">SEGURO</span></h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Left: forms ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Shipping address */}
          <div className="glass-card p-5 border border-white/8">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <MapPin size={15} className="text-gold-400" /> Dirección de envío
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl}>Nombre completo *</label>
                <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
                  placeholder="Como aparece en el documento" className={inp} required />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Dirección *</label>
                <input type="text" value={form.street} onChange={e => setField('street', e.target.value)}
                  placeholder="Calle 123 # 45-67, Apto 8" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Ciudad / Municipio *</label>
                <input type="text" value={form.city} onChange={e => setField('city', e.target.value)}
                  placeholder="Medellín" className={inp} required />
              </div>
              <div>
                <label className={lbl}>Código postal</label>
                <input type="text" value={form.zipCode} onChange={e => setField('zipCode', e.target.value)}
                  placeholder="050001" className={inp} />
              </div>
              <div>
                <label className={lbl}>Departamento</label>
                <select value={form.state} onChange={e => setField('state', e.target.value)}
                  className={`${inp} cursor-pointer`}>
                  {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>País</label>
                <input value="Colombia" readOnly className={`${inp} opacity-50 cursor-not-allowed`} />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Teléfono / WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={e => setField('phone', e.target.value)}
                  placeholder="+57 300 000 0000" className={inp} required />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Mensaje de regalo <span className="text-gray-600 normal-case lowercase">(opcional)</span></label>
                <textarea value={form.giftMessage} onChange={e => setField('giftMessage', e.target.value)}
                  rows={2} placeholder="Ej: Para ti con todo mi amor ❤️"
                  className={`${inp} resize-none`} />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="glass-card p-5 border border-white/8">
            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Moneda de pago</h3>
            <div className="grid grid-cols-2 gap-3">
              {CURRENCIES.map(c => (
                <button key={c.code} type="button" onClick={() => setCurrency(c.code)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    currency === c.code
                      ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                      : 'bg-dark-400/50 border-white/8 text-gray-400 hover:border-white/20'
                  }`}>
                  <p className="font-bold text-sm">{c.code}</p>
                  <p className="text-xs opacity-70 mt-0.5">{c.code === 'USD' ? 'Dólar' : 'Peso colombiano'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="glass-card p-5 border border-white/8">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2 text-sm uppercase tracking-wider">
              <CreditCard size={15} className="text-gold-400" /> Información de pago
            </h3>
            <div className="flex items-center gap-1.5 mb-4">
              <Lock size={11} className="text-green-400" />
              <p className="text-xs text-green-400">Transacción segura · Datos encriptados</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={lbl}>Nombre en la tarjeta *</label>
                <input type="text" value={form.cardName} onChange={e => setField('cardName', e.target.value)}
                  placeholder="Como aparece en la tarjeta" className={inp} required />
              </div>
              <div className="sm:col-span-2">
                <label className={lbl}>Número de tarjeta *</label>
                <input type="text" inputMode="numeric" value={form.cardNumber}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,'').slice(0,16)
                    const fmt = v.replace(/(.{4})/g,'$1 ').trim()
                    setField('cardNumber', fmt)
                  }}
                  placeholder="0000 0000 0000 0000" maxLength={19} className={`${inp} font-mono tracking-wider`} required />
              </div>
              <div>
                <label className={lbl}>Vencimiento *</label>
                <input type="text" inputMode="numeric" value={form.cardExpiry}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g,'').slice(0,4)
                    setField('cardExpiry', v.length > 2 ? `${v.slice(0,2)}/${v.slice(2)}` : v)
                  }}
                  placeholder="MM/AA" maxLength={5} className={`${inp} font-mono`} required />
              </div>
              <div>
                <label className={lbl}>CVV *</label>
                <input type="password" inputMode="numeric" value={form.cardCvv}
                  onChange={e => setField('cardCvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                  placeholder="•••" maxLength={4} className={`${inp} font-mono`} required />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: summary ── */}
        <div className="lg:col-span-2">
          <div className="gold-card p-5 sticky top-24">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resumen del pedido</h3>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover bg-dark-400 flex-shrink-0"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&q=80' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-mono text-sm text-gold-400 flex-shrink-0 font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="divider-gold mb-3" />

            {/* Cupón */}
            <div className="mb-3">
              {applied ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-500/8 border border-green-500/25">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag size={13} className="text-green-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-green-400 truncate">{applied.code}</p>
                      {applied.description && <p className="text-xs text-gray-500 truncate">{applied.description}</p>}
                    </div>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponMsg('') }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon() } }}
                      placeholder="Código de descuento"
                      className="input-gold px-3 py-2.5 text-sm flex-1 uppercase" />
                    <button type="button" onClick={applyCoupon} disabled={applying || !coupon.trim()}
                      className="btn-outline px-4 py-2.5 text-sm rounded-xl disabled:opacity-40 flex items-center gap-1.5">
                      {applying ? <Loader2 size={13} className="animate-spin" /> : <Tag size={13} />} Aplicar
                    </button>
                  </div>
                  {couponMsg && <p className="text-xs text-red-400 mt-1.5">{couponMsg}</p>}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-mono text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Envío</span>
                <span className={`font-mono font-semibold ${shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                  {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-400 flex items-center gap-1"><Tag size={11} /> Descuento</span>
                  <span className="font-mono font-semibold text-green-400">−${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="divider-gold mb-3" />

            <div className="flex justify-between mb-1">
              <span className="font-bold text-white">Total USD</span>
              <span className="font-mono font-bold text-gold-400 text-lg">${totalUSD.toFixed(2)}</span>
            </div>
            {currency === 'COP' && (
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">≈ en COP</span>
                <span className="font-mono text-sm text-gray-300">
                  {totalConverted.toLocaleString('es-CO', { minimumFractionDigits: 0 })} COP
                </span>
              </div>
            )}

            {shipping > 0 && (
              <p className="text-xs text-gray-600 text-center mt-2">
                Agrega ${(300 - total).toFixed(0)} más para envío gratis
              </p>
            )}

            <button type="submit" disabled={loading || items.length === 0}
              className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Procesando...</>
                : <><CheckCircle size={16} /> Confirmar pedido</>}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Lock size={11} className="text-gray-600" />
              <p className="text-xs text-gray-600">Compra protegida y segura</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
