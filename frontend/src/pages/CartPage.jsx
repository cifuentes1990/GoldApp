import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-dark-400 border border-white/5 flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={36} className="text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Tu carrito está vacío</h2>
      <p className="text-gray-500 mb-8">Explora nuestro catálogo y agrega productos</p>
      <Link to="/catalogo" className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold">
        Ir al catálogo <ArrowRight size={16} />
      </Link>
    </div>
  )

  const shipping = total > 300 ? 0 : 15

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-1">Compra</p>
          <h1 className="text-3xl font-display tracking-wider text-white">CARRITO <span className="gold-text">DE COMPRA</span></h1>
        </div>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5">
          <Trash2 size={14} /> Limpiar todo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item._id} className="glass-card p-4 flex gap-4 items-center border border-white/5">
              <img src={item.image} alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-dark-400 flex-shrink-0"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&q=80' }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{item.weight}g · {item.purity}K</p>
                <p className="text-gold-400 font-mono font-bold mt-1">${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex items-center gap-2 bg-dark-400 border border-white/10 rounded-xl px-2 py-1.5 flex-shrink-0">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-gray-400 hover:text-white transition-colors p-0.5">
                  <Minus size={13} />
                </button>
                <span className="font-mono text-white w-6 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock}
                  className="text-gray-400 hover:text-white transition-colors p-0.5 disabled:opacity-30">
                  <Plus size={13} />
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono font-bold text-white">${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <button onClick={() => removeItem(item._id)} className="text-red-400/60 hover:text-red-400 transition-colors mt-1">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="gold-card p-6 sticky top-24">
            <h3 className="font-bold text-white mb-5 text-lg">Resumen del pedido</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono text-white">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Envío</span>
                <span className={`font-mono ${shipping === 0 ? 'text-green-400' : 'text-white'}`}>
                  {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-600">Envío gratis en pedidos +$300</p>
              )}
            </div>
            <div className="divider-gold mb-5" />
            <div className="flex justify-between mb-6">
              <span className="font-bold text-white">Total</span>
              <span className="font-mono font-bold text-gold-400 text-xl">${(total + shipping).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <Link to="/checkout" className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              Proceder al pago <ArrowRight size={16} />
            </Link>
            <Link to="/catalogo" className="btn-outline w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mt-3">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
