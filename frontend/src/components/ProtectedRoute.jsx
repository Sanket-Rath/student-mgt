import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return <div className="loader">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  return children
}
