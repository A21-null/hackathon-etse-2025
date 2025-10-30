import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Play, Pause, StopCircle, Volume2 } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'

export default function FlashcardView({ content }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech()

  // Stop speech when card changes or flips
  useEffect(() => {
    stop()
  }, [currentIndex, flipped, stop])

  let flashcards = []

  // Extract flashcards from different possible structures
  if (Array.isArray(content)) {
    flashcards = content
  } else if (content?.cards) {
    // Backend returns {cards: [...]}
    flashcards = content.cards
  } else if (content?.content?.cards) {
    // Backend returns {content: {cards: [...]}}
    flashcards = content.content.cards
  } else if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content)
      flashcards = parsed.cards || parsed.data || (Array.isArray(parsed) ? parsed : [])
    } catch {
      flashcards = [{ front: 'Contenido', back: content }]
    }
  } else {
    // Fallback
    flashcards = [{ front: 'Error', back: 'No se pudieron cargar las flashcards' }]
  }

  if (flashcards.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-600">No se pudieron procesar las flashcards</p>
      </div>
    )
  }

  const current = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const handlePlayPause = () => {
    const textToSpeak = flipped ? current.back : current.front
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
        <h3 className="text-xl font-semibold">Flashcards Generadas</h3>
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {flashcards.length}
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

      {/* Flashcard */}
      <div className="perspective">
        <button
          onClick={() => setFlipped(!flipped)}
          className={`w-full aspect-video rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 text-white font-semibold text-center ${
            flipped
              ? 'bg-gradient-to-br from-purple-500 to-purple-700'
              : 'bg-gradient-to-br from-primary-500 to-primary-700'
          }`}
        >
          <div className="text-sm opacity-75 mb-2">
            {flipped ? 'Respuesta' : 'Pregunta'}
          </div>
          <div className="text-lg md:text-2xl px-4 line-clamp-6">
            {flipped ? current.back : current.front}
          </div>
          <div className="text-xs mt-4 opacity-50">
            Haz click para {flipped ? 'ocultar' : 'revelar'}
          </div>
        </button>
      </div>

      {/* Difficulty */}
      {current.difficulty && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Dificultad:</span>
          <span
            className={`tag ${
              current.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : current.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {current.difficulty}
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ChevronUp size={18} />
          Anterior
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))}
          disabled={currentIndex === flashcards.length - 1}
          className="flex-1 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Siguiente
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  )
}
