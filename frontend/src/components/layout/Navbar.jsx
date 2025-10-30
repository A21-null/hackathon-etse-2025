import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, BookOpen, Plus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
            <BookOpen size={28} />
            <span>StudyFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/notes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Apuntes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-notes"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Mis Apuntes
                </Link>
                <Link
                  to="/create"
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Nuevo Apunte
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">Hola, {user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2">
                    <LogOut size={18} />
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn btn-primary">
                  Inicia Sesión
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <Link
              to="/notes"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Apuntes
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-notes"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Mis Apuntes
                </Link>
                <Link
                  to="/create"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Nuevo Apunte
                </Link>
                <div className="py-2">
                  <span className="text-sm text-gray-700">Hola, {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-gray-700 hover:text-red-600"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block py-2 text-gray-700 hover:text-primary-600"
                onClick={() => setIsOpen(false)}
              >
                Inicia Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
