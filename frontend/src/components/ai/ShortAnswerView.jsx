import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader, Play, Pause, StopCircle, Volume2 } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'

export default function ShortAnswerView({ content }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [grades, setGrades] = useState({})
  const [loading, setLoading] = useState({})
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech()

  let questions = []

  // Extract questions from different possible structures
  if (Array.isArray(content)) {
    questions = content
  } else if (content?.questions) {
    questions = content.questions
  } else if (content?.content?.questions) {
    questions = content.content.questions
  } else if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      questions = parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : [])
    } catch {
      questions = []
    }
  }

  // Stop speech when question changes
  useEffect(() => {
    stop()
  }, [currentIndex, stop])

  if (questions.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-600">No se pudieron procesar las preguntas</p>
      </div>
    )
  }

  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const hasAnswer = answers[currentIndex]?.trim()
  const grade = grades[currentIndex]

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentIndex]: e.target.value
    })
  }

  const handleSubmit = async () => {
    const studentAnswer = answers[currentIndex]
    if (!studentAnswer?.trim()) return

    setLoading({ ...loading, [currentIndex]: true })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: current.question,
          rubric: current.rubric,
          modelAnswer: current.modelAnswer,
          studentAnswer
        })
      })

      if (!response.ok) throw new Error('Error grading answer')

      const result = await response.json()
      setGrades({
        ...grades,
        [currentIndex]: result.data
      })
    } catch (error) {
      console.error('Error grading answer:', error)
      alert('Error al evaluar la respuesta. Por favor, intenta de nuevo.')
    } finally {
      setLoading({ ...loading, [currentIndex]: false })
    }
  }

  const handlePlayPause = () => {
    const textToSpeak = `Pregunta: ${current.question}`
    if (isSpeaking && !isPaused) {
      pause()
    } else if (isPaused) {
      resume()
    } else {
      speak(textToSpeak)
    }
  }

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Preguntas de Respuesta Corta</h3>
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* TTS Controls */}
      {isSupported && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Volume2 size={14} />
            <span>Text-to-Speech disponible</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePlayPause}
              className="btn btn-secondary flex items-center gap-2 text-sm"
              title={isSpeaking && !isPaused ? 'Pausar' : 'Reproducir'}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause size={16} />
                  Pausar
                </>
              ) : (
                <>
                  <Play size={16} />
                  {isPaused ? 'Continuar' : 'Escuchar'}
                </>
              )}
            </button>
            {isSpeaking && (
              <button
                onClick={stop}
                className="btn btn-secondary flex items-center gap-2 text-sm"
                title="Detener"
              >
                <StopCircle size={16} />
                Detener
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{current.question}</h4>
          <p className="text-sm text-gray-600">
            <strong>Criterios de evaluación:</strong> {current.rubric}
          </p>
        </div>

        {/* Answer Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu respuesta (2-4 oraciones, 50-100 palabras):
          </label>
          <textarea
            value={answers[currentIndex] || ''}
            onChange={handleAnswerChange}
            disabled={!!grade}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Escribe tu respuesta aquí..."
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              Palabras: {(answers[currentIndex] || '').split(/\s+/).filter(w => w).length}
            </span>
            {!grade && (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer || loading[currentIndex]}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading[currentIndex] ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Evaluando...
                  </>
                ) : (
                  'Enviar para Evaluación'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Grading Result */}
        {grade && (
          <div className={`rounded-lg p-4 border-2 ${
            grade.score >= 70 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {grade.score >= 70 ? (
                <CheckCircle className="text-green-600" size={24} />
              ) : (
                <AlertCircle className="text-yellow-600" size={24} />
              )}
              <div>
                <h5 className="font-semibold text-lg">
                  Puntuación: {grade.score}/100
                </h5>
                <p className="text-sm text-gray-600">
                  {grade.score >= 90 ? 'Excelente' : grade.score >= 70 ? 'Bien' : 'Necesita mejorar'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h6 className="font-semibold text-sm mb-1">Feedback:</h6>
                <p className="text-sm text-gray-700">{grade.feedback}</p>
              </div>

              {grade.suggestions && (
                <div>
                  <h6 className="font-semibold text-sm mb-1">Sugerencias para mejorar:</h6>
                  <p className="text-sm text-gray-700">{grade.suggestions}</p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-300">
                <h6 className="font-semibold text-sm mb-1">Respuesta modelo:</h6>
                <p className="text-sm text-gray-600 italic">{current.modelAnswer}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
          className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-sm mb-2">Progreso General:</h5>
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded ${
                grades[idx]
                  ? grades[idx].score >= 70
                    ? 'bg-green-500'
                    : 'bg-yellow-500'
                  : answers[idx]?.trim()
                    ? 'bg-blue-300'
                    : 'bg-gray-300'
              }`}
              title={`Pregunta ${idx + 1}${grades[idx] ? `: ${grades[idx].score}/100` : ''}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {Object.keys(grades).length} de {questions.length} preguntas evaluadas
        </p>
      </div>
    </div>
  )
}
