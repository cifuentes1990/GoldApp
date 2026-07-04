import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart, ArrowRight, Share2, TrendingDown, PackageCheck, Bell, Check } from 'lucide-react'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, toggle, removeItem, clear } = useWishlist()
  const { addItem } = useCart()
  const [params] = useSearchParams()
  const sharedIds = params.get('ids')

  const [live, setLive] = useState({})       // { productId: { price, stock } } datos actuales
  const [shared, setShared] = useState(null) // productos de una lista compartida

  // Carga datos en vivo de los favoritos para detectar cambios de precio/stock
  useEffect(() => {
    if (!items.length) return
    Promise.all(items.map(it =>
      api.get(`/products/${it._id}`).then(r => r.data.product).catch(() => null)
    )).then(results => {
      const map = {}
      results.forEach(p => { if (p) map[p._id] = { price: p.price, stock: p.stock } })
      setLive(map)
    })
  }, [items])

  // Si la URL trae ?ids=, carga esa lista compartida
  useEffect(() => {
    if (!sharedIds) { setShared(null); return }
    const ids = sharedIds.split(',').filter(Boolean).slice(0, 30)
    Promise.all(ids.map(id => api.get(`/products/${id}`).then(r => r.data.product).catch(() => null)))
      .then(res => setShared(res.filter(Boolean)))
  }, [sharedIds])

  const handleMoveToCart = (product) => {
    addItem(product)
    removeItem(product._id)
  }

  const shareList = () => {
    const ids = items.map(i => i._id).join(',')
    const url = `${window.location.origin}/favoritos?ids=${ids}`
    if (navigator.share) {
      navigator.share({ title: 'Mis favoritos en GIORGIO', url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Enlace de tu lista copiado 📋')
    }
  }

  // ── Vista de lista compartida ──
  if (sharedIds && shared) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Lista compartida</p>
          <h1 className="text-4xl font-display tracking-wider text-white">FAVORITOS <span className="gold-text">COMPARTIDOS</span></h1>
          <p className="text-gray-500 mt-1">{shared.length} pieza{shared.length !== 1 ? 's' : ''} seleccionada{shared.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="space-y-3">
          {shared.map(product => (
            <div key={product._id} className="glass-card border border-white/5 p-4 flex items-center gap-4">
              <Link to={`/producto/${product._id}`} className="flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-dark-400"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=70' }} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/producto/${product._id}`} className="hover:text-gold-400 transition-colors">
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{product.weight}g · {product.purity}K · {product.category}</p>
              </div>
              <span className="font-mono font-bold text-gold-400 text-lg flex-shrink-0">${product.price.toFixed(2)}</span>
              <button onClick={() => { toggle(product); toast.success('Guardado en tus favoritos') }}
                className="btn-outline px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 flex-shrink-0">
                <Heart size={13} /> Guardar
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/favoritos" className="text-sm text-gray-500 hover:text-gold-400 transition-colors">Ver mi propia lista →</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Heart size={56} className="text-gray-700 mx-auto mb-6" />
        <h1 className="text-3xl font-display tracking-wider text-white mb-3">SIN <span className="gold-text">FAVORITOS</span></h1>
        <p className="text-gray-500 mb-8">Guarda los productos que te interesan para encontrarlos rápido.</p>
        <Link to="/catalogo" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold">
          Explorar catálogo <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  // Alertas: bajadas de precio y regresos a stock
  const alerts = items.reduce((acc, it) => {
    const cur = live[it._id]
    if (!cur) return acc
    if (cur.price < (it.savedPrice ?? it.price)) acc.priceDrops++
    if ((it.savedStock === 0 || it.stock === 0) && cur.stock > 0) acc.restocks++
    return acc
  }, { priceDrops: 0, restocks: 0 })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Lista guardada</p>
          <h1 className="text-4xl font-display tracking-wider text-white">MIS <span className="gold-text">FAVORITOS</span></h1>
          <p className="text-gray-500 mt-1">{items.length} producto{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={shareList} className="btn-outline px-4 py-2.5 text-sm rounded-xl flex items-center gap-2">
            <Share2 size={14} /> Compartir
          </button>
          <button onClick={clear} className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
            <Trash2 size={14} /> Limpiar
          </button>
        </div>
      </div>

      {/* Banner de alertas */}
      {(alerts.priceDrops > 0 || alerts.restocks > 0) && (
        <div className="glass-card border border-gold-500/25 bg-gold-500/5 p-4 mb-6 flex items-center gap-3">
          <Bell size={18} className="text-gold-400 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            {alerts.priceDrops > 0 && <span className="text-green-400 font-semibold">{alerts.priceDrops} bajó{alerts.priceDrops > 1 ? 'aron' : ''} de precio</span>}
            {alerts.priceDrops > 0 && alerts.restocks > 0 && <span className="text-gray-600"> · </span>}
            {alerts.restocks > 0 && <span className="text-blue-400 font-semibold">{alerts.restocks} de nuevo disponible{alerts.restocks > 1 ? 's' : ''}</span>}
          </p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3">
        {items.map(product => {
          const cur = live[product._id]
          const savedPrice = product.savedPrice ?? product.price
          const priceDropped = cur && cur.price < savedPrice
          const backInStock = cur && (product.savedStock === 0 || product.stock === 0) && cur.stock > 0
          const outOfStock = cur ? cur.stock === 0 : product.stock === 0
          const displayPrice = cur ? cur.price : product.price

          return (
            <div key={product._id} className="glass-card border border-white/5 p-4 flex items-center gap-4 group">
              <Link to={`/producto/${product._id}`} className="flex-shrink-0 relative">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=70'}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-dark-400"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=70' }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/producto/${product._id}`} className="hover:text-gold-400 transition-colors">
                  <h3 className="font-semibold text-white truncate">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  {product.weight}g · {product.purity}K · {product.category}
                </p>
                {/* Badges de alerta */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {priceDropped && (
                    <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                      <TrendingDown size={10} /> Bajó de precio
                    </span>
                  )}
                  {backInStock && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                      <PackageCheck size={10} /> De nuevo disponible
                    </span>
                  )}
                  {outOfStock && (
                    <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Sin stock</span>
                  )}
                </div>
              </div>

              {/* Precio */}
              <div className="text-right flex-shrink-0">
                <span className="font-mono font-bold text-gold-400 text-lg block">
                  ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {priceDropped && (
                  <span className="font-mono text-xs text-gray-600 line-through">
                    ${savedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleMoveToCart({ ...product, price: displayPrice, stock: cur?.stock ?? product.stock })}
                  disabled={outOfStock}
                  title="Agregar al carrito"
                  className="btn-gold px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={13} /> Agregar
                </button>
                <button
                  onClick={() => removeItem(product._id)}
                  title="Quitar de favoritos"
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Heart size={15} fill="currentColor" className="text-red-400" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
