import { X, BarChart2, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const ATTRS = ['Precio', 'Pureza', 'Peso', 'Categoría', 'Stock']

function getAttr(product, attr) {
  switch (attr) {
    case 'Precio':    return `$${product.price?.toFixed(2)} USD`
    case 'Pureza':    return `${product.purity}K (${product.purityLabel || '—'})`
    case 'Peso':      return `${product.weight}g`
    case 'Categoría': return product.category
    case 'Stock':     return product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'
    default:          return '—'
  }
}

export default function CompareBar({ items, onRemove, onClear }) {
  if (!items || items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold-500/20 bg-dark-500/95 backdrop-blur-xl shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 py-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart2 size={16} className="text-gold-400" />
            Comparando {items.length} {items.length === 1 ? 'producto' : 'productos'}
            {items.length < 2 && <span className="text-xs text-gray-500 font-normal">(agrega {2 - items.length} más)</span>}
          </p>
          <button onClick={onClear} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
            <X size={12} /> Limpiar
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-start">
          {items.map(p => (
            <div key={p._id} className="bg-dark-400/60 border border-white/8 rounded-xl p-3 relative">
              <button onClick={() => onRemove(p._id)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-400 transition-colors">
                <X size={10} />
              </button>
              <img src={p.image} alt={p.name} className="w-full h-16 object-cover rounded-lg mb-2 bg-dark-300"
                onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&q=60' }} />
              <p className="text-xs font-semibold text-white truncate">{p.name}</p>
              <p className="text-xs font-mono text-gold-400 font-bold mt-0.5">${p.price?.toFixed(2)}</p>
            </div>
          ))}

          {/* Empty slots */}
          {items.length < 2 && Array(2 - items.length).fill(0).map((_, i) => (
            <div key={i} className="bg-dark-400/30 border border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center h-24">
              <p className="text-xs text-gray-600 text-center">Haz click en<br/>un producto para<br/>comparar</p>
            </div>
          ))}

          {/* Compare button */}
          {items.length >= 2 && (
            <div className="flex flex-col gap-2">
              {ATTRS.map(attr => (
                <div key={attr} className="text-xs">
                  <p className="text-gray-500 mb-0.5">{attr}</p>
                  <div className="flex gap-1">
                    {items.slice(0,2).map(p => (
                      <span key={p._id} className="flex-1 text-white bg-dark-400/60 rounded px-1.5 py-0.5 truncate font-mono text-[10px]">
                        {getAttr(p, attr)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
