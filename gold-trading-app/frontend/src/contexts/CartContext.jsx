import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        const newQty = existing.quantity + quantity
        if (newQty > product.stock) {
          toast.error('Stock insuficiente')
          return prev
        }
        toast.success('Cantidad actualizada')
        return prev.map(i => i._id === product._id ? { ...i, quantity: newQty } : i)
      }
      if (quantity > product.stock) { toast.error('Stock insuficiente'); return prev }
      toast.success('Producto agregado al carrito ⚜')
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i._id !== productId))
    toast.success('Producto removido')
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) { removeItem(productId); return }
    setItems(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i))
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('cart')
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
