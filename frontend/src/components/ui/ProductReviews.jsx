import { useState } from 'react'
import { Star, BadgeCheck, Trash2, Loader2, MessageSquare } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

// ─── Estrellas (visual o interactivas) ───────────────────────────────────────
function Stars({ value = 0, size = 14, onSet }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={onSet ? 'button' : undefined}
          disabled={!onSet}
          onClick={onSet ? () => onSet(n) : undefined}
          className={onSet ? 'cursor-pointer transition-transform hover:scale-125' : 'cursor-default'}
        >
          <Star
            size={size}
            className={n <= Math.round(value) ? 'text-gold-400 fill-gold-400' : 'text-gray-600'}
          />
        </button>
      ))}
    </div>
  )
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000
  if (diff < 3600) return 'hace un momento'
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  const days = Math.floor(diff / 86400)
  if (days < 30) return `hace ${days} día${days > 1 ? 's' : ''}`
  return new Date(date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ProductReviews({ product, onUpdated }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState(product.reviews || [])
  const [rating, setRating] = useState(product.rating || 0)
  const [numReviews, setNumReviews] = useState(product.numReviews || (product.reviews?.length ?? 0))

  const myReview = user && reviews.find(r => String(r.user) === String(user._id))
  const [form, setForm] = useState({ rating: myReview?.rating || 0, comment: myReview?.comment || '' })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.rating) { toast.error('Selecciona una calificación'); return }
    setSaving(true)
    try {
      const res = await api.post(`/products/${product._id}/reviews`, form)
      setReviews(res.data.reviews)
      setRating(res.data.rating)
      setNumReviews(res.data.numReviews)
      setShowForm(false)
      toast.success(res.data.message)
      onUpdated?.({ rating: res.data.rating, numReviews: res.data.numReviews })
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo publicar la reseña')
    } finally { setSaving(false) }
  }

  const remove = async (reviewId) => {
    try {
      const res = await api.delete(`/products/${product._id}/reviews/${reviewId}`)
      const next = reviews.filter(r => r._id !== reviewId)
      setReviews(next)
      setRating(res.data.rating)
      setNumReviews(res.data.numReviews)
      onUpdated?.({ rating: res.data.rating, numReviews: res.data.numReviews })
      toast.success('Reseña eliminada')
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo eliminar')
    }
  }

  // Distribución por estrellas
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }))

  return (
    <div className="mt-16">
      <div className="mb-6">
        <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase mb-1">Opiniones</p>
        <h2 className="text-2xl font-display tracking-wider text-white">
          RESEÑAS DE <span className="gold-text">CLIENTES</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Resumen ── */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 border border-white/5 text-center sticky top-24">
            <p className="text-5xl font-display text-gold-400">{rating.toFixed(1)}</p>
            <div className="flex justify-center my-2"><Stars value={rating} size={18} /></div>
            <p className="text-xs text-gray-500 mb-5">
              {numReviews} {numReviews === 1 ? 'reseña' : 'reseñas'}
            </p>

            {/* Barras por estrella */}
            <div className="space-y-1.5 mb-5">
              {dist.map(d => (
                <div key={d.star} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-3">{d.star}</span>
                  <Star size={10} className="text-gold-500 fill-gold-500" />
                  <div className="flex-1 h-1.5 rounded-full bg-dark-300 overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full transition-all"
                      style={{ width: numReviews ? `${(d.count / numReviews) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-gray-600 w-4 text-right">{d.count}</span>
                </div>
              ))}
            </div>

            {/* Botón para reseñar */}
            {user ? (
              <button onClick={() => { setForm({ rating: myReview?.rating || 0, comment: myReview?.comment || '' }); setShowForm(v => !v) }}
                className="btn-outline w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
                <MessageSquare size={14} /> {myReview ? 'Editar mi reseña' : 'Escribir reseña'}
              </button>
            ) : (
              <p className="text-xs text-gray-600">Inicia sesión para dejar tu reseña</p>
            )}
          </div>
        </div>

        {/* ── Lista + formulario ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Formulario */}
          {showForm && user && (
            <form onSubmit={submit} className="glass-card p-5 border border-gold-500/20 bg-gold-500/3">
              <p className="text-sm font-semibold text-white mb-3">Tu calificación</p>
              <div className="mb-4"><Stars value={form.rating} size={26} onSet={n => setForm(f => ({ ...f, rating: n }))} /></div>
              <textarea
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                rows={3} maxLength={600}
                placeholder="Cuéntanos qué te pareció la pieza (opcional)..."
                className="input-gold px-3 py-2.5 text-sm resize-none w-full mb-3"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null} Publicar reseña
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="btn-outline px-5 py-2.5 rounded-xl text-sm">Cancelar</button>
              </div>
            </form>
          )}

          {/* Reseñas */}
          {reviews.length === 0 ? (
            <div className="glass-card p-10 border border-white/5 text-center">
              <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
            </div>
          ) : (
            reviews.map(r => {
              const isMine = user && String(r.user) === String(user._id)
              const canDelete = isMine || user?.role === 'admin'
              return (
                <div key={r._id} className="glass-card p-5 border border-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-dark-600 text-sm font-bold flex-shrink-0">
                        {r.userName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{r.userName}</p>
                          {r.verified && (
                            <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                              <BadgeCheck size={10} /> Compra verificada
                            </span>
                          )}
                          {isMine && <span className="text-xs text-gold-500">(Tú)</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Stars value={r.rating} size={12} />
                          <span className="text-xs text-gray-600">{timeAgo(r.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {canDelete && (
                      <button onClick={() => remove(r._id)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                        title="Eliminar reseña">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  {r.comment && <p className="text-sm text-gray-400 leading-relaxed mt-3">{r.comment}</p>}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
