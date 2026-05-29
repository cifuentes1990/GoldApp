import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ui/ProductCard'
import { useDebounce } from '../hooks/useDebounce'

const CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'anillo', label: 'Anillos' },
  { value: 'collar', label: 'Collares' },
  { value: 'pulsera', label: 'Pulseras' },
  { value: 'aretes', label: 'Aretes' },
  { value: 'cadena', label: 'Cadenas' },
  { value: 'dije', label: 'Dijes' },
]

const PURITIES = [
  { value: '', label: 'Todas' },
  { value: '18', label: '18K (750)' },
  { value: '14', label: '14K (585)' },
  { value: '10', label: '10K (417)' },
]

const SORTS = [
  { value: '-createdAt', label: 'Más recientes' },
  { value: 'price', label: 'Menor precio' },
  { value: '-price', label: 'Mayor precio' },
  { value: '-soldCount', label: 'Más vendidos' },
]

export default function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    purity: '', minPrice: '', maxPrice: '',
    minWeight: '', maxWeight: '', search: '',
  })

  const debouncedSearch = useDebounce(filters.search, 450)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const activeFilters = { ...filters, search: debouncedSearch }
      const params = new URLSearchParams({ page, limit: 12, ...Object.fromEntries(Object.entries(activeFilters).filter(([,v]) => v)) })
      const res = await api.get(`/products?${params}`)
      setProducts(res.data.products)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch { } finally { setLoading(false) }
  }, [filters, debouncedSearch, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ category: '', purity: '', minPrice: '', maxPrice: '', minWeight: '', maxWeight: '', search: '', sort: '-createdAt' })
    setPage(1)
  }

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-2">Tienda</p>
        <h1 className="text-4xl font-display tracking-wider text-white">COLECCIÓN <span className="gold-text">DE JOYAS</span></h1>
        {total > 0 && <p className="text-gray-500 mt-2">{total} productos disponibles</p>}
      </div>

      {/* Search & controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={filters.search} onChange={e => updateFilter('search', e.target.value)}
            placeholder="Buscar productos..." className="input-gold pl-9 pr-4 py-2.5 text-sm" />
        </div>
        <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
          className="input-gold px-3 py-2.5 text-sm w-full sm:w-48 cursor-pointer">
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button onClick={() => setFiltersOpen(v => !v)}
          className={`btn-outline flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap ${filtersOpen ? 'border-gold-400 bg-gold-500/10' : ''}`}>
          <SlidersHorizontal size={14} />
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-gold-500" />}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors px-2">
            <X size={14} /> Limpiar
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="glass-card p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => updateFilter('category', c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.category === c.value ? 'bg-gold-500 text-dark-600' : 'bg-dark-300 text-gray-400 hover:bg-dark-100'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Pureza</label>
            <select value={filters.purity} onChange={e => updateFilter('purity', e.target.value)}
              className="input-gold px-3 py-2 text-xs cursor-pointer">
              {PURITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Precio mín</label>
            <input type="number" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
              placeholder="$0" className="input-gold px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Precio máx</label>
            <input type="number" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
              placeholder="$99999" className="input-gold px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Peso mín (g)</label>
            <input type="number" value={filters.minWeight} onChange={e => updateFilter('minWeight', e.target.value)}
              placeholder="0g" className="input-gold px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Peso máx (g)</label>
            <input type="number" value={filters.maxWeight} onChange={e => updateFilter('maxWeight', e.target.value)}
              placeholder="∞g" className="input-gold px-3 py-2 text-xs" />
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, i) => <div key={i} className="h-72 shimmer-bg rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-xl text-gray-400 mb-2">No se encontraron productos</p>
          <p className="text-gray-600">Intenta ajustar los filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-outline p-2 disabled:opacity-30"><ChevronLeft size={16} /></button>
          {Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2).map((p, i, arr) => (
            <span key={p}>
              {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-600 px-1">…</span>}
              <button onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-gold-500 text-dark-600' : 'btn-outline'}`}>
                {p}
              </button>
            </span>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="btn-outline p-2 disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  )
}
