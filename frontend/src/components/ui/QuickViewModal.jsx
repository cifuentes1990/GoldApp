import { useState, useEffect } from 'react'
import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, ZoomIn, Share2, Check } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function QuickViewModal({ productId, onClose }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  useEffect(() => {
    api.get(`/products/${productId}`)
      .then(r => setProduct(r.data.product))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const handleAdd = () => {
    if (!product) return
    addItem({ ...product, quantity: qty })
    setAdded(true)
    toast.success(`${product.name} agregado al carrito`)
    setTimeout(() => setAdded(false), 2000)
  }

  const images = product ? [product.image, ...(product.images || [])].filter(Boolean) : []

  const share = () => {
    navigator.share?.({ title: product?.name, url: `${window.location.origin}/producto/${product?._id}` })
      .catch(() => { navigator.clipboard.writeText(`${window.location.origin}/producto/${product?._id}`); toast.success('Enlace copiado') })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-dark-500 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-dark-400 hover:bg-dark-300 text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="relative bg-dark-400 rounded-tl-2xl rounded-bl-2xl overflow-hidden" style={{ minHeight:'320px' }}>
              <img src={images[imgIdx] || product.image}
                className="w-full h-full object-cover"
                alt={product.name}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80' }} />

              {/* Image nav */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-600/70 text-white">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-600/70 text-white">
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-gold-400 w-4' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}

              {/* Stock badge */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-red-400 font-bold border border-red-400/50 px-4 py-2 rounded-xl">Sin Stock</span>
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-3 left-3 bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  ¡Solo {product.stock} quedan!
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs text-gold-500 uppercase tracking-wider font-semibold">{product.category}</span>
                  <h2 className="font-bold text-white text-lg leading-tight mt-0.5">{product.name}</h2>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toggle(product)} className={`p-2 rounded-xl border transition-all ${isWishlisted(product._id) ? 'bg-red-500/20 border-red-400/40 text-red-400' : 'border-white/10 text-gray-500 hover:text-red-400'}`}>
                    <Heart size={15} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={share} className="p-2 rounded-xl border border-white/10 text-gray-500 hover:text-gold-400 transition-colors">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_,i) => <Star key={i} size={12} className="text-gold-400 fill-gold-400" />)}
                </div>
                <span className="text-xs text-gray-500">4.9 (verificado)</span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label:'Pureza', value:`${product.purity}K` },
                  { label:'Peso', value:`${product.weight}g` },
                  { label:'Ley', value:product.purityLabel || '—' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2.5 rounded-xl bg-dark-400/60 border border-white/5">
                    <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                    <p className="font-mono text-gold-400 font-bold text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">{product.description}</p>
              )}

              {/* Price */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold font-mono text-gold-400">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-gray-600">USD</span>
                </div>

                {/* Qty */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-gray-500">Cantidad:</span>
                  <div className="flex items-center gap-2 bg-dark-400 rounded-xl p-1">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 rounded-lg bg-dark-300 text-white flex items-center justify-center hover:bg-dark-200 transition-colors text-sm font-bold">−</button>
                    <span className="w-8 text-center text-white font-mono font-bold text-sm">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={product.stock === 0} className="w-7 h-7 rounded-lg bg-dark-300 text-white flex items-center justify-center hover:bg-dark-200 transition-colors text-sm font-bold disabled:opacity-30">+</button>
                  </div>
                  <span className="text-xs text-gray-600">{product.stock} disponibles</span>
                </div>

                <button onClick={handleAdd} disabled={product.stock === 0}
                  className={`btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${added ? 'bg-green-500 border-green-500' : ''} disabled:opacity-40`}>
                  {added ? <><Check size={16} /> Agregado</> : <><ShoppingCart size={16} /> Agregar al carrito</>}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">Producto no encontrado</div>
        )}
      </div>
    </div>
  )
}
