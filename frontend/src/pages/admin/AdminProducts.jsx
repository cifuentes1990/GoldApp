import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Pencil, Trash2, Search, X, Loader2, Package, Save,
  ChevronLeft, ChevronRight, Star, ToggleLeft, ToggleRight,
  AlertTriangle, CheckSquare, Square, Minus, Percent,
  Download, Upload, RefreshCw, Eye, EyeOff, Filter,
} from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'anillo', label: 'Anillos' },
  { value: 'collar', label: 'Collares' },
  { value: 'pulsera', label: 'Pulseras' },
  { value: 'aretes', label: 'Aretes' },
  { value: 'cadena', label: 'Cadenas' },
  { value: 'dije', label: 'Dijes' },
]
const PURITIES = [
  { value: 18, label: '18K (750)' },
  { value: 14, label: '14K (585)' },
  { value: 10, label: '10K (417)' },
]
const EMPTY_FORM = {
  name: '', description: '', category: 'anillo', weight: '',
  purity: 18, purityLabel: '750', price: '', stock: '',
  image: '', priceModifier: 1.0, featured: false, isActive: true,
}
const CAT_BADGE = { anillo:'badge-gold', collar:'badge-purple', pulsera:'badge-blue', aretes:'badge-green', cadena:'badge-gold', dije:'badge-blue' }
const CAT_LABEL = { anillo:'Anillo', collar:'Collar', pulsera:'Pulsera', aretes:'Aretes', cadena:'Cadena', dije:'Dije' }

const STOCK_FILTERS = [
  { key:'', label:'Todo' },
  { key:'ok', label:'En stock' },
  { key:'low', label:'Stock bajo' },
  { key:'out', label:'Agotados' },
]

