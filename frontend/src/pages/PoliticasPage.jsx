import { Link } from 'react-router-dom'
import { Truck, RefreshCw, Shield, Package, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="glass-card p-8 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-gold-400" />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-4 text-sm text-gray-400 leading-relaxed">{children}</div>
    </div>
  )
}

export default function PoliticasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="section-tag">Legal y operativo</span>
        <h1 className="text-5xl font-display tracking-widest text-white mb-4">
          ENVÍOS Y <span className="gold-text">GARANTÍAS</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          Todo lo que necesitas saber sobre cómo enviamos, nuestra política de devoluciones y la garantía de nuestros productos.
        </p>
      </div>

      <div className="space-y-6">

        {/* Shipping */}
        <Section icon={Truck} title="Política de envíos">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {[
              { city: 'Medellín y área metropolitana', time: '1 día hábil', price: 'Gratis +$300 / $8 USD' },
              { city: 'Bogotá, Cali, Barranquilla', time: '1–2 días hábiles', price: 'Gratis +$300 / $12 USD' },
              { city: 'Ciudades intermedias', time: '2–3 días hábiles', price: 'Gratis +$300 / $15 USD' },
              { city: 'Zonas rurales / apartadas', time: '3–5 días hábiles', price: '$15–20 USD' },
            ].map(r => (
              <div key={r.city} className="p-4 rounded-xl bg-dark-400/50 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-gold-400" />
                  <span className="font-semibold text-white text-xs">{r.city}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={11} /> {r.time}
                </div>
                <p className="text-xs text-gold-400 mt-1 font-medium">{r.price}</p>
              </div>
            ))}
          </div>
          <ul className="space-y-2">
            {[
              'Los pedidos realizados antes de las 2:00pm se despachan el mismo día hábil.',
              'Enviamos con operadores de confianza: Servientrega, Coordinadora y Deprisa.',
              'Recibirás un número de guía por email para rastrear tu pedido en tiempo real.',
              'El empaque incluye caja de regalo, papel de seda y certificado de autenticidad.',
              'El envío está asegurado contra pérdida o daño durante el transporte.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Returns */}
        <Section icon={RefreshCw} title="Devoluciones y cambios">
          <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/15 mb-4">
            <p className="text-gold-400 font-semibold text-sm mb-1">✅ 30 días de garantía de satisfacción</p>
            <p className="text-gray-500 text-xs">Si no estás satisfecho/a con tu compra, te ayudamos con un cambio o devolución del dinero.</p>
          </div>
          <ul className="space-y-2">
            {[
              'Tienes 30 días desde la fecha de recibo para solicitar una devolución o cambio.',
              'La pieza debe estar en su estado original, sin señales de uso, con su empaque completo.',
              'Para iniciar el proceso, escríbenos por WhatsApp o email con tu número de pedido.',
              'El costo del envío de devolución es cubierto por VELORA si el error es nuestro.',
              'Si es por cambio de opinión, el cliente cubre el envío de retorno ($8–15 USD).',
              'El reembolso se procesa en 3–5 días hábiles después de recibir el producto.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 mt-4">
            <p className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle size={14} /> No aplica devolución en:
            </p>
            <ul className="space-y-1">
              {[
                'Piezas personalizadas o con grabado a nombre del cliente.',
                'Joyas con señales de uso, daño por mal manejo o alteraciones.',
                'Compras realizadas con más de 30 días de anterioridad.',
              ].map(item => (
                <li key={item} className="text-xs text-gray-500 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">·</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Warranty */}
        <Section icon={Shield} title="Garantía de autenticidad">
          <p>
            Cada pieza VELORA viene acompañada de un <strong className="text-gold-400">certificado de autenticidad</strong> que garantiza la pureza del oro (14K o 18K), el peso en gramos y el número de serie de la pieza.
          </p>
          <ul className="space-y-2">
            {[
              'Oro 14K = 58.5% de oro puro (aleado con metales nobles para mayor durabilidad).',
              'Oro 18K = 75% de oro puro (mayor pureza, brillo superior y más delicado).',
              'Nuestras piezas son verificadas por laboratorio antes del despacho.',
              'Ofrecemos garantía de por vida en la pureza del metal bajo uso normal.',
              'Si la pieza pierde color en menos de 1 año, la reparamos sin costo.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Packaging */}
        <Section icon={Package} title="Empaque y presentación">
          <p>
            Sabemos que una joya es mucho más que el producto en sí: es el momento en que se entrega. Por eso, cada pedido incluye:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { icon: '🎁', label: 'Caja de regalo' },
              { icon: '🪢', label: 'Lazo decorativo' },
              { icon: '📜', label: 'Certificado' },
              { icon: '📝', label: 'Tarjeta personal' },
            ].map(i => (
              <div key={i.label} className="p-3 rounded-xl bg-dark-400/50 border border-white/5 text-center">
                <span className="text-2xl block mb-1">{i.icon}</span>
                <p className="text-xs text-gray-400">{i.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Puedes solicitar una <strong className="text-gold-400">tarjeta personalizada</strong> con mensaje escrito a mano durante el checkout. ¡Ideal para regalos!
          </p>
        </Section>

        {/* Contact CTA */}
        <div className="gold-card p-8 text-center">
          <h3 className="font-bold text-white text-lg mb-2">¿Tienes más preguntas?</h3>
          <p className="text-gray-500 text-sm mb-5">Nuestro equipo está disponible para ayudarte por WhatsApp, email o teléfono.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold">
              💬 WhatsApp
            </a>
            <Link to="/contacto" className="btn-outline inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm">
              Ver más opciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
