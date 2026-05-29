import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/layout/AdminLayout'

// Pages
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import WishlistPage from './pages/WishlistPage'
import MiCuentaPage from './pages/MiCuentaPage'
import NosotrosPage from './pages/NosotrosPage'
import ContactoPage from './pages/ContactoPage'
import PoliticasPage from './pages/PoliticasPage'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  return children
}

function PageLoader() {
  return (
    <div className="fixed inset-0 bg-dark-600 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        <p className="text-gold-500 font-display text-xl tracking-widest animate-pulse">AURUM</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <Routes>
          {/* Public/User Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/favoritos" element={<WishlistPage />} />
            <Route path="/mi-cuenta" element={<ProtectedRoute><MiCuentaPage /></ProtectedRoute>} />
            <Route path="/nosotros" element={<NosotrosPage />} />
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/politicas" element={<PoliticasPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/pedidos" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/pedidos/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
