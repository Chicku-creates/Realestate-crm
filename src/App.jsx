import Pricing from './pages/Pricing'
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

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/pricing" element={<Pricing />} />
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