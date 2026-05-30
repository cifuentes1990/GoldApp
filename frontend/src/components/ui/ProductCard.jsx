import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Heart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

const categoryLabel = { anillo: 'Anillo', collar: 'Collar', pulsera: 'Pulsera', aretes: 'Aretes', cadena: 'Cadena', dije: 'Dije' }
const categoryColor  = { anillo: 'badge-gold', collar: 'badge-purple', pulsera: 'badge-blue', aretes: 'badge-green', cadena: 'badge-gold', dije: 'badge-blue' }

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product._id)

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-dark-400">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick view */}
        <Link to={`/producto/${product._id}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-dark-600/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-white font-medium">
            <Eye size={14} /> Ver detalle
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={e => { e.preventDefault(); toggle(product) }}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm border transition-all z-10
            ${wishlisted
              ? 'bg-red-500/80 border-red-400/50 text-white'
              : 'bg-dark-600/60 border-white/10 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400'
            }`}
          title={wishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Category / featured badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`badge ${categoryColor[product.category] || 'badge-gray'}`}>{categoryLabel[product.category]}</span>
          {product.featured && <span className="badge badge-gold">Destacado</span>}
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-red-400 font-bold text-sm border border-red-400/50 px-3 py-1.5 rounded-lg">Sin Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs text-gray-500 font-mono">{product.weight}g</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="text-xs text-gray-500 font-mono">{product.purity}K ({product.purityLabel || '—'})</span>
          {product.stock <= 5 && product.stock > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-xs text-orange-400 font-medium">Solo {product.stock}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold font-mono text-gold-400">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="btn-gold px-3 py-2 text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={13} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
