import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Wand2, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comparte Apuntes y Genera Material de Estudio con IA
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              StudyFlow es la plataforma colaborativa donde puedes compartir tus apuntes con otros
              estudiantes y generar resúmenes, flashcards y quizzes automáticamente con inteligencia
              artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/notes" className="btn btn-primary flex items-center justify-center gap-2">
                Explorar Apuntes <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/auth" className="btn btn-outline flex items-center justify-center gap-2">
                  Registrarse
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg opacity-20 blur-3xl"></div>
              <div className="relative bg-white rounded-lg shadow-2xl p-8 h-full flex items-center justify-center">
                <BookOpen size={120} className="text-primary-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600">
              Herramientas diseñadas para optimizar tu aprendizaje
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 p-4 rounded-lg">
                  <BookOpen className="text-primary-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compartir Apuntes</h3>
              <p className="text-gray-600">
                Sube tus apuntes y comparte tu conocimiento con estudiantes de todo el mundo.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-lg">
                  <Wand2 className="text-purple-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">IA Generativa</h3>
              <p className="text-gray-600">
                Usa Claude AI para generar resúmenes, flashcards y quizzes automáticamente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <Users className="text-green-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidad Activa</h3>
              <p className="text-gray-600">
                Conéctate con otros estudiantes y aprende de manera colaborativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {isAuthenticated ? '¡Comienza a crear!' : '¿Listo para empezar?'}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {isAuthenticated
              ? 'Crea tu primer apunte y genera material de estudio con IA.'
              : 'Únete a la comunidad de estudiantes que aprenden mejor con StudyFlow.'}
          </p>
          {isAuthenticated ? (
            <Link to="/create" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Crear Nuevo Apunte
            </Link>
          ) : (
            <Link to="/auth" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Registrarse Ahora
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
