import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { uploadAPI } from '../../api/upload';

export default function FileUpload({ onFileUploaded, onFileRemoved, existingFile = null }) {
  const [file, setFile] = useState(existingFile);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (file.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF');
      return false;
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('El archivo es muy grande. Máximo 10MB');
      return false;
    }

    return true;
  };

  const handleFileUpload = async (selectedFile) => {
    if (!validateFile(selectedFile)) {
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const result = await uploadAPI.uploadFile(selectedFile);

      setFile(result.file);
      if (onFileUploaded) {
        onFileUploaded(result.file);
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Error al subir el archivo';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileRemove = async () => {
    if (!file) return;

    try {
      // Delete from server
      await uploadAPI.deleteFile(file.filename);

      setFile(null);
      setError(null);
      if (onFileRemoved) {
        onFileRemoved();
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (file) {
    return (
      <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="text-primary-600" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {file.originalName}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • PDF
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFileRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar archivo"
          >
            <X size={20} />
          </button>
        </div>

        {file.extractedTextPreview && (
          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Vista previa del contenido:</p>
            <p className="text-sm text-gray-700 line-clamp-3">
              {file.extractedTextPreview}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary-600 animate-spin" size={40} />
            <div>
              <p className="text-sm font-medium text-gray-900">Subiendo archivo...</p>
              <p className="text-xs text-gray-500">Por favor espera</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-full">
              <Upload className="text-primary-600" size={32} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {dragActive ? 'Suelta el archivo aquí' : 'Arrastra tu PDF aquí o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Solo archivos PDF • Máximo 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
