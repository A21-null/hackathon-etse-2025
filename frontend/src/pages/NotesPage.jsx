import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import NoteList from '../components/notes/NoteList'
import { useNotes } from '../hooks/useNotes'

export default function NotesPage() {
  const { notes, loading, error, fetchAllNotes } = useNotes()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const params = {}
        if (searchTerm) params.search = searchTerm
        if (selectedTags.length > 0) params.tags = selectedTags.join(',')
        await fetchAllNotes(params)
      } catch (err) {
        console.error('Error fetching notes:', err)
      }
    }

    const timer = setTimeout(fetchNotes, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedTags, fetchAllNotes])

  // Extract all tags from notes
  useEffect(() => {
    const tags = new Set()
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tags.add(tag))
      }
    })
    setAllTags(Array.from(tags))
  }, [notes])

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Apuntes Públicos</h1>
        <p className="text-gray-600 mb-8">Explora apuntes compartidos por la comunidad de estudiantes</p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar apuntes por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Filter size={16} />
              Filtrar por etiqueta
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-1"
                >
                  <X size={14} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <NoteList
        notes={notes}
        loading={loading}
        error={error}
        emptyMessage="No se encontraron apuntes. ¡Sé el primero en compartir uno!"
      />
    </div>
  )
}
