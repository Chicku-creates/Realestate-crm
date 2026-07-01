import Pricing from './pages/Pricing'
import Home from './pages/Home'
import About from './pages/About'
import SubscriptionGuard from './components/SubscriptionGuard'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Leads } from './pages/Leads'
import { Pipeline } from './pages/Pipeline'
import { Inventory } from './pages/Inventory'
import { ProjectDetail } from './pages/ProjectDetail'
import { SiteVisits } from './pages/SiteVisits'
import { Account } from './pages/Account'
import Terms from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import Shipping from './pages/legal/Shipping'
import Contact from './pages/legal/Contact'
import Refunds from './pages/legal/Refunds'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function HomeRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<HomeRoute><Home /></HomeRoute>} />
      <Route path="/about" element={<About />} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Pricing */}
      <Route path="/pricing" element={<Pricing />} />

      {/* Legal Pages - public, no auth needed */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refunds" element={<Refunds />} />

      {/* Protected App Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><SubscriptionGuard><Dashboard /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><SubscriptionGuard><Leads /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/pipeline" element={<ProtectedRoute><SubscriptionGuard><Pipeline /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><SubscriptionGuard><Inventory /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/inventory/:projectId" element={<ProtectedRoute><SubscriptionGuard><ProjectDetail /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/visits" element={<ProtectedRoute><SubscriptionGuard><SiteVisits /></SubscriptionGuard></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><SubscriptionGuard><Account /></SubscriptionGuard></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}