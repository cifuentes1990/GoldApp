import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, toggle, clear } = useWishlist()
  const { addItem } = useCart()

  const handleMoveToCart = (product) => {
    addItem(product)
    toggle(product)
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Lista guardada</p>
          <h1 className="text-4xl font-display tracking-wider text-white">MIS <span className="gold-text">FAVORITOS</span></h1>
          <p className="text-gray-500 mt-1">{items.length} producto{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={clear} className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
          <Trash2 size={14} /> Limpiar lista
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map(product => (
          <div key={product._id} className="glass-card border border-white/5 p-4 flex items-center gap-4 group">
            {/* Image */}
            <Link to={`/producto/${product._id}`} className="flex-shrink-0">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=70'}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover bg-dark-400"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=70' }}
              />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link to={`/producto/${product._id}`} className="hover:text-gold-400 transition-colors">
                <h3 className="font-semibold text-white truncate">{product.name}</h3>
              </Link>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {product.weight}g · {product.purity}K · {product.category}
              </p>
              {product.stock === 0 && (
                <span className="text-xs text-red-400 font-medium">Sin stock</span>
              )}
            </div>

            {/* Price */}
            <span className="font-mono font-bold text-gold-400 text-lg flex-shrink-0">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleMoveToCart(product)}
                disabled={product.stock === 0}
                title="Agregar al carrito y quitar de favoritos"
                className="btn-gold px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={13} /> Agregar
              </button>
              <button
                onClick={() => toggle(product)}
                title="Quitar de favoritos"
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Heart size={15} fill="currentColor" className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
