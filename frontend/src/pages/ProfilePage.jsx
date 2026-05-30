import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, Save, Loader2, Package, Heart, LayoutGrid, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DEPARTAMENTOS = [
  'Antioquia','Atlántico','Bogotá D.C.','Bolívar','Boyacá','Caldas','Caquetá',
  'Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Huila','La Guajira',
  'Magdalena','Meta','Nariño','Norte de Santander','Quindío','Risaralda',
  'San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca',
  'Arauca','Casanare','Putumayo','Amazonas','Guainía','Guaviare','Vaupés','Vichada',
]

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const [tab, setTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || 'Antioquia', country: user?.address?.country || 'Colombia',
    zipCode: user?.address?.zipCode || '',
  })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/auth/profile', {
        name: form.name, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, country: form.country, zipCode: form.zipCode },
      })
      updateUser(res.data.user)
      toast.success('Perfil actualizado ✓')
    } catch (err) { toast.error(err.response?.data?.error || 'Error al guardar') } finally { setSaving(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Las contraseñas no coinciden'); return }
    setSaving(true)
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Contraseña actualizada ✓')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { toast.error(err.response?.data?.error || 'Error al cambiar contraseña') } finally { setSaving(false) }
  }

  const inputCls = 'input-gold px-3 py-2.5 text-sm'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-1">Cuenta</p>
        <h1 className="text-3xl font-display tracking-wider text-white">MI <span className="gold-text">PERFIL</span></h1>
      </div>

      {/* Avatar + quick stats block */}
      <div className="glass-card p-6 mb-6 border border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <span className="text-dark-600 text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-lg">{user?.name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>
              {user?.role === 'admin' ? '⚜ Admin' : 'Cliente'}
            </span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-xl hover:bg-red-500/10">
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>

        {/* Quick nav links */}
        <div className="divider-gold mt-5 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { to: '/mi-cuenta', icon: LayoutGrid, label: 'Mi cuenta', color: 'text-gold-400' },
            { to: '/pedidos', icon: Package, label: 'Pedidos', color: 'text-blue-400' },
            { to: '/favoritos', icon: Heart, label: `Favoritos (${wishlistCount})`, color: 'text-red-400' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-dark-400/40 hover:bg-dark-400/80 border border-white/5 hover:border-white/10 transition-all text-center">
              <item.icon size={18} className={item.color} />
              <span className="text-xs text-gray-400">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ key: 'profile', label: 'Datos personales', icon: User }, { key: 'security', label: 'Seguridad', icon: Lock }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20' : 'text-gray-400 hover:bg-white/5'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="glass-card p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Nombre completo</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Teléfono / WhatsApp</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+57 300 000 0000" className={inputCls} />
            </div>
            <div className="sm:col-span-2"><div className="divider-gold" /></div>
            <p className="sm:col-span-2 text-xs text-gray-500 uppercase tracking-wider font-semibold">Dirección de envío predeterminada</p>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Dirección</label>
              <input value={form.street} placeholder="Calle 123, Apto 4" onChange={e => setForm(p => ({ ...p, street: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Ciudad / Municipio</label>
              <input value={form.city} placeholder="Medellín" onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Departamento</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                {DEPARTAMENTOS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">País</label>
              <input value="Colombia" readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Código postal</label>
              <input value={form.zipCode} placeholder="050001" onChange={e => setForm(p => ({ ...p, zipCode: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar cambios
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={changePassword} className="glass-card p-6 border border-white/5 space-y-4">
          {[
            { key: 'currentPassword', label: 'Contraseña actual' },
            { key: 'newPassword', label: 'Nueva contraseña' },
            { key: 'confirmPassword', label: 'Confirmar nueva contraseña' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input type="password" value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls} />
            </div>
          ))}
          <p className="text-xs text-gray-600">Mínimo 8 caracteres, una mayúscula, una minúscula y un número</p>
          <button type="submit" disabled={saving} className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />} Cambiar contraseña
          </button>
        </form>
      )}
    </div>
  )
}
