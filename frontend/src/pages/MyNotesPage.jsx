import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'
import NoteList from '../components/notes/NoteList'
import { useNotes } from '../hooks/useNotes'
import { useAuth } from '../hooks/useAuth'

export default function MyNotesPage() {
  const { user } = useAuth()
  const { notes, loading, error, fetchUserNotes } = useNotes()
  const [filter, setFilter] = useState('all') // 'all' or 'public'

  useEffect(() => {
    if (user) {
      fetchUserNotes(user.id, { filter })
    }
  }, [user, filter, fetchUserNotes])

  const filteredNotes = filter === 'public'
    ? notes.filter(note => note.is_public)
    : notes

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Apuntes</h1>
          <p className="text-gray-600">Administra y organiza tus apuntes</p>
        </div>
        <Link to="/create" className="btn btn-primary flex items-center justify-center gap-2">
          <Plus size={20} />
          Nuevo Apunte
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Todos ({notes.length})
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'public'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Públicos ({notes.filter(n => n.is_public).length})
        </button>
      </div>

      {/* Notes Grid */}
      <NoteList
        notes={filteredNotes}
        loading={loading}
        error={error}
        emptyMessage={
          notes.length === 0
            ? '¡Aún no has creado apuntes! Haz clic en "Nuevo Apunte" para comenzar.'
            : 'No hay apuntes con este filtro'
        }
      />
    </div>
  )
}
