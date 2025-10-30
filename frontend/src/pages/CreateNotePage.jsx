import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import FileUpload from '../components/upload/FileUpload'

export default function CreateNotePage() {
  const navigate = useNavigate()
  const { createNote } = useNotes()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    isPublic: true,
    attachments: [],
  })

  const [tagInput, setTagInput] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }))
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (idx) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx),
    }))
  }

  const handleFileUploaded = (file) => {
    setUploadedFile(file)
    setFormData(prev => ({
      ...prev,
      content: file.extractedText || '',
      attachments: [file.filename],
    }))
  }

  const handleFileRemoved = () => {
    setUploadedFile(null)
    setFormData(prev => ({
      ...prev,
      content: '',
      attachments: [],
    }))
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Título es requerido'
    if (!formData.content.trim()) errors.content = 'Contenido es requerido'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await createNote(formData)
      // Extract note ID from various possible response structures
      const noteId = response.note?.id || response.data?.note?.id || response.data?.id || response.id
      if (noteId) {
        navigate(`/notes/${noteId}`)
      } else {
        // Fallback: go to my notes page if no ID found
        navigate('/my-notes')
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error creating note'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/my-notes')}
        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Nuevo Apunte</h1>
        <p className="text-gray-600">Comparte tus apuntes con la comunidad</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del Apunte
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Cálculo Diferencial - Derivadas"
            className="input"
          />
        </div>

        {/* Content - Show textarea OR file upload */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Contenido
          </label>

          {!uploadedFile ? (
            <>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Escribe tu contenido aquí usando Markdown, o sube un PDF para extraer el texto automáticamente."
                rows={12}
                className="textarea"
              />
              <p className="text-xs text-gray-500 mt-2">
                Soporta Markdown: **negrita**, *itálica*, # títulos, - listas, etc.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-3">O sube un archivo PDF:</p>
                <FileUpload
                  onFileUploaded={handleFileUploaded}
                  onFileRemoved={handleFileRemoved}
                />
              </div>
            </>
          ) : (
            <>
              <FileUpload
                onFileUploaded={handleFileUploaded}
                onFileRemoved={handleFileRemoved}
                existingFile={uploadedFile}
              />
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Texto extraído del PDF ({formData.content.length} caracteres)
                </p>
                <details className="mt-2">
                  <summary className="text-xs text-green-700 cursor-pointer hover:underline">
                    Ver contenido extraído
                  </summary>
                  <div className="mt-2 p-2 bg-white rounded border border-green-200 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">{formData.content}</pre>
                  </div>
                </details>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, idx) => (
              <div
                key={idx}
                className="tag bg-primary-100 text-primary-700 flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Escribe una etiqueta y presiona Enter"
            className="input"
          />
        </div>

        {/* Is Public */}
        <div className="card">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-gray-900">Público</span>
              <p className="text-sm text-gray-600">
                {formData.isPublic
                  ? 'Este apunte será visible para todos'
                  : 'Este apunte solo será visible para ti'}
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            {isLoading ? 'Creando...' : 'Crear Apunte'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-notes')}
            className="flex-1 btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
