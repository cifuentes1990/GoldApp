import { useState, useEffect, useCallback } from 'react'
import { Search, Shield, ShieldOff, Trash2, Loader2, UserCheck, UserX, ChevronLeft, ChevronRight, X, Mail, Phone, TrendingUp } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'
import { useDebounce } from '../../hooks/useDebounce'
import toast from 'react-hot-toast'

const ROLE_FILTERS = [
  { key: '', label: 'Todos' },
  { key: 'admin', label: 'Admins' },
  { key: 'user', label: 'Clientes' },
  { key: 'inactive', label: 'Inactivos' },
]

function UserDetailModal({ user: u, onClose, onChanged }) {
  const { user: me } = useAuth()
  const [actionLoading, setActionLoading] = useState(null)
  const isMe = String(u._id) === String(me?._id)

  const toggleRole = async () => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`¿Cambiar rol de ${u.name} a "${newRole}"?`)) return
    setActionLoading('role')
    try { await api.patch(`/users/${u._id}/role`, { role: newRole }); toast.success(`Rol: ${newRole}`); onChanged(); onClose() }
    catch (err) { toast.error(err.response?.data?.error || 'Error') } finally { setActionLoading(null) }
  }

  const toggleStatus = async () => {
    setActionLoading('status')
    try { await api.patch(`/users/${u._id}/status`, { isActive: !u.isActive }); toast.success(u.isActive ? 'Usuario desactivado' : 'Usuario activado'); onChanged(); onClose() }
    catch { toast.error('Error') } finally { setActionLoading(null) }
  }

  const deleteUser = async () => {
    if (!confirm(`¿Eliminar permanentemente a ${u.name}?`)) return
    setActionLoading('del')
    try { await api.delete(`/users/${u._id}`); toast.success('Usuario eliminado'); onChanged(); onClose() }
    catch (err) { toast.error(err.response?.data?.error || 'Error') } finally { setActionLoading(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-dark-500 border border-white/10 rounded-2xl shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-white">Gestionar usuario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 ${u.role === 'admin' ? 'bg-gold-gradient text-dark-600' : 'bg-dark-300 text-gray-300'}`}>
              {u.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white">{u.name} {isMe && <span className="text-xs text-gold-500">(Tú)</span>}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>{u.role === 'admin' ? '⚜ Admin' : 'Cliente'}</span>
                <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-card p-4 border border-white/5 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400"><Mail size={13} className="text-gray-600" />{u.email}</div>
            {u.phone && <div className="flex items-center gap-2 text-gray-400"><Phone size={13} className="text-gray-600" />{u.phone}</div>}
            <div className="flex items-center gap-2 text-gray-500 text-xs">Registrado: {new Date(u.createdAt).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}</div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 border border-white/5 text-center">
              <p className="font-mono font-bold text-blue-400 text-xl">{u.orderCount || 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pedidos</p>
            </div>
            <div className="glass-card p-3 border border-white/5 text-center">
              <p className="font-mono font-bold text-gold-400 text-xl">${(u.totalSpent || 0).toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total gastado</p>
            </div>
          </div>

          {/* Actions */}
          {!isMe && (
            <div className="space-y-2">
              <button onClick={toggleRole} disabled={!!actionLoading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-400/50 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/20 text-sm text-gray-300 hover:text-gold-400 transition-all">
                {actionLoading === 'role' ? <Loader2 size={15} className="animate-spin" /> : u.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                {u.role === 'admin' ? 'Quitar permisos de Admin' : 'Promover a Admin'}
              </button>
              <button onClick={toggleStatus} disabled={!!actionLoading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-400/50 hover:bg-yellow-500/10 border border-white/5 hover:border-yellow-500/20 text-sm text-gray-300 hover:text-yellow-400 transition-all">
                {actionLoading === 'status' ? <Loader2 size={15} className="animate-spin" /> : u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                {u.isActive ? 'Suspender cuenta' : 'Reactivar cuenta'}
              </button>
              <button onClick={deleteUser} disabled={!!actionLoading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-400/50 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-sm text-gray-300 hover:text-red-400 transition-all">
                {actionLoading === 'del' ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Eliminar usuario permanentemente
              </button>
            </div>
          )}
          {isMe && <p className="text-center text-xs text-gray-600">No puedes modificar tu propia cuenta</p>}
        </div>
      </div>
    </div>
  )
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const debouncedSearch = useDebounce(search, 400)
  const [roleCounts, setRoleCounts] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: 15, page,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(roleFilter === 'inactive' ? { isActive: 'false' } : roleFilter ? { role: roleFilter } : {}),
      })
      const res = await api.get(`/users?${params}`)
      setUsers(res.data.users)
      setTotal(res.data.total)
      setPages(res.data.pages || 1)
    } catch { } finally { setLoading(false) }
  }, [page, debouncedSearch, roleFilter])

  useEffect(() => {
    api.get('/users?limit=200').then(res => {
      const u = res.data.users || []
      setRoleCounts({
        '': u.length,
        admin: u.filter(x => x.role === 'admin').length,
        user: u.filter(x => x.role === 'user').length,
        inactive: u.filter(x => !x.isActive).length,
      })
    }).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const admins   = roleCounts['admin'] || 0
  const clients  = roleCounts['user']  || 0
  const inactive = roleCounts['inactive'] || 0

  return (
    <div className="space-y-6">
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} onChanged={load} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display tracking-wider text-white">GESTIÓN <span className="gold-text">USUARIOS</span></h1>
          <p className="text-gray-500 text-sm mt-1">{total} usuarios registrados</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-2.5 text-center border border-gold-500/15">
            <p className="text-xs text-gray-500">Admins</p>
            <p className="font-mono font-bold text-gold-400">{admins}</p>
          </div>
          <div className="glass-card px-4 py-2.5 text-center border border-blue-500/15">
            <p className="text-xs text-gray-500">Clientes</p>
            <p className="font-mono font-bold text-blue-400">{clients}</p>
          </div>
          {inactive > 0 && (
            <div className="glass-card px-4 py-2.5 text-center border border-red-500/15">
              <p className="text-xs text-gray-500">Inactivos</p>
              <p className="font-mono font-bold text-red-400">{inactive}</p>
            </div>
          )}
        </div>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ROLE_FILTERS.map(f => {
          const count = roleCounts[f.key] ?? 0
          const isActive = roleFilter === f.key
          return (
            <button key={f.key} onClick={() => { setRoleFilter(f.key); setPage(1) }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                isActive ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' : 'bg-dark-400/50 text-gray-400 border-white/5 hover:border-white/15 hover:text-gray-200'
              }`}>
              {f.label}
              <span className={`font-mono text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-gold-500/20 text-gold-400' : 'bg-dark-300 text-gray-600'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar por nombre o email..."
          className="input-gold pl-9 pr-4 py-2.5 text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={13} /></button>}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {loading && Array(6).fill(0).map((_,i) => (
          <div key={i} className="h-20 shimmer-bg rounded-2xl" />
        ))}
        {!loading && users.map(user => {
          const isMe = String(user._id) === String(me?._id)
          return (
            <button key={user._id} onClick={() => setSelectedUser(user)}
              className={`w-full glass-card p-4 border text-left transition-all active:scale-[.98] ${!user.isActive ? 'opacity-60 border-white/3' : 'border-white/5'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${user.role === 'admin' ? 'bg-gold-gradient text-dark-600' : 'bg-dark-300 text-gray-400'}`}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{user.name}{isMe && <span className="text-gold-500 text-xs ml-1">(Tú)</span>}</p>
                    <span className={`badge ${user.role === 'admin' ? 'badge-gold' : 'badge-blue'} flex-shrink-0`}>
                      {user.role === 'admin' ? '⚜ Admin' : 'Cliente'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-gold-400 font-bold text-sm">${(user.totalSpent || 0).toFixed(0)}</p>
                  <p className="text-xs text-gray-600">{user.orderCount || 0} pedidos</p>
                </div>
              </div>
            </button>
          )
        })}
        {!loading && users.length === 0 && (
          <p className="text-center text-gray-600 py-12">No se encontraron usuarios</p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block glass-card border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-dark-400/30">
                {['Usuario','Email','Teléfono','Pedidos','Gastado','Rol','Estado','Registrado',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && Array(10).fill(0).map((_,i) => (
                <tr key={i}><td colSpan={9} className="px-4 py-3"><div className="h-8 shimmer-bg rounded-lg" /></td></tr>
              ))}
              {!loading && users.map(user => {
                const isMe = String(user._id) === String(me?._id)
                return (
                  <tr key={user._id} className={`table-row hover:bg-white/2 transition-colors ${isMe ? 'bg-gold-500/3' : ''} ${!user.isActive ? 'opacity-55' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${user.role === 'admin' ? 'bg-gold-gradient text-dark-600' : 'bg-dark-300 text-gray-400'}`}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-medium text-white text-xs">
                          {user.name} {isMe && <span className="text-gold-500">(Tú)</span>}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[150px]">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-blue-400 font-bold">{user.orderCount || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={10} className="text-gold-500" />
                        <span className="font-mono text-xs text-gold-400 font-bold">${(user.totalSpent || 0).toFixed(0)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>
                        {user.role === 'admin' ? '⚜ Admin' : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('es-CO',{day:'2-digit',month:'short',year:'2-digit'})}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedUser(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-300 hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 text-xs font-medium transition-colors whitespace-nowrap">
                        Gestionar
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!loading && users.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-14 text-center text-gray-600">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">Página {page} de {pages} · {total} usuarios</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="btn-outline p-2 disabled:opacity-30"><ChevronLeft size={15} /></button>
            {Array.from({length:Math.min(pages,7)},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p===page?'bg-gold-500 text-dark-600':'btn-outline'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages,p+1))} disabled={page===pages} className="btn-outline p-2 disabled:opacity-30"><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  )
}
