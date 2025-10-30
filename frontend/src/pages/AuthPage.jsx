import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      setError(null)
      await login(credentials)
      navigate('/notes')
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Login failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    try {
      setIsLoading(true)
      setError(null)
      await register(userData)
      navigate('/notes')
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Registration failed'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">StudyFlow</h1>
            <p className="text-gray-600">
              {mode === 'login'
                ? 'Inicia sesión en tu cuenta'
                : 'Crea una nueva cuenta'}
            </p>
          </div>

          {/* Forms */}
          {mode === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login'
                ? '¿No tienes cuenta? '
                : '¿Ya tienes cuenta? '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setError(null)
                }}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
