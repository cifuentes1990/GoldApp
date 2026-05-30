import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

function AuthLayout({ children, title, subtitle, link }) {
  return (
    <div className="min-h-screen bg-dark-600 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gold-500/6 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gold-700/5 rounded-full blur-2xl" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">⚜</span>
            <span className="font-display text-4xl tracking-widest gold-text">VELORA</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>
        </div>
        <div className="glass-card p-8 border border-white/8">{children}</div>
        <p className="text-center mt-6 text-sm text-gray-500">{link}</p>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Bienvenido, ${user.name}! ⚜`)
      navigate(user.role === 'admin' ? '/admin' : '/mi-cuenta')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciales incorrectas')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Accede a tu cuenta VELORA"
      link={<>¿No tienes cuenta? <Link to="/registro" className="text-gold-400 hover:text-gold-300 font-semibold">Regístrate gratis</Link></>}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="tu@email.com" required className="input-gold pl-9 pr-4 py-3 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Contraseña</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••" required className="input-gold pl-9 pr-10 py-3 text-sm" />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null} Iniciar sesión
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('¡Cuenta creada! Bienvenido a VELORA ⚜')
      navigate('/mi-cuenta')
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al registrarse')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Únete a la plataforma VELORA"
      link={<>¿Ya tienes cuenta? <Link to="/login" className="text-gold-400 hover:text-gold-300 font-semibold">Inicia sesión</Link></>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: 'name', label: 'Nombre completo', type: 'text', placeholder: 'John Doe', required: true },
          { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', required: true },
          { key: 'phone', label: 'Teléfono (opcional)', type: 'tel', placeholder: '+57 300 000 0000' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder} required={f.required} className="input-gold px-3 py-3 text-sm" />
          </div>
        ))}
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Contraseña</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Mín. 8 chars, 1 mayúscula, 1 número" required className="input-gold px-3 pr-10 py-3 text-sm" />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm mt-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null} Crear cuenta gratuita
        </button>
      </form>
    </AuthLayout>
  )
}
