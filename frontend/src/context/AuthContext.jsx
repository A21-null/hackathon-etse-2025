import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../api/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      // Clear invalid data from localStorage
      console.error('Failed to parse user data from localStorage:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  // Register
  const register = async (userData) => {
    try {
      setError(null)
      const response = await authAPI.register(userData)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Registration failed'
      setError(errorMessage)
      throw err
    }
  }

  // Login
  const login = async (credentials) => {
    try {
      setError(null)
      const response = await authAPI.login(credentials)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Login failed'
      setError(errorMessage)
      throw err
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setError(null)
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
