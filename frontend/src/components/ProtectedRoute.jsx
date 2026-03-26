import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ adminOnly = false, children }) {
  const location = useLocation()
  const { isAdmin, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="loading-panel panel">Loading your workspace...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (!adminOnly && isAdmin && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />
  }

  return children
}
