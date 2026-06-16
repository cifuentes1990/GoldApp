import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, ShoppingCart, Sparkles, RefreshCw, ChevronLeft, ChevronRight,
  Layers, Plus, ArrowRight, Camera,
} from 'lucide-react'
import api from '../utils/api'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

// Un "slot" del combinador: una categoría de joya a elegir
const SLOTS = [
  { key: 'cadena', label: 'Cadena', emoji: '⛓', help: 'La base de tu combinación' },
  { key: 'dije',   label: 'Dije',   emoji: '🔮', help: 'El detalle que la hace única' },
]

function Picker({ slot, products, selected, onSelect, loading }) {
  const [page, setPage] = useState(0)
  const perPage = 3
  const pages = Math.ceil(products.length / perPage)
  const shown = products.slice(page * perPage, page * perPage + perPage)

  return (
    <div className="glass-card border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{slot.emoji}</span>
          <div>
            <h3 className="font-bold text-white text-sm">{slot.label}</h3>
            <p className="text-xs text-gray-500">{slot.help}</p>
          </div>
        </div>
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="p-1.5 rounded-lg bg-dark-400 text-gray-400 disabled:opacity-30 hover:text-white transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-600 font-mono">{page + 1}/{pages}</span>
            <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={page === pages - 1}
              className="p-1.5 rounded-lg bg-dark-400 text-gray-400 disabled:opacity-30 hover:text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-28 shimmer-bg rounded-xl" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-8">No hay {slot.label.toLowerCase()}s disponibles</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {shown.map(p => {
            const isSel = selected?._id === p._id
            return (
              <button key={p._id} onClick={() => onSelect(isSel ? null : p)}
                className={`relative rounded-xl border-2 overflow-hidden transition-all text-left group ${
                  isSel ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-white/5 hover:border-white/20'
                }`}>
                <div className="aspect-square bg-dark-400 overflow-hidden">
                  <img src={p.image} alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=60' }} />
                </div>
                {isSel && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                    <Check size={12} className="text-dark-600" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs text-white font-medium truncate">{p.name}</p>
                  <p className="text-xs font-mono text-gold-400 font-bold">${p.price.toFixed(0)}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function CombinarPage() {
  const { addItem } = useCart()
  const [data, setData] = useState({ cadena: [], dije: [] })
  const [loading, setLoading] = useState(true)
  const [pick, setPick] = useState({ cadena: null, dije: null })

  useEffect(() => {
    Promise.all([
      api.get('/products?category=cadena&limit=12'),
      api.get('/products?category=dije&limit=12'),
    ])
      .then(([c, d]) => setData({ cadena: c.data.products || [], dije: d.data.products || [] }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const selectedItems = [pick.cadena, pick.dije].filter(Boolean)
  const total = selectedItems.reduce((s, p) => s + p.price, 0)
  const complete = pick.cadena && pick.dije

  const addCombo = () => {
    if (selectedItems.length === 0) { toast.error('Elige al menos una pieza'); return }
    selectedItems.forEach(p => addItem(p, 1))
    toast.success('¡Combinación agregada al carrito! ⚜')
  }

  const reset = () => setPick({ cadena: null, dije: null })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="section-tag">Diseña tu joya</span>
        <h1 className="text-4xl sm:text-5xl font-display tracking-widest text-white">
          COMBINA <span className="gold-text">TU ESTILO</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
          Crea tu pieza única combinando una cadena con el dije perfecto. Mira cómo se ve antes de comprar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Left: pickers ── */}
        <div className="lg:col-span-3 space-y-5">
          {SLOTS.map(slot => (
            <Picker key={slot.key} slot={slot}
              products={data[slot.key]}
              selected={pick[slot.key]}
              onSelect={(p) => setPick(prev => ({ ...prev, [slot.key]: p }))}
              loading={loading} />
          ))}

          {/* Tip */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-500/5 border border-gold-500/15">
            <Sparkles size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gold-400">Tip:</strong> Para mejor armonía, combina cadenas y dijes de la misma pureza (14K con 14K, 18K con 18K). ¿Dudas? Escríbenos y te asesoramos.
            </p>
          </div>
        </div>

        {/* ── Right: live preview ── */}
        <div className="lg:col-span-2">
          <div className="gold-card p-6 sticky top-24">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers size={15} className="text-gold-400" /> Tu combinación
            </h3>

            {/* Visual stack */}
            <div className="relative rounded-2xl bg-gradient-to-b from-dark-400 to-dark-500 border border-white/8 aspect-square mb-5 overflow-hidden flex items-center justify-center">
              {!complete && selectedItems.length === 0 && (
                <div className="text-center px-6">
                  <Layers size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Selecciona una cadena y un dije para ver tu diseño</p>
                </div>
              )}

              {/* Chain layer */}
              {pick.cadena && (
                <img src={pick.cadena.image} alt="cadena"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=60' }} />
              )}

              {/* Pendant layer — centered, overlapping */}
              {pick.dije && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/5 h-2/5 rounded-full overflow-hidden border-4 border-gold-500/40 shadow-2xl"
                    style={{ boxShadow: '0 8px 32px rgba(245,176,66,0.3)' }}>
                    <img src={pick.dije.image} alt="dije"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src='https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=60' }} />
                  </div>
                </div>
              )}

              {complete && (
                <div className="absolute top-3 left-3 bg-green-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Check size={11} /> Combinación lista
                </div>
              )}
            </div>

            {/* Selected list */}
            <div className="space-y-2 mb-4">
              {SLOTS.map(slot => {
                const p = pick[slot.key]
                return (
                  <div key={slot.key} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-400/50 border border-white/5">
                    <span className="text-lg flex-shrink-0">{slot.emoji}</span>
                    {p ? (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.purity}K · {p.weight}g</p>
                        </div>
                        <span className="font-mono text-gold-400 text-sm font-bold flex-shrink-0">${p.price.toFixed(0)}</span>
                      </>
                    ) : (
                      <p className="text-xs text-gray-600 flex-1">Elige una {slot.label.toLowerCase()}...</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="divider-gold mb-3" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Total combinación</span>
              <span className="font-mono text-2xl font-bold text-gold-400">${total.toFixed(2)}</span>
            </div>

            <button onClick={addCombo} disabled={selectedItems.length === 0}
              className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed mb-2">
              <ShoppingCart size={16} /> Agregar al carrito
            </button>

            <div className="flex gap-2">
              <button onClick={reset} disabled={selectedItems.length === 0}
                className="btn-outline flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-40">
                <RefreshCw size={12} /> Reiniciar
              </button>
              <Link to="/probador" className="btn-outline flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                <Camera size={12} /> Probármela
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
