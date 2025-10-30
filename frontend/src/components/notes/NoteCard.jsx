import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Eye } from 'lucide-react'

export default function NoteCard({ note }) {
  const date = new Date(note.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const excerpt = note.content.substring(0, 150)

  return (
    <Link to={`/notes/${note.id}`}>
      <div className="card-hover">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
          {note.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {excerpt}
          {note.content.length > 150 && '...'}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="tag">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{note.author?.name || 'Anónimo'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
