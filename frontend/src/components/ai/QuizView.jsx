import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Plus, Play, Pause, StopCircle, Volume2 } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'

export default function QuizView({ content, onExpand }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech()

  // Stop speech when question changes
  useEffect(() => {
    stop()
  }, [currentIndex, stop])

  let questions = []

  // Extract questions from different possible structures
  if (Array.isArray(content)) {
    questions = content
  } else if (content?.questions) {
    // Backend returns {questions: [...]}
    questions = content.questions
  } else if (content?.content?.questions) {
    // Backend returns {content: {questions: [...]}}
    questions = content.content.questions
  } else if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      questions = parsed.questions || parsed.data || (Array.isArray(parsed) ? parsed : [])
    } catch {
      questions = [{ question: 'Error', options: ['No se pudo procesar el quiz'], correctAnswer: 0 }]
    }
  } else {
    // Fallback
    questions = [{ question: 'Error', options: ['No se pudo procesar el quiz'], correctAnswer: 0 }]
  }

  if (questions.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-600">No se pudieron procesar las preguntas del quiz</p>
      </div>
    )
  }

  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const isAnswered = selectedAnswers[currentIndex] !== undefined
  const isCorrect = selectedAnswers[currentIndex] === current.correctAnswer

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex,
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, answer]) => questions[idx].correctAnswer === answer
  ).length

  const handleExpand = async () => {
    if (onExpand) {
      setIsExpanding(true)
      try {
        await onExpand()
        // Reset quiz state to show new questions
        setCurrentIndex(0)
        setSelectedAnswers({})
        setShowResults(false)
      } catch (error) {
        console.error('Error expanding quiz:', error)
      } finally {
        setIsExpanding(false)
      }
    }
  }

  const handlePlayPause = () => {
    if (!current) return

    // Build text to speak: question + options
    let textToSpeak = `Pregunta: ${current.question}. `
    if (current.type === 'truefalse') {
      textToSpeak += 'Verdadero o Falso?'
    } else {
      textToSpeak += 'Opciones: '
      current.options.forEach((option, idx) => {
        textToSpeak += `${String.fromCharCode(65 + idx)}. ${option}. `
      })
    }

    if (isSpeaking && !isPaused) {
      pause()
    } else if (isPaused) {
      resume()
    } else {
      speak(textToSpeak)
    }
  }

  if (showResults) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="card space-y-6">
        <h3 className="text-xl font-semibold">Resultados del Quiz</h3>
        <div className={`border-2 rounded-lg p-6 text-center ${
          passed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className={`text-4xl font-bold mb-2 ${
            passed ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {percentage}%
          </div>
          <p className="text-lg text-gray-700">
            {correctCount} de {questions.length} respuestas correctas
          </p>
          {passed ? (
            <p className="text-green-700 mt-2 text-sm">¡Excelente trabajo!</p>
          ) : (
            <p className="text-yellow-700 mt-2 text-sm">Sigue practicando</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0)
              setSelectedAnswers({})
              setShowResults(false)
            }}
            className="btn btn-secondary"
          >
            Reintentar Quiz
          </button>

          {onExpand && (
            <button
              onClick={handleExpand}
              disabled={isExpanding}
              className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={18} />
              {isExpanding ? 'Generando...' : 'Expandir Quiz'}
            </button>
          )}
        </div>

        {onExpand && (
          <p className="text-xs text-gray-500 text-center">
            Genera más preguntas para continuar practicando
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quiz</h3>
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
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-6">{current.question}</h4>

        {/* Options */}
        <div className={current.type === 'truefalse' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
          {current.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx
            const isCorrectOption = idx === current.correctAnswer

            let buttonClass = 'border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50'

            if (isAnswered) {
              if (isSelected && isCorrect) {
                buttonClass = 'border-2 border-green-500 bg-green-50'
              } else if (isSelected && !isCorrect) {
                buttonClass = 'border-2 border-red-500 bg-red-50'
              } else if (isCorrectOption && !isCorrect) {
                buttonClass = 'border-2 border-green-500 bg-green-50'
              } else {
                buttonClass = 'border-2 border-gray-200'
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !isAnswered && handleSelectAnswer(idx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-lg text-left transition-all ${buttonClass} disabled:cursor-default`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {current.type !== 'truefalse' && (
                      <span className="font-medium text-gray-900">{String.fromCharCode(65 + idx)}. </span>
                    )}
                    <span className={`${current.type === 'truefalse' ? 'font-semibold text-center block' : 'ml-3'} text-gray-700`}>
                      {option}
                    </span>
                  </div>
                  {isAnswered && (
                    <>
                      {isSelected && isCorrect && <CheckCircle className="text-green-600 flex-shrink-0" size={20} />}
                      {isSelected && !isCorrect && <XCircle className="text-red-600 flex-shrink-0" size={20} />}
                      {isCorrectOption && !isCorrect && <CheckCircle className="text-green-600 flex-shrink-0" size={20} />}
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {isAnswered && current.explanation && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Explicación:</p>
            <p className="text-sm text-blue-800">{current.explanation}</p>
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
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentIndex === questions.length - 1 ? 'Ver Resultados' : 'Siguiente'}
        </button>
      </div>
    </div>
  )
}
