import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import { useDebounce } from '../../hooks/useDebounce'

const TRENDING = ['Anillo de compromiso', 'Pulsera de tenis', 'Cadena fígaro', 'Aretes argolla', 'Collar corazón']

export default function SearchBar({ size = 'normal' }) {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [open, setOpen]           = useState(false)
  const [recent, setRecent]       = useState([])
  const debounced                 = useDebounce(query, 350)
  const ref                       = useRef(null)
  const navigate                  = useNavigate()

  // Load recent from localStorage
  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem('giorgio_searches') || '[]').slice(0, 4)) } catch {}
  }, [open])

  // Search API
  useEffect(() => {
    if (!debounced.trim()) { setResults([]); return }
    setLoading(true)
    api.get(`/products?search=${encodeURIComponent(debounced)}&limit=5`)
      .then(r => setResults(r.data.products || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [debounced])

  // Click outside to close
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const saveRecent = (q) => {
    if (!q.trim()) return
    const prev = JSON.parse(localStorage.getItem('giorgio_searches') || '[]')
    const updated = [q, ...prev.filter(x => x !== q)].slice(0, 5)
    localStorage.setItem('giorgio_searches', JSON.stringify(updated))
  }

  const go = (q) => {
    saveRecent(q)
    setOpen(false)
    setQuery('')
    navigate(`/catalogo?search=${encodeURIComponent(q)}`)
  }

  const goProduct = (id) => {
    setOpen(false)
    setQuery('')
    navigate(`/producto/${id}`)
  }

  const isLarge = size === 'large'

  return (
    <div ref={ref} className="relative w-full">
      {/* Input */}
      <div className={`relative flex items-center ${isLarge ? 'bg-dark-400/80 border border-gold-500/25 rounded-2xl shadow-lg shadow-gold-500/5' : 'bg-dark-400/60 border border-white/10 rounded-xl'} transition-all duration-200 ${open ? 'border-gold-500/40' : ''}`}>
        <Search size={isLarge ? 20 : 16} className={`absolute left-4 ${open ? 'text-gold-400' : 'text-gray-500'} transition-colors`} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={isLarge ? '¿Qué joya estás buscando? Anillo, collar, pulsera...' : 'Buscar joyas...'}
          className={`w-full bg-transparent ${isLarge ? 'py-4 pl-12 pr-12 text-base' : 'py-2.5 pl-10 pr-10 text-sm'} text-white placeholder-gray-500 outline-none`}
          onKeyDown={e => { if (e.key === 'Enter' && query.trim()) go(query.trim()) }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]) }} className="absolute right-4 text-gray-500 hover:text-white">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-500 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">

          {/* Trending */}
          {!query && (
            <div className="p-3">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold px-2 mb-2 flex items-center gap-1.5">
                <TrendingUp size={11} /> Tendencias
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(t => (
                  <button key={t} onClick={() => go(t)}
                    className="text-xs px-3 py-1.5 rounded-full bg-dark-400 border border-white/8 text-gray-400 hover:border-gold-500/30 hover:text-gold-400 transition-all">
                    {t}
                  </button>
                ))}
              </div>

              {/* Recent */}
              {recent.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold px-2 mb-2 flex items-center gap-1.5">
                    <Clock size={11} /> Búsquedas recientes
                  </p>
                  {recent.map(r => (
                    <button key={r} onClick={() => go(r)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-xl flex items-center gap-2 transition-colors">
                      <Clock size={12} className="text-gray-600" /> {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="px-4 py-6 text-center">
              <div className="w-5 h-5 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="divide-y divide-white/5">
              {results.map(p => (
                <button key={p._id} onClick={() => goProduct(p._id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-colors text-left">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-dark-400 flex-shrink-0"
                    onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=80&q=60' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category} · {p.purity}K</p>
                  </div>
                  <span className="font-mono text-gold-400 text-sm font-bold flex-shrink-0">${p.price.toFixed(2)}</span>
                </button>
              ))}
              <button onClick={() => go(query)}
                className="w-full px-4 py-3 text-sm text-gold-400 hover:bg-gold-500/5 flex items-center gap-2 transition-colors font-medium">
                <Search size={13} /> Ver todos los resultados para "{query}" <ArrowRight size={13} className="ml-auto" />
              </button>
            </div>
          )}

          {/* No results */}
          {!loading && query && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">Sin resultados para "{query}"</p>
              <button onClick={() => go(query)} className="text-xs text-gold-400 mt-2 hover:underline">
                Buscar de todas formas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
