import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Calendar, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import AIGeneratorPanel from '../components/ai/AIGeneratorPanel'
import SummaryView from '../components/ai/SummaryView'
import FlashcardView from '../components/ai/FlashcardView'
import QuizView from '../components/ai/QuizView'
import ShortAnswerView from '../components/ai/ShortAnswerView'
import CommentSection from '../components/comments/CommentSection'
import { useNotes } from '../hooks/useNotes'
import { useAuth } from '../hooks/useAuth'

export default function NoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { fetchNoteById, deleteNote } = useNotes()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [viewType, setViewType] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true)
        const data = await fetchNoteById(id)
        // Backend returns {success, data: {note}}
        const noteData = data.data?.note || data.note || data
        setNote(noteData)
      } catch (err) {
        const errorMessage = typeof err === 'string' ? err : err.message || 'Error loading note'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadNote()
  }, [id, fetchNoteById])

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este apunte?')) return

    try {
      setIsDeleting(true)
      await deleteNote(id)
      navigate('/my-notes')
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error deleting note'
      setError(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const isAuthor = user && note && user.id === note.authorId

  const date = note ? new Date(note.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : ''

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error || 'Apunte no encontrado'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/notes')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      {/* Header */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {note.title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{note.author?.name || 'Anónimo'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {isAuthor && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/notes/${id}/edit`)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Edit2 size={18} />
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} />
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card markdown-content">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Generator */}
          <AIGeneratorPanel
            noteId={id}
            onGenerated={(data) => {
              setGeneratedContent(data.content)
              setViewType(data.type)
            }}
          />
        </div>
      </div>

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-12">
          {viewType === 'summary' && <SummaryView content={generatedContent} />}
          {viewType === 'flashcards' && <FlashcardView content={generatedContent} />}
          {viewType === 'quiz' && (
            <QuizView
              content={generatedContent}
              onExpand={async () => {
                // Generate more questions by calling AI again and merging
                const { aiAPI } = await import('../api/ai')
                const newContent = await aiAPI.generateQuiz(id)
                const newQuestions = newContent?.content?.questions || newContent?.questions || []
                const existingQuestions = generatedContent?.questions || []

                // Merge old and new questions
                setGeneratedContent({
                  ...generatedContent,
                  questions: [...existingQuestions, ...newQuestions]
                })
              }}
            />
          )}
          {viewType === 'shortanswer' && <ShortAnswerView content={generatedContent} />}
        </div>
      )}

      {/* Comments Section */}
      {note.isPublic && (
        <div className="mt-12">
          <CommentSection noteId={id} />
        </div>
      )}
    </div>
  )
}
