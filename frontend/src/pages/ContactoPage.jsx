import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Instagram, Facebook, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const FAQS = [
  { q: '¿Cuánto tarda el envío?', a: 'Medellín y área metropolitana: 1 día hábil. Ciudades principales (Bogotá, Cali, Barranquilla): 1–2 días. Resto del país: 2–3 días hábiles.' },
  { q: '¿El oro es certificado?', a: 'Sí. Todas nuestras piezas vienen con certificado de autenticidad que indica la pureza (14K o 18K), el peso y el número de pieza.' },
  { q: '¿Hacen personalizaciones?', a: 'Por supuesto. Puedes solicitar grabados, ajustes de talla o diseños personalizados por WhatsApp. Los pedidos personalizados toman 5–7 días adicionales.' },
  { q: '¿Cuál es la política de devoluciones?', a: 'Tienes 30 días para devolver cualquier pieza que no te satisfaga, siempre que esté en su estado original. Hacemos cambio o devolución del dinero.' },
  { q: '¿Tienen tienda física?', a: 'Actualmente operamos 100% en línea con despacho desde Medellín. Próximamente abriremos showroom. Puedes vernos en redes o escribirnos para más info.' },
]

export default function ContactoPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Completa los campos obligatorios')
      return
    }
    // UI only — no backend for contact form
    setSent(true)
    toast.success('¡Mensaje enviado! Te respondemos pronto ⚜')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="section-tag">Estamos aquí para ti</span>
        <h1 className="text-5xl font-display tracking-widest text-white">
          CONTÁCTANOS <span className="gold-text">⚜</span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
          ¿Tienes dudas sobre un pedido, necesitas una personalización o quieres saber más sobre nuestras joyas? ¡Escríbenos!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Left: info + FAQ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contact cards */}
          <div className="space-y-3">
            <a href="https://wa.me/573001234567?text=Hola%2C%20quiero%20información%20sobre%20sus%20joyas"
              target="_blank" rel="noreferrer"
              className="trust-badge group hover:border-green-500/40">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp</p>
                <p className="text-xs text-gray-500">+57 300 123 4567 · Respuesta inmediata</p>
              </div>
            </a>

            <a href="tel:+573001234567" className="trust-badge group">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Teléfono</p>
                <p className="text-xs text-gray-500">+57 300 123 4567</p>
              </div>
            </a>

            <a href="mailto:hola@aurumjoyas.co" className="trust-badge group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Email</p>
                <p className="text-xs text-gray-500">hola@aurumjoyas.co</p>
              </div>
            </a>

            <div className="trust-badge">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ubicación</p>
                <p className="text-xs text-gray-500">Medellín, Antioquia · Colombia</p>
              </div>
            </div>

            <div className="trust-badge">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Horario de atención</p>
                <p className="text-xs text-gray-500">Lun – Sáb: 8:00am – 7:00pm</p>
                <p className="text-xs text-gray-600">Dom: WhatsApp únicamente</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="glass-card p-5 border border-white/5">
            <p className="text-sm font-semibold text-white mb-4">Síguenos en redes</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-sm text-purple-300 hover:border-purple-400/40 transition-colors">
                <Instagram size={15} /> Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 hover:border-blue-400/40 transition-colors">
                <Facebook size={15} /> Facebook
              </a>
              <a href="https://tiktok.com/@aurumjoyeria" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-sm text-pink-300 hover:border-pink-400/40 transition-colors">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Right: form + FAQ */}
        <div className="lg:col-span-3 space-y-8">

          {/* Contact form */}
          <div className="glass-card p-7 border border-white/8">
            <h2 className="font-bold text-white text-lg mb-6">Envíanos un mensaje</h2>

            {sent ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-white text-lg mb-2">¡Mensaje recibido!</h3>
                <p className="text-gray-500 text-sm">Te responderemos dentro de las próximas 2 horas en horario de atención.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="btn-outline px-6 py-2.5 rounded-xl text-sm mt-5">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Nombre *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Tu nombre completo" required className="input-gold px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                      placeholder="tu@email.com" required className="input-gold px-3 py-2.5 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Teléfono</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+57 300 000 0000" className="input-gold px-3 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Asunto</label>
                    <select value={form.subject} onChange={e => set('subject', e.target.value)}
                      className="input-gold px-3 py-2.5 text-sm cursor-pointer">
                      <option value="">Selecciona...</option>
                      <option value="pedido">Consulta sobre un pedido</option>
                      <option value="personalizar">Personalización de joya</option>
                      <option value="producto">Información de producto</option>
                      <option value="devolucion">Devolución o garantía</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Mensaje *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    rows={5} placeholder="Cuéntanos en qué podemos ayudarte..." required
                    className="input-gold px-3 py-2.5 text-sm resize-none" />
                </div>
                <button type="submit"
                  className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <Send size={15} /> Enviar mensaje
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div>
            <h2 className="font-bold text-white text-lg mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <details key={i} className="glass-card border border-white/5 group overflow-hidden">
                  <summary className="px-5 py-4 cursor-pointer flex items-center justify-between text-sm font-semibold text-white hover:text-gold-400 transition-colors list-none">
                    {f.q}
                    <span className="text-gray-500 group-open:rotate-180 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
