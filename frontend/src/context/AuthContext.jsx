import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      setUser({ email: localStorage.getItem('userEmail') })
    }
    setLoading(false)
  }, [])

  const login = (token, userEmail) => {
    setToken(token)
    setUser({ email: userEmail })
    localStorage.setItem('token', token)
    localStorage.setItem('userEmail', userEmail)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
