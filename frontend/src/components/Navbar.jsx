import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { logout, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span>SMS - Student Management System</span>
        </Link>
      </div>
      {isAuthenticated && (
        <div className="navbar-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
