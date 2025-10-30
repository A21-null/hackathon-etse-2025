import { useState } from 'react'
import { Wand2, FileText, Sparkles, HelpCircle, Edit3 } from 'lucide-react'
import { aiAPI } from '../../api/ai'

export default function AIGeneratorPanel({ noteId, onGenerated }) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(null)
  const [error, setError] = useState(null)

  const generators = [
    {
      id: 'summary',
      label: 'Resumen',
      icon: FileText,
      description: 'Genera un resumen estructurado del apunte',
      color: 'blue',
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: Sparkles,
      description: 'Crea tarjetas de estudio interactivas',
      color: 'purple',
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: HelpCircle,
      description: 'Genera preguntas de opción múltiple',
      color: 'green',
    },
    {
      id: 'shortanswer',
      label: 'Respuesta Corta',
      icon: Edit3,
      description: 'Preguntas de desarrollo corregidas por IA',
      color: 'orange',
    },
  ]

  const handleGenerate = async (type) => {
    try {
      setLoading(true)
      setError(null)
      setActiveTab(type)

      let response
      switch (type) {
        case 'summary':
          response = await aiAPI.generateSummary(noteId)
          break
        case 'flashcards':
          response = await aiAPI.generateFlashcards(noteId)
          break
        case 'quiz':
          response = await aiAPI.generateQuiz(noteId)
          break
        case 'shortanswer':
          response = await aiAPI.generateShortAnswer(noteId)
          break
        default:
          break
      }

      // Extract content from response
      const content = response?.content || response
      onGenerated?.({ type, content })
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error generating content'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <Wand2 className="text-primary-600" size={20} />
        <h3 className="text-lg md:text-xl font-semibold">Generar Material de Estudio</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-6">
          <p className="text-red-800 text-xs md:text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {generators.map(gen => {
          const Icon = gen.icon
          return (
            <button
              key={gen.id}
              onClick={() => handleGenerate(gen.id)}
              disabled={loading}
              className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed flex items-start gap-3"
            >
              <Icon className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base">{gen.label}</h4>
                <p className="text-xs md:text-sm text-gray-600 mt-1">{gen.description}</p>
                {loading && activeTab === gen.id && (
                  <div className="mt-2 flex items-center gap-2 text-primary-600">
                    <div className="spinner w-3 h-3 md:w-4 md:h-4"></div>
                    <span className="text-xs">Generando...</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
