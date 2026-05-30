import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })

  const save = (next) => {
    setItems(next)
    localStorage.setItem('wishlist', JSON.stringify(next))
  }

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.some(i => i._id === product._id)
      const next = exists ? prev.filter(i => i._id !== product._id) : [...prev, product]
      localStorage.setItem('wishlist', JSON.stringify(next))
      toast(exists ? 'Eliminado de favoritos' : '❤️ Agregado a favoritos', {
        style: { background: '#1A1A1A', color: '#fff', border: '1px solid rgba(245,176,66,0.3)' },
      })
      return next
    })
  }, [])

  const isWishlisted = useCallback((id) => items.some(i => i._id === id), [items])

  const clear = useCallback(() => save([]), [])

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
