import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Camera, Upload, Sparkles, Loader2, Download, RefreshCw, X,
  ImageIcon, Wand2, ShieldCheck, AlertCircle, Check, ShoppingCart,
} from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

// Comprime y reescala una imagen en el navegador antes de enviarla
function compressImage(file, maxSize = 1280, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxSize) { height = height * maxSize / width; width = maxSize }
        else if (height > maxSize) { width = width * maxSize / height; height = maxSize }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function TryOnPage() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [params] = useSearchParams()
  const fileRef = useRef(null)

  const [userPhoto, setUserPhoto]   = useState(null)   // data URL
  const [products, setProducts]     = useState([])
  const [selected, setSelected]     = useState(null)
  const [category, setCategory]     = useState('')
  const [result, setResult]         = useState(null)   // data URL
  const [loading, setLoading]       = useState(false)
  const [loadingProducts, setLP]    = useState(true)
  const [demoNotice, setDemoNotice] = useState(false)  // probador aún sin activar

  // Carga productos "vestibles" (collar, cadena, dije, aretes)
  useEffect(() => {
    api.get('/products?limit=40')
      .then(r => {
        const wearable = (r.data.products || []).filter(p =>
          ['collar', 'cadena', 'dije', 'aretes'].includes(p.category))
        setProducts(wearable)
        // Preselección por ?product=ID
        const pid = params.get('product')
        if (pid) {
          const found = wearable.find(p => p._id === pid)
          if (found) setSelected(found)
        }
      })
      .catch(() => {})
      .finally(() => setLP(false))
  }, [params])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Sube una imagen (JPG o PNG)'); return }
    try {
      const compressed = await compressImage(file)
      setUserPhoto(compressed)
      setResult(null)
    } catch { toast.error('No se pudo procesar la foto') }
  }

  const generate = async () => {
    if (!userPhoto) { toast.error('Sube tu foto primero'); return }
    if (!selected)  { toast.error('Elige una joya para probar'); return }
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/tryon', {
        userImage: userPhoto,
        productImage: selected.image,
        productName: selected.name,
        category: selected.category,
      }, { timeout: 60000 })
      setResult(res.data.image)
      toast.success('¡Montaje listo! ✨')
    } catch (err) {
      // El backend marca demo:true cuando la IA aún no está activada (sin billing)
      if (err.response?.data?.demo) {
        setDemoNotice(true)
      } else {
        toast.error(err.response?.data?.error || 'Error al generar el montaje')
      }
    } finally { setLoading(false) }
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = `giorgio-probador-${Date.now()}.png`
    a.click()
  }

  const categories = [
    { key: '', label: 'Todas' },
    { key: 'collar', label: 'Collares' },
    { key: 'cadena', label: 'Cadenas' },
    { key: 'dije', label: 'Dijes' },
    { key: 'aretes', label: 'Aretes' },
  ]
  const shownProducts = category ? products.filter(p => p.category === category) : products

  // ── Gate de autenticación ──
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5">
          <Wand2 size={28} className="text-gold-400" />
        </div>
        <h1 className="text-2xl font-display tracking-wider text-white mb-3">PROBADOR <span className="gold-text">VIRTUAL</span></h1>
        <p className="text-gray-500 text-sm mb-6">Inicia sesión para probarte nuestras joyas con inteligencia artificial.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">Iniciar sesión</Link>
          <Link to="/registro" className="btn-outline px-6 py-3 rounded-xl text-sm">Crear cuenta</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      {/* Demo notice modal */}
      {demoNotice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setDemoNotice(false)} />
          <div className="relative w-full max-w-md bg-dark-500 border border-gold-500/20 rounded-2xl shadow-2xl p-8 text-center">
            <button onClick={() => setDemoNotice(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={28} className="text-gold-400" />
            </div>
            <h2 className="text-xl font-display tracking-wider text-white mb-2">PRÓXIMAMENTE <span className="gold-text">✨</span></h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              El probador virtual con IA estará disponible muy pronto. Estamos afinando los últimos detalles
              para que el montaje quede perfecto.
            </p>
            <p className="text-xs text-gray-600 mb-6">
              Mientras tanto, ¿quieres ver cómo combinan nuestras joyas?
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/combinar" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <ImageIcon size={14} /> Combinar joyas
              </Link>
              <button onClick={() => setDemoNotice(false)} className="btn-outline px-5 py-2.5 rounded-xl text-sm">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <span className="section-tag">Inteligencia artificial</span>
        <h1 className="text-4xl sm:text-5xl font-display tracking-widest text-white">
          PRUÉBATE <span className="gold-text">LA JOYA</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
          Sube una foto tuya y nuestra IA te mostrará cómo luce la joya puesta. Magia en segundos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: inputs ── */}
        <div className="space-y-5">
          {/* Step 1: Photo */}
          <div className="glass-card border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-dark-600 text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-white text-sm">Sube tu foto</h3>
            </div>

            {userPhoto ? (
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-dark-400">
                <img src={userPhoto} alt="Tu foto" className="w-full h-full object-contain" />
                <button onClick={() => { setUserPhoto(null); setResult(null) }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-600/80 text-gray-300 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-white/15 hover:border-gold-500/40 bg-dark-400/40 flex flex-col items-center justify-center gap-3 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                  <Upload size={24} className="text-gold-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-white font-medium">Toca para subir tu foto</p>
                  <p className="text-xs text-gray-600 mt-0.5">JPG o PNG · Mejor con buena luz y rostro visible</p>
                </div>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />

            {/* Privacy note */}
            <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-dark-400/50 border border-white/5">
              <ShieldCheck size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Tu foto se usa solo para generar el montaje y <strong className="text-gray-400">no se guarda</strong> en nuestros servidores.
              </p>
            </div>
          </div>

          {/* Step 2: Jewelry */}
          <div className="glass-card border border-white/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-dark-600 text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-white text-sm">Elige la joya</h3>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-4">
              {categories.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    category === c.key ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' : 'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/20'
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-4 gap-2">
                {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square shimmer-bg rounded-lg" />)}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                {shownProducts.map(p => (
                  <button key={p._id} onClick={() => { setSelected(p); setResult(null) }}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                      selected?._id === p._id ? 'border-gold-500 ring-2 ring-gold-500/30' : 'border-white/5 hover:border-white/20'
                    }`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                      onError={e => { e.target.src='https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&q=60' }} />
                    {selected?._id === p._id && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center">
                        <Check size={10} className="text-dark-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div className="flex items-center gap-3 mt-4 p-2.5 rounded-xl bg-gold-500/5 border border-gold-500/15">
                <img src={selected.image} alt={selected.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium truncate">{selected.name}</p>
                  <p className="text-xs text-gold-400 font-mono">${selected.price.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Generate button */}
          <button onClick={generate} disabled={loading || !userPhoto || !selected}
            className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Generando montaje... (10-20s)</>
              : <><Sparkles size={16} /> Generar montaje con IA</>}
          </button>
        </div>

        {/* ── Right: result ── */}
        <div>
          <div className="glass-card border border-white/5 p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-gold-500 text-dark-600 text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-bold text-white text-sm">Resultado</h3>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-b from-dark-400 to-dark-500 border border-white/8 flex items-center justify-center">
              {loading && (
                <div className="text-center px-6">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                    <Wand2 size={24} className="text-gold-400 absolute inset-0 m-auto" />
                  </div>
                  <p className="text-sm text-gold-400 font-medium">La IA está creando tu montaje...</p>
                  <p className="text-xs text-gray-600 mt-1">Esto toma entre 10 y 20 segundos</p>
                </div>
              )}

              {!loading && result && (
                <img src={result} alt="Montaje" className="w-full h-full object-contain" />
              )}

              {!loading && !result && (
                <div className="text-center px-6">
                  <ImageIcon size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Tu montaje aparecerá aquí</p>
                  <p className="text-xs text-gray-700 mt-1">Sube tu foto, elige una joya y genera</p>
                </div>
              )}
            </div>

            {result && (
              <div className="space-y-2 mt-4">
                <div className="flex gap-2">
                  <button onClick={download} className="btn-outline flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                    <Download size={13} /> Descargar
                  </button>
                  <button onClick={generate} className="btn-outline flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5">
                    <RefreshCw size={13} /> Reintentar
                  </button>
                </div>
                {selected && (
                  <button onClick={() => addItem(selected, 1)}
                    className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                    <ShoppingCart size={14} /> Me gusta — agregar al carrito (${selected.price.toFixed(2)})
                  </button>
                )}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-dark-400/40 border border-white/5">
              <AlertCircle size={13} className="text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                El montaje es una <strong className="text-gray-500">simulación referencial</strong> generada por IA. El producto real puede variar ligeramente en tamaño y tono.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
