import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Shield, Truck, Award, Plus, Minus, Heart } from 'lucide-react'
import api from '../utils/api'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import ProductCard from '../components/ui/ProductCard'

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    setQty(1)
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data.product
        setProduct(p)
        // Fetch related products (same category, exclude current)
        api.get(`/products?category=${p.category}&limit=4`)
          .then(r => setRelated(r.data.products.filter(rp => rp._id !== p._id).slice(0, 3)))
          .catch(() => {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="h-96 shimmer-bg rounded-2xl" />
      <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-12 shimmer-bg rounded-xl" />)}</div>
    </div>
  )

  if (!product) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <p className="text-2xl text-gray-400">Producto no encontrado</p>
      <Link to="/catalogo" className="btn-gold inline-flex mt-6 px-6 py-3 rounded-xl">Volver al catálogo</Link>
    </div>
  )

  const categoryLabel = { anillo: 'Anillo', collar: 'Collar', pulsera: 'Pulsera', aretes: 'Aretes', cadena: 'Cadena', dije: 'Dije' }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors mb-8 text-sm">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden aspect-square bg-dark-400 border border-white/5">
            <img src={product.image} alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&q=80' }} />
          </div>
          {product.featured && (
            <div className="absolute top-4 left-4"><span className="badge badge-gold">⭐ Destacado</span></div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="badge badge-gold mb-3">{categoryLabel[product.category] || product.category}</span>
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{product.name}</h1>
            <p className="text-gray-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Material', value: `Oro ${product.purity}K (${product.purityLabel})` },
              { label: 'Peso', value: `${product.weight}g` },
              { label: 'Disponibilidad', value: product.stock > 0 ? `${product.stock} en stock` : 'Agotado' },
              { label: 'Garantía', value: 'Pureza certificada' },
            ].map(s => (
              <div key={s.label} className="gold-card p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-semibold text-white text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="glass-card p-5">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-mono font-bold text-gold-400">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-gray-500 mb-1">USD</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Precio incluye empaque de regalo y certificado de autenticidad</p>
          </div>

          {/* Quantity + Add to cart + Wishlist */}
          {product.stock > 0 ? (
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-dark-400 border border-white/10 rounded-xl px-3 py-2">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-gray-400 hover:text-white transition-colors p-1">
                  <Minus size={14} />
                </button>
                <span className="font-mono text-white w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="text-gray-400 hover:text-white transition-colors p-1">
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => addItem(product, qty)} className="btn-gold flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold">
                <ShoppingCart size={16} /> Agregar al carrito · ${(product.price * qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </button>
              <button
                onClick={() => toggle(product)}
                title={isWishlisted(product._id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                className={`px-3 rounded-xl border transition-all ${isWishlisted(product._id) ? 'bg-red-500/20 border-red-400/40 text-red-400' : 'border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/30'}`}
              >
                <Heart size={18} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="text-center flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-medium">
                Producto agotado
              </div>
              <button
                onClick={() => toggle(product)}
                title={isWishlisted(product._id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                className={`px-3 rounded-xl border transition-all ${isWishlisted(product._id) ? 'bg-red-500/20 border-red-400/40 text-red-400' : 'border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/30'}`}
              >
                <Heart size={18} fill={isWishlisted(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          )}

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Shield, text: 'Oro certificado' },
              { icon: Truck, text: 'Envío con seguro' },
              { icon: Award, text: 'Empaque de regalo' },
            ].map(g => (
              <div key={g.text} className="text-center p-3 rounded-xl bg-dark-400/50 border border-white/5">
                <g.icon size={18} className="text-gold-500 mx-auto mb-1" />
                <p className="text-xs text-gray-500 leading-tight">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <div className="mb-6">
            <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase mb-1">Misma categoría</p>
            <h2 className="text-2xl font-display tracking-wider text-white">PRODUCTOS <span className="gold-text">RELACIONADOS</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
