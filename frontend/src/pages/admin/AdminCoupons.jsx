import { useState, useEffect, useCallback } from 'react'
import { Plus, Tag, Trash2, Loader2, X, Percent, DollarSign, ToggleLeft, ToggleRight, Copy, Calendar } from 'lucide-react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const EMPTY = { code: '', description: '', type: 'percent', value: 10, minPurchase: 0, maxUses: 0, expiresAt: '', isActive: true }

function CouponModal({ onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    if (!form.code.trim()) { toast.error('Escribe un código'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase().trim(),
        value: Number(form.value),
        minPurchase: Number(form.minPurchase) || 0,
        maxUses: Number(form.maxUses) || 0,
        expiresAt: form.expiresAt || null,
      }
      await api.post('/coupons', payload)
      toast.success('Cupón creado ✅')
      onSaved(); onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear el cupón')
    } finally { setSaving(false) }
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const inp = 'input-gold px-3 py-2.5 text-sm'
  const lbl = 'text-xs text-gray-500 uppercase tracking-wider mb-1.5 block'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-500 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-500 px-6 py-4 border-b border-white/5 flex items-center justify-between z-10">
          <h2 className="font-bold text-white flex items-center gap-2"><Tag size={16} className="text-gold-400" /> Nuevo cupón</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1"><X size={20} /></button>
        </div>

        <form onSubmit={save} className="p-6 space-y-4">
          <div>
            <label className={lbl}>Código *</label>
            <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
              placeholder="BIENVENIDO10" className={`${inp} uppercase font-mono font-bold tracking-wider`} required />
          </div>
          <div>
            <label className={lbl}>Descripción</label>
            <input value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="10% de descuento de bienvenida" className={inp} />
          </div>

          {/* Tipo de descuento */}
          <div>
            <label className={lbl}>Tipo de descuento</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => set('type', 'percent')}
                className={`p-3 rounded-xl border text-left transition-all ${form.type === 'percent' ? 'bg-gold-500/15 border-gold-500/40 text-gold-400' : 'bg-dark-400/50 border-white/8 text-gray-400'}`}>
                <Percent size={16} className="mb-1" />
                <p className="text-sm font-semibold">Porcentaje</p>
              </button>
              <button type="button" onClick={() => set('type', 'fixed')}
                className={`p-3 rounded-xl border text-left transition-all ${form.type === 'fixed' ? 'bg-gold-500/15 border-gold-500/40 text-gold-400' : 'bg-dark-400/50 border-white/8 text-gray-400'}`}>
                <DollarSign size={16} className="mb-1" />
                <p className="text-sm font-semibold">Monto fijo</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>{form.type === 'percent' ? 'Porcentaje (%)' : 'Monto (USD)'}</label>
              <input type="number" min="0" step="0.01" value={form.value} onChange={e => set('value', e.target.value)}
                className={`${inp} font-mono`} required />
            </div>
            <div>
              <label className={lbl}>Compra mínima (USD)</label>
              <input type="number" min="0" value={form.minPurchase} onChange={e => set('minPurchase', e.target.value)}
                placeholder="0 = sin mínimo" className={`${inp} font-mono`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Usos máximos</label>
              <input type="number" min="0" value={form.maxUses} onChange={e => set('maxUses', e.target.value)}
                placeholder="0 = ilimitado" className={`${inp} font-mono`} />
            </div>
            <div>
              <label className={lbl}>Vence el (opcional)</label>
              <input type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)}
                className={`${inp} font-mono cursor-pointer`} />
            </div>
          </div>

          <button type="submit" disabled={saving}
            className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Crear cupón
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/coupons')
      setCoupons(res.data.coupons)
    } catch { } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleActive = async (c) => {
    try {
      await api.put(`/coupons/${c._id}`, { isActive: !c.isActive })
      setCoupons(prev => prev.map(x => x._id === c._id ? { ...x, isActive: !x.isActive } : x))
    } catch { toast.error('No se pudo actualizar') }
  }

  const remove = async (c) => {
    try {
      await api.delete(`/coupons/${c._id}`)
      setCoupons(prev => prev.filter(x => x._id !== c._id))
      toast.success('Cupón eliminado')
    } catch { toast.error('No se pudo eliminar') }
  }

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success(`"${code}" copiado`) }

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date()

  return (
    <div className="space-y-6">
      {modal && <CouponModal onClose={() => setModal(false)} onSaved={load} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-wider text-white">CUPONES <span className="gold-text">Y DESCUENTOS</span></h1>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} cupones · {coupons.filter(c => c.isActive && !isExpired(c)).length} activos</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-gold flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl">
          <Plus size={15} /> Nuevo cupón
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-40 shimmer-bg rounded-2xl" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="glass-card p-12 border border-white/5 text-center">
          <Tag size={36} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">Aún no hay cupones creados.</p>
          <button onClick={() => setModal(true)} className="btn-outline px-5 py-2.5 text-sm inline-flex items-center gap-2">
            <Plus size={14} /> Crear el primero
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(c => {
            const expired = isExpired(c)
            const maxedOut = c.maxUses > 0 && c.usedCount >= c.maxUses
            const dead = expired || maxedOut || !c.isActive
            return (
              <div key={c._id} className={`glass-card border p-5 relative overflow-hidden ${dead ? 'border-white/5 opacity-70' : 'border-gold-500/20'}`}>
                {/* Ribbon lateral */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${dead ? 'bg-gray-700' : 'bg-gold-gradient'}`} />

                <div className="flex items-start justify-between mb-3">
                  <button onClick={() => copyCode(c.code)} className="flex items-center gap-2 group">
                    <span className="font-mono font-bold text-white text-lg tracking-wider group-hover:text-gold-400 transition-colors">{c.code}</span>
                    <Copy size={12} className="text-gray-600 group-hover:text-gold-400" />
                  </button>
                  <button onClick={() => toggleActive(c)} title={c.isActive ? 'Desactivar' : 'Activar'}>
                    {c.isActive
                      ? <ToggleRight size={22} className="text-green-400" />
                      : <ToggleLeft size={22} className="text-gray-600" />}
                  </button>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-display text-gold-400">
                    {c.type === 'percent' ? `${c.value}%` : `$${c.value}`}
                  </span>
                  <span className="text-xs text-gray-500">de descuento</span>
                </div>
                {c.description && <p className="text-xs text-gray-500 mb-3">{c.description}</p>}

                <div className="space-y-1 text-xs text-gray-500 border-t border-white/5 pt-3 mt-3">
                  {c.minPurchase > 0 && <p>Compra mínima: <span className="text-gray-400 font-mono">${c.minPurchase}</span></p>}
                  <p>Usos: <span className="text-gray-400 font-mono">{c.usedCount}{c.maxUses > 0 ? ` / ${c.maxUses}` : ' (ilimitado)'}</span></p>
                  {c.expiresAt && (
                    <p className="flex items-center gap-1">
                      <Calendar size={10} /> Vence: <span className={expired ? 'text-red-400' : 'text-gray-400'}>{new Date(c.expiresAt).toLocaleDateString('es-CO')}</span>
                    </p>
                  )}
                </div>

                {/* Estado + eliminar */}
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    expired ? 'bg-red-500/10 text-red-400' :
                    maxedOut ? 'bg-orange-500/10 text-orange-400' :
                    c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {expired ? 'Expirado' : maxedOut ? 'Agotado' : c.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <button onClick={() => remove(c)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
