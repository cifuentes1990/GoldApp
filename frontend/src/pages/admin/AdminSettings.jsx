import { useState, useEffect } from 'react'
import { Save, Loader2, Phone, MessageCircle, Globe, MapPin, Clock, Mail, RefreshCw } from 'lucide-react'
import api from '../../utils/api'
import { useSettings } from '../../contexts/SettingsContext'
import toast from 'react-hot-toast'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)

const FIELDS = [
  {
    section: 'Contacto',
    items: [
      { key: 'phone',    label: 'Teléfono visible',  icon: Phone,          placeholder: '+57 300 123 4567', hint: 'Se muestra en el footer y la página de contacto' },
      { key: 'whatsapp', label: 'WhatsApp (solo dígitos)', icon: MessageCircle, placeholder: '573001234567', hint: 'Sin + ni espacios. Ej: 573001234567 → wa.me/573001234567' },
      { key: 'email',    label: 'Email de contacto', icon: Mail,           placeholder: 'contacto@velorajoyeria.com', hint: 'Se muestra en la página de contacto' },
      { key: 'address',  label: 'Dirección / Ciudad', icon: MapPin,        placeholder: 'Medellín, Antioquia, Colombia' },
      { key: 'hours',    label: 'Horario de atención', icon: Clock,        placeholder: 'Lun – Sáb: 8:00am – 7:00pm' },
    ],
  },
  {
    section: 'Redes sociales',
    items: [
      { key: 'instagram', label: 'Instagram (URL completa)', icon: InstagramIcon, placeholder: 'https://instagram.com/velorajoyeria' },
      { key: 'facebook',  label: 'Facebook (URL completa)',  icon: FacebookIcon,  placeholder: 'https://facebook.com/velorajoyeria' },
      { key: 'tiktok',    label: 'TikTok (URL completa)',    icon: TikTokIcon,    placeholder: 'https://tiktok.com/@velorajoyeria' },
    ],
  },
]

export default function AdminSettings() {
  const { reload } = useSettings()
  const [form, setForm] = useState({
    phone: '', whatsapp: '', email: '', address: '', hours: '',
    instagram: '', facebook: '', tiktok: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        const s = res.data.settings || {}
        setForm(prev => ({ ...prev, ...s }))
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/settings', form)
      reload()           // propagate to all components using useSettings
      toast.success('Configuración guardada ✅')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const inp = 'input-gold px-3 py-3 text-sm'

  if (loading) return (
    <div className="space-y-4 max-w-2xl">
      {Array(6).fill(0).map((_,i) => <div key={i} className="h-16 shimmer-bg rounded-2xl" />)}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-display tracking-wider text-white">
          AJUSTES <span className="gold-text">DEL SITIO</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Número de contacto, redes sociales y datos que aparecen en toda la tienda
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {FIELDS.map(({ section, items }) => (
          <div key={section} className="glass-card p-5 border border-white/5">
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{section}</h3>
            <div className="space-y-4">
              {items.map(({ key, label, icon: Icon, placeholder, hint }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Icon />{label}
                  </label>
                  <input
                    type="text"
                    value={form[key] || ''}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={inp}
                  />
                  {hint && <p className="text-xs text-gray-600 mt-1">{hint}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Preview */}
        <div className="glass-card p-5 border border-gold-500/15 bg-gold-500/3">
          <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} className="text-gold-400" /> Vista previa de enlaces
          </h3>
          <div className="flex flex-wrap gap-2">
            {form.whatsapp && (
              <a href={`https://wa.me/${form.whatsapp}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 hover:border-green-400/40 transition-colors">
                <MessageCircle size={12} /> WhatsApp
              </a>
            )}
            {form.instagram && (
              <a href={form.instagram} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 hover:border-purple-400/40 transition-colors">
                <InstagramIcon /> Instagram
              </a>
            )}
            {form.facebook && (
              <a href={form.facebook} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 hover:border-blue-400/40 transition-colors">
                <FacebookIcon /> Facebook
              </a>
            )}
            {form.tiktok && (
              <a href={form.tiktok} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-xs text-pink-400 hover:border-pink-400/40 transition-colors">
                <TikTokIcon /> TikTok
              </a>
            )}
          </div>
          {form.phone && (
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
              <Phone size={12} className="text-gold-500" /> {form.phone}
            </p>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm disabled:opacity-50">
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
            : <><Save size={16} /> Guardar configuración</>}
        </button>
      </form>

      {/* Info */}
      <div className="p-4 rounded-xl bg-dark-400/50 border border-white/5 flex items-start gap-3">
        <RefreshCw size={14} className="text-gold-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Los cambios se aplican <span className="text-gray-300 font-medium">inmediatamente</span> en toda la tienda —
          footer, página de contacto y botón de WhatsApp flotante.
        </p>
      </div>
    </div>
  )
}
