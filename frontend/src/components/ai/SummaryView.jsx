import ReactMarkdown from 'react-markdown'
import { Play, Pause, StopCircle, Volume2 } from 'lucide-react'
import { useSpeech } from '../../hooks/useSpeech'

export default function SummaryView({ content }) {
  // Extract text from different possible structures
  const text = content?.text || content?.content?.text || content?.content || content
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech()

  // Convert markdown to plain text for TTS
  const getPlainText = (markdown) => {
    if (typeof markdown !== 'string') return ''
    // Remove markdown syntax for cleaner speech
    return markdown
      .replace(/[#*_~`]/g, '') // Remove markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()
  }

  const handlePlayPause = () => {
    if (isSpeaking && !isPaused) {
      pause()
    } else if (isPaused) {
      resume()
    } else {
      const plainText = getPlainText(text)
      speak(plainText)
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Resumen Generado</h3>

        {/* TTS Controls */}
        {isSupported && (
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
        )}
      </div>

      {/* Accessibility indicator */}
      {isSupported && (
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
          <Volume2 size={14} />
          <span>Text-to-Speech disponible</span>
        </div>
      )}

      <div className="markdown-content">
        <ReactMarkdown>{typeof text === 'string' ? text : JSON.stringify(text)}</ReactMarkdown>
      </div>
    </div>
  )
}
