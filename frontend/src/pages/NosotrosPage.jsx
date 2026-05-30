import { Link } from 'react-router-dom'
import { ArrowRight, Award, Users, MapPin, Heart, Star, CheckCircle } from 'lucide-react'

const VALUES = [
  { icon: '💎', title: 'Calidad sin compromiso', desc: 'Usamos exclusivamente oro 14K y 18K con certificado de autenticidad. Cada pieza pasa un control de calidad riguroso antes de salir.' },
  { icon: '🎨', title: 'Diseño artesanal', desc: 'Nuestros artesanos medellonenses combinan técnicas tradicionales con diseños contemporáneos para crear piezas únicas.' },
  { icon: '🤝', title: 'Confianza y transparencia', desc: 'Precios claros, sin letra pequeña. Te decimos exactamente qué recibirás: pureza, peso y certificado incluido.' },
  { icon: '🌎', title: 'Hecho en Colombia', desc: 'Orgullosamente fabricado en Medellín, la capital mundial de la moda y una de las ciudades líderes en joyería artesanal.' },
]

const STATS = [
  { value: '8+', label: 'Años de experiencia' },
  { value: '2.400+', label: 'Clientes satisfechos' },
  { value: '150+', label: 'Diseños únicos' },
  { value: '99.8%', label: 'Satisfacción del cliente' },
]

const TEAM = [
  { name: 'Andrés Molina', role: 'Fundador & Diseñador jefe', initial: 'A', desc: 'Orfebre con 15 años de experiencia. Egresado de la Escuela de Diseño de Medellín.' },
  { name: 'Sofía Cardona', role: 'Directora comercial', initial: 'S', desc: 'Especialista en joyería de lujo y gestión de marca con experiencia internacional.' },
  { name: 'Diego Restrepo', role: 'Artesano principal', initial: 'D', desc: 'Maestro joyero con más de 12 años creando piezas únicas en el Taller VELORA.' },
]

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gold-500/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-700/5 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-tag">Nuestra historia</span>
          <h1 className="text-5xl sm:text-6xl font-display tracking-widest text-white mb-6">
            SOMOS <span className="gold-text">VELORA</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Nacimos en Medellín con un propósito claro: llevar la belleza del oro colombiano a cada rincón del país, en forma de joyas que cuentan historias y acompañan momentos únicos.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-dark-500/20 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-display text-gold-400 tracking-wider">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="section-tag">Nuestros inicios</span>
            <h2 className="text-4xl font-display tracking-wider text-white mb-6">
              DE UN TALLER EN <span className="gold-text">MEDELLÍN</span>
            </h2>
            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
              <p>
                VELORA nació en 2016 en un pequeño taller del barrio Laureles, en el corazón de Medellín. Andrés Molina, con apenas 25 años y una pasión desbordante por la orfebrería, comenzó creando piezas personalizadas para amigos y familiares.
              </p>
              <p>
                La calidad del trabajo habló por sí sola. En pocos meses, los pedidos crecieron y el taller se expandió. Hoy, VELORA es una joyería virtual que llega a más de <strong className="text-gold-400">25 departamentos de Colombia</strong>, manteniendo siempre ese espíritu artesanal que nos dio vida.
              </p>
              <p>
                Cada pieza que fabricamos lleva el sello del oro colombiano: puro, brillante y con historia. Trabajamos con orfebres locales para garantizar que cada compra también apoye la economía de nuestra ciudad.
              </p>
            </div>
            <Link to="/catalogo" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold mt-8">
              Ver nuestra colección <ArrowRight size={16} />
            </Link>
          </div>

          {/* Visual card */}
          <div className="space-y-4">
            <div className="glass-card p-6 border border-gold-500/15">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={18} className="text-gold-400" />
                <span className="font-semibold text-white">Medellín, Antioquia</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ubicados en la capital de la moda y la innovación de Colombia. Desde aquí despachamos a todo el territorio nacional.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10">
                <p className="text-xs text-gold-400 font-semibold">🕐 Atención</p>
                <p className="text-xs text-gray-500 mt-1">Lunes a Sábado · 8:00am – 7:00pm</p>
                <p className="text-xs text-gray-500">WhatsApp disponible los 7 días</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🏅', title: 'Certificación', desc: 'Oro verificado por laboratorio' },
                { icon: '🌿', title: 'Responsabilidad', desc: 'Oro de fuentes sostenibles' },
                { icon: '📦', title: 'Empaque', desc: 'Caja de regalo incluida' },
                { icon: '🛡️', title: 'Garantía', desc: '30 días sin preguntas' },
              ].map(c => (
                <div key={c.title} className="gold-card p-4">
                  <span className="text-2xl mb-2 block">{c.icon}</span>
                  <p className="font-semibold text-white text-sm">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-dark-500/20 border-y border-white/4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-tag">Nuestros valores</span>
            <h2 className="text-4xl font-display tracking-wider text-white">
              LO QUE NOS <span className="gold-text">MUEVE</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="gold-card p-6 text-center group">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h3 className="font-bold text-white text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="section-tag">Las personas detrás de VELORA</span>
          <h2 className="text-4xl font-display tracking-wider text-white">
            NUESTRO <span className="gold-text">EQUIPO</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map(m => (
            <div key={m.name} className="glass-card p-6 border border-white/5 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-gradient mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-dark-600">
                {m.initial}
              </div>
              <h3 className="font-bold text-white mb-0.5">{m.name}</h3>
              <p className="text-xs text-gold-400 mb-3 uppercase tracking-wider">{m.role}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 max-w-3xl mx-auto px-4 text-center mb-8">
        <div className="gold-card p-10">
          <Heart size={32} className="text-gold-400 mx-auto mb-4" />
          <h3 className="text-3xl font-display tracking-wider text-white mb-3">
            ÚNETE A LA <span className="gold-text">FAMILIA VELORA</span>
          </h3>
          <p className="text-gray-500 text-sm mb-6">Descubre por qué más de 2.400 colombianos confían en nosotros para sus momentos más especiales.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalogo" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold">
              Ver colección <ArrowRight size={15} />
            </Link>
            <Link to="/contacto" className="btn-outline inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm">
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