// ─── Product modal (create / edit) ───────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? { ...product } : { ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, weight: Number(form.weight), price: Number(form.price), stock: Number(form.stock), purity: Number(form.purity), priceModifier: Number(form.priceModifier) }
      if (product) { await api.put(`/products/${product._id}`, payload); toast.success('Producto actualizado ✓') }
      else { await api.post('/products', payload); toast.success('Producto creado ✓') }
      onSaved(); onClose()
    } catch (err) { toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al guardar') }
    finally { setSaving(false) }
  }

  const lbl = 'text-xs text-gray-500 uppercase tracking-wider mb-1.5 block'
  const inp = 'input-gold px-3 py-2 text-sm'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-dark-500 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-500 px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <Package size={18} className="text-gold-400" />
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={lbl}>Nombre *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Ej: Anillo Solitario Oro 18K" className={inp} />
          </div>
          <div>
            <label className={lbl}>Descripción *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3}
              placeholder="Descripción detallada de la pieza..." className={`${inp} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Categoría *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={`${inp} cursor-pointer`}>
                {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Pureza *</label>
              <select value={form.purity} onChange={e => set('purity', Number(e.target.value))} className={`${inp} cursor-pointer`}>
                {PURITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>Peso (g) *</label>
              <input type="number" min="0" step="0.001" value={form.weight} onChange={e => set('weight', e.target.value)} required placeholder="5.2" className={inp} />
            </div>
            <div>
              <label className={lbl}>Precio USD *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required placeholder="385.00" className={inp} />
            </div>
            <div>
              <label className={lbl}>Stock *</label>
              <input type="number" min="0" step="1" value={form.stock} onChange={e => set('stock', e.target.value)} required placeholder="10" className={inp} />
            </div>
          </div>
          <div>
            <label className={lbl}>URL de imagen</label>
            <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className={inp} />
            {form.image && (
              <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display='none' }} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Margen (multiplicador)</label>
              <input type="number" min="1" step="0.01" value={form.priceModifier} onChange={e => set('priceModifier', e.target.value)} className={inp} />
            </div>
            <div>
              <label className={lbl}>Etiqueta pureza</label>
              <input value={form.purityLabel} onChange={e => set('purityLabel', e.target.value)} placeholder="750" className={inp} />
            </div>
          </div>
          <div className="flex gap-6">
            {[{key:'featured',label:'★ Producto destacado'},{key:'isActive',label:'Activo (visible en tienda)'}].map(t => (
              <label key={t.key} className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => set(t.key, !form[t.key])}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form[t.key]?'bg-gold-500':'bg-dark-100'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form[t.key]?'left-5':'left-0.5'}`} />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{t.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {product ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Bulk price adjustment modal ──────────────────────────────────────────────
function BulkPriceModal({ count, onClose, onApply }) {
  const [mode, setMode] = useState('pct') // 'pct' | 'fixed'
  const [value, setValue] = useState('')
  const [direction, setDirection] = useState('increase') // 'increase' | 'decrease'

  const handleApply = () => {
    const n = parseFloat(value)
    if (!n || n <= 0) { toast.error('Ingresa un valor válido'); return }
    onApply({ mode, value: n, direction })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-dark-500 border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-white flex items-center gap-2"><Percent size={16} className="text-gold-400" /> Ajuste masivo de precios</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
        </div>
        <p className="text-xs text-gray-500 mb-4">Aplica a <span className="text-white font-bold">{count}</span> producto(s) seleccionado(s)</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            {[{v:'pct',l:'Porcentaje (%)'},{v:'fixed',l:'Monto fijo (USD)'}].map(m => (
              <button key={m.v} onClick={() => setMode(m.v)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${mode===m.v?'bg-gold-500/15 text-gold-400 border-gold-500/30':'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15'}`}>
                {m.l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {[{v:'increase',l:'↑ Aumentar'},{v:'decrease',l:'↓ Reducir'}].map(d => (
              <button key={d.v} onClick={() => setDirection(d.v)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all ${direction===d.v?'bg-gold-500/15 text-gold-400 border-gold-500/30':'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15'}`}>
                {d.l}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              {mode==='pct' ? 'Porcentaje (ej: 10 = 10%)' : 'Monto en USD (ej: 50)'}
            </label>
            <input type="number" min="0.01" step="0.01" value={value} onChange={e => setValue(e.target.value)}
              placeholder={mode==='pct'?'10':'50'} className="input-gold px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancelar</button>
          <button onClick={handleApply} className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-bold">Aplicar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Inline stock cell ────────────────────────────────────────────────────────
function StockCell({ product, onSaved }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(String(product.stock))
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const save = async () => {
    const n = parseInt(val, 10)
    if (isNaN(n) || n < 0) { setVal(String(product.stock)); setEditing(false); return }
    if (n === product.stock) { setEditing(false); return }
    setSaving(true)
    try {
      await api.put(`/products/${product._id}`, { ...product, stock: n })
      toast.success(`Stock actualizado: ${n}`)
      onSaved()
    } catch { toast.error('Error') } finally { setSaving(false); setEditing(false) }
  }

  const adjust = async (delta) => {
    const n = Math.max(0, product.stock + delta)
    setSaving(true)
    try {
      await api.put(`/products/${product._id}`, { ...product, stock: n })
      toast.success(`Stock: ${n}`)
      onSaved()
    } catch { toast.error('Error') } finally { setSaving(false) }
  }

  if (saving) return <Loader2 size={14} className="animate-spin text-gray-500" />

  return (
    <div className="flex items-center gap-1 group">
      {editing ? (
        <input ref={inputRef} type="number" min="0" value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={e => { if (e.key==='Enter') save(); if (e.key==='Escape') { setVal(String(product.stock)); setEditing(false) } }}
          className="w-16 bg-dark-300 border border-gold-500/50 rounded-lg px-2 py-1 text-xs font-mono text-white text-center focus:outline-none" />
      ) : (
        <>
          <button onClick={() => adjust(-1)}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center bg-dark-300 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all text-xs">
            <Minus size={10} />
          </button>
          <button onClick={() => setEditing(true)}
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded transition-all hover:bg-dark-300 cursor-pointer ${
              product.stock === 0 ? 'text-red-400' : product.stock <= 3 ? 'text-amber-400' : 'text-green-400'
            }`}>
            {product.stock === 0 ? '✕ 0' : product.stock}
          </button>
          <button onClick={() => adjust(1)}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center bg-dark-300 hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-all text-xs">
            <Plus size={10} />
          </button>
        </>
      )}
    </div>
  )
}

// ─── CSV export ───────────────────────────────────────────────────────────────
function exportInventoryCSV(products) {
  const headers = ['Nombre','Categoría','Pureza','Peso(g)','Precio USD','Stock','Destacado','Activo','ID']
  const rows = products.map(p => [
    p.name, CAT_LABEL[p.category]||p.category, `${p.purity}K`,
    p.weight, p.price.toFixed(2), p.stock,
    p.featured?'Sí':'No', p.isActive?'Sí':'No', p._id,
  ])
  const csv = [headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=`inventario-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  URL.revokeObjectURL(url)
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [categoryFilter, setCatFilter]= useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [modalProduct, setModal]      = useState(undefined)   // undefined=closed null=new obj=edit
  const [showBulkPrice, setShowBulkPrice] = useState(false)
  const [selected, setSelected]       = useState(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [page, setPage]               = useState(1)
  const [total, setTotal]             = useState(0)
  const [pages, setPages]             = useState(1)
  const [catCounts, setCatCounts]     = useState({})
  const [allProducts, setAllProducts] = useState([])  // for counts and export
  const debouncedSearch = useDebounce(search, 400)

  // Load page
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 15,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(categoryFilter  ? { category: categoryFilter } : {}),
      })
      const res = await api.get(`/products?${params}`)
      let prods = res.data.products || []

      // Client-side stock filter
      if (stockFilter === 'out') prods = prods.filter(p => p.stock === 0)
      else if (stockFilter === 'low') prods = prods.filter(p => p.stock > 0 && p.stock <= 5)
      else if (stockFilter === 'ok') prods = prods.filter(p => p.stock > 5)

      setProducts(prods)
      setTotal(stockFilter ? prods.length : res.data.total)
      setPages(stockFilter ? 1 : (res.data.pages || 1))
    } catch { } finally { setLoading(false) }
  }, [page, debouncedSearch, categoryFilter, stockFilter])

  // Load all products for category counts and CSV
  const loadAll = useCallback(async () => {
    try {
      const res = await api.get('/products?limit=500')
      const prods = res.data.products || []
      setAllProducts(prods)
      const counts = {}
      prods.forEach(p => { counts[p.category] = (counts[p.category]||0)+1 })
      setCatCounts(counts)
    } catch {}
  }, [])

  useEffect(() => { load() },    [load])
  useEffect(() => { loadAll() }, [loadAll])

  const reload = () => { load(); loadAll(); setSelected(new Set()) }

  // ── Selection helpers ──────────────────────────────────────────────────────
  const allSelected = products.length > 0 && products.every(p => selected.has(p._id))
  const someSelected = selected.size > 0

  const toggleSelect = (id) => setSelected(prev => {
    const s = new Set(prev)
    s.has(id) ? s.delete(id) : s.add(id)
    return s
  })

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(products.map(p => p._id)))
  }

  // ── Single-product quick actions ───────────────────────────────────────────
  const toggleField = async (product, field) => {
    try {
      await api.put(`/products/${product._id}`, { ...product, [field]: !product[field] })
      toast.success(field==='featured'
        ? (!product.featured ? '★ Destacado' : 'Quitado de destacados')
        : (!product.isActive ? 'Activado' : 'Desactivado'))
      reload()
    } catch { toast.error('Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try { await api.delete(`/products/${id}`); toast.success('Producto eliminado'); reload() }
    catch { toast.error('Error al eliminar') }
  }

  // ── Bulk actions ───────────────────────────────────────────────────────────
  const bulkAction = async (action) => {
    if (!someSelected) return
    const ids = [...selected]
    const label = { activate:'activar', deactivate:'desactivar', delete:'eliminar', feature:'destacar', unfeature:'quitar destacado' }[action]
    if (action === 'delete' && !confirm(`¿Eliminar ${ids.length} producto(s)?`)) return
    setBulkLoading(true)
    try {
      if (action === 'delete') {
        await Promise.all(ids.map(id => api.delete(`/products/${id}`)))
        toast.success(`${ids.length} producto(s) eliminados`)
      } else {
        const updates = {
          activate:   { isActive: true  },
          deactivate: { isActive: false },
          feature:    { featured: true  },
          unfeature:  { featured: false },
        }[action]
        // Fetch each product then update
        const current = allProducts.filter(p => ids.includes(p._id))
        await Promise.all(current.map(p => api.put(`/products/${p._id}`, { ...p, ...updates })))
        toast.success(`${ids.length} producto(s): ${label}`)
      }
      reload()
    } catch { toast.error('Error en acción masiva') } finally { setBulkLoading(false) }
  }

  const bulkPriceAdjust = async ({ mode, value, direction }) => {
    const ids = [...selected]
    setBulkLoading(true)
    try {
      const current = allProducts.filter(p => ids.includes(p._id))
      await Promise.all(current.map(p => {
        let newPrice
        if (mode === 'pct') {
          const delta = p.price * (value / 100)
          newPrice = direction === 'increase' ? p.price + delta : p.price - delta
        } else {
          newPrice = direction === 'increase' ? p.price + value : p.price - value
        }
        newPrice = Math.max(0.01, Math.round(newPrice * 100) / 100)
        return api.put(`/products/${p._id}`, { ...p, price: newPrice })
      }))
      toast.success(`Precios actualizados en ${ids.length} producto(s)`)
      reload()
    } catch { toast.error('Error al ajustar precios') } finally { setBulkLoading(false) }
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalActive   = allProducts.filter(p => p.isActive).length
  const totalInactive = allProducts.filter(p => !p.isActive).length
  const totalLow      = allProducts.filter(p => p.stock > 0 && p.stock <= 5).length
  const totalOut      = allProducts.filter(p => p.stock === 0).length

  return (
    <div className="space-y-6">
      {modalProduct !== undefined && (
        <ProductModal product={modalProduct} onClose={() => setModal(undefined)} onSaved={reload} />
      )}
      {showBulkPrice && (
        <BulkPriceModal count={selected.size} onClose={() => setShowBulkPrice(false)} onApply={bulkPriceAdjust} />
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-wider text-white">GESTIÓN <span className="gold-text">INVENTARIO</span></h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
            <span>{allProducts.length} productos</span>
            <span className="text-green-400">{totalActive} activos</span>
            {totalInactive > 0 && <span className="text-red-400">{totalInactive} inactivos</span>}
            {totalLow  > 0 && <span className="text-amber-400 flex items-center gap-0.5"><AlertTriangle size={10} />{totalLow} stock bajo</span>}
            {totalOut  > 0 && <span className="text-red-400">✕ {totalOut} agotados</span>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportInventoryCSV(allProducts)} disabled={allProducts.length===0}
            className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs disabled:opacity-40">
            <Download size={13} /> Exportar CSV
          </button>
          <button onClick={reload} className="btn-outline flex items-center gap-1.5 px-3 py-2 text-xs">
            <RefreshCw size={13} /> Actualizar
          </button>
          <button onClick={() => setModal(null)} className="btn-gold px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <Plus size={15} /> Nuevo producto
          </button>
        </div>
      </div>

      {/* ── Bulk action bar (visible when items selected) ── */}
      {someSelected && (
        <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl bg-gold-500/8 border border-gold-500/25">
          <span className="text-sm font-bold text-gold-400 mr-1">{selected.size} seleccionados</span>
          <button onClick={() => bulkAction('activate')} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 transition-all disabled:opacity-40">
            <Eye size={12} /> Activar
          </button>
          <button onClick={() => bulkAction('deactivate')} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-dark-100 text-gray-400 text-xs font-medium border border-white/10 transition-all disabled:opacity-40">
            <EyeOff size={12} /> Desactivar
          </button>
          <button onClick={() => bulkAction('feature')} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs font-medium border border-gold-500/20 transition-all disabled:opacity-40">
            <Star size={12} /> Destacar
          </button>
          <button onClick={() => bulkAction('unfeature')} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-dark-100 text-gray-400 text-xs font-medium border border-white/10 transition-all disabled:opacity-40">
            <Star size={12} /> Quitar destacado
          </button>
          <button onClick={() => setShowBulkPrice(true)} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/20 transition-all disabled:opacity-40">
            <Percent size={12} /> Ajustar precios
          </button>
          <button onClick={() => bulkAction('delete')} disabled={bulkLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-all disabled:opacity-40 ml-auto">
            {bulkLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Eliminar
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Category tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => {
          const count = c.value ? (catCounts[c.value]||0) : Object.values(catCounts).reduce((a,b)=>a+b,0)
          const isActive = categoryFilter === c.value
          return (
            <button key={c.value} onClick={() => { setCatFilter(c.value); setPage(1); setSelected(new Set()) }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                isActive ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' : 'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15 hover:text-gray-200'
              }`}>
              {c.label}
              <span className={`font-mono text-xs px-1.5 py-0.5 rounded-full ${isActive?'bg-gold-500/20 text-gold-400':'bg-dark-300 text-gray-600'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Stock filter + Search row ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {STOCK_FILTERS.map(f => {
            const count = { '':allProducts.length, ok:allProducts.filter(p=>p.stock>5).length, low:totalLow, out:totalOut }[f.key]
            const isActive = stockFilter === f.key
            const color = { ok:'text-green-400', low:'text-amber-400', out:'text-red-400' }[f.key] || 'text-gray-400'
            return (
              <button key={f.key} onClick={() => { setStockFilter(f.key); setPage(1); setSelected(new Set()) }}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  isActive ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' : 'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15'
                }`}>
                <Filter size={10} />
                <span className={isActive ? '' : color}>{f.label}</span>
                {count > 0 && f.key !== '' && (
                  <span className={`font-mono px-1 rounded ${isActive ? 'text-gold-400' : color}`}>{count}</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre..." className="input-gold pl-9 pr-4 py-2.5 text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={13} /></button>}
        </div>
      </div>

      {/* ── Mobile cards ── */}
      <div className="sm:hidden space-y-3">
        {loading && Array(6).fill(0).map((_,i) => (
          <div key={i} className="h-20 shimmer-bg rounded-2xl" />
        ))}
        {!loading && products.map(p => {
          const isSelected = selected.has(p._id)
          const stockColor = p.stock === 0 ? 'text-red-400' : p.stock <= 3 ? 'text-amber-400' : 'text-green-400'
          return (
            <div key={p._id} className={`glass-card border p-4 transition-all ${isSelected ? 'border-gold-500/40 bg-gold-500/5' : !p.isActive ? 'border-white/3 opacity-60' : 'border-white/5'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleSelect(p._id)} className="flex-shrink-0 text-gray-500 hover:text-gold-400 transition-colors">
                  {isSelected ? <CheckSquare size={16} className="text-gold-400" /> : <Square size={16} />}
                </button>
                <div className="relative flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-dark-400"
                    onError={e=>{e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&q=60'}} />
                  {p.stock === 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-bold">!</span></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`badge ${CAT_BADGE[p.category]||'badge-gray'}`}>{CAT_LABEL[p.category]||p.category}</span>
                    <span className="text-xs text-gray-500">{p.weight}g · {p.purity}K</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-gold-400 font-bold text-sm">${p.price.toLocaleString('en-US',{minimumFractionDigits:2})}</p>
                  <p className={`text-xs font-mono ${stockColor}`}>{p.stock} u.</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleField(p,'featured')} title={p.featured?'Quitar destacado':'Destacar'}
                    className={`p-1.5 rounded-lg transition-colors ${p.featured ? 'text-gold-400 bg-gold-500/10' : 'text-gray-600 hover:text-gold-400'}`}>
                    <Star size={15} fill={p.featured?'currentColor':'none'} />
                  </button>
                  <button onClick={() => toggleField(p,'isActive')} title={p.isActive?'Desactivar':'Activar'}>
                    {p.isActive
                      ? <ToggleRight size={22} className="text-green-400 hover:text-red-400 transition-colors" />
                      : <ToggleLeft size={22} className="text-gray-600 hover:text-green-400 transition-colors" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setModal(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 text-xs font-medium transition-colors">
                    <Pencil size={12} /> Editar
                  </button>
                  <button onClick={() => handleDelete(p._id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-600 py-12">No se encontraron productos</p>
        )}
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden sm:block glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-dark-400/30">
                <th className="pl-4 pr-2 py-3 w-8">
                  <button onClick={toggleAll} className="text-gray-500 hover:text-gold-400 transition-colors">
                    {allSelected ? <CheckSquare size={15} className="text-gold-400" /> : <Square size={15} />}
                  </button>
                </th>
                {['Producto','Categoría','Peso','K','Precio','Stock','★','On/Off','Acciones'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && Array(8).fill(0).map((_,i) => (
                <tr key={i}><td colSpan={10} className="px-4 py-3"><div className="h-8 shimmer-bg rounded-lg" /></td></tr>
              ))}
              {!loading && products.map(p => {
                const isSelected = selected.has(p._id)
                return (
                  <tr key={p._id}
                    className={`transition-colors hover:bg-white/2 ${!p.isActive?'opacity-50':''} ${isSelected?'bg-gold-500/5':''}`}>
                    <td className="pl-4 pr-2 py-3 w-8">
                      <button onClick={() => toggleSelect(p._id)} className="text-gray-500 hover:text-gold-400 transition-colors">
                        {isSelected ? <CheckSquare size={15} className="text-gold-400" /> : <Square size={15} />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-dark-400"
                            onError={e=>{e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&q=60'}} />
                          {p.stock===0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold leading-none">!</span>
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-white truncate max-w-[150px] text-xs">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className={`badge ${CAT_BADGE[p.category]||'badge-gray'}`}>{CAT_LABEL[p.category]||p.category}</span></td>
                    <td className="px-3 py-3 font-mono text-gray-400 text-xs">{p.weight}g</td>
                    <td className="px-3 py-3 font-mono text-gray-400 text-xs">{p.purity}K</td>
                    <td className="px-3 py-3 font-mono text-gold-400 font-semibold text-xs">${p.price.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
                    {/* Inline editable stock */}
                    <td className="px-3 py-3"><StockCell product={p} onSaved={reload} /></td>
                    {/* Featured toggle */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleField(p,'featured')}
                        className={`transition-all hover:scale-110 ${p.featured?'text-gold-400':'text-gray-700 hover:text-gold-500'}`}
                        title={p.featured?'Quitar destacado':'Destacar'}>
                        <Star size={15} fill={p.featured?'currentColor':'none'} />
                      </button>
                    </td>
                    {/* Active toggle */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleField(p,'isActive')} title={p.isActive?'Desactivar':'Activar'}>
                        {p.isActive
                          ? <ToggleRight size={22} className="text-green-400 hover:text-red-400 transition-colors" />
                          : <ToggleLeft  size={22} className="text-gray-600 hover:text-green-400 transition-colors" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal(p)}
                          className="p-1.5 rounded-lg hover:bg-gold-500/10 text-gray-500 hover:text-gold-400 transition-colors" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && products.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-14 text-center text-gray-600">No se encontraron productos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* end desktop table */}

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">Página {page} de {pages} · {total} productos</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-outline p-2 disabled:opacity-30"><ChevronLeft size={15} /></button>
            {Array.from({length:Math.min(pages,7)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p===page?'bg-gold-500 text-dark-600':'btn-outline'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p=>Math.min(pages,p+1))} disabled={page===pages} className="btn-outline p-2 disabled:opacity-30"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
