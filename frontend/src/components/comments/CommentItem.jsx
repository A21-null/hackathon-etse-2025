import { useState } from 'react';
import { MessageCircle, Trash2, Edit2, Send, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { deleteComment as deleteCommentApi, updateComment as updateCommentApi } from '../../api/comments';

export default function CommentItem({ comment, onReply, onDelete, onUpdate, level = 0 }) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isAuthor = user && user.id === comment.authorId;
  const maxLevel = 3; // Maximum nesting level

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      alert('Error al crear respuesta: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      await updateCommentApi(comment.id, editContent);
      onUpdate(comment.id, editContent);
      setIsEditing(false);
    } catch (error) {
      alert('Error al actualizar comentario: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    setLoading(true);
    try {
      await deleteCommentApi(comment.id);
      onDelete(comment.id);
    } catch (error) {
      alert('Error al eliminar comentario: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="py-3">
        {/* Comment header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
              <span className="text-sky-600 font-semibold text-sm">
                {comment.author?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{comment.author?.name}</p>
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-sky-600 transition"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-gray-400 hover:text-red-600 transition"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Comment content */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              rows={3}
              maxLength={2000}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleUpdate}
                disabled={loading || !editContent.trim()}
                className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
        )}

        {/* Reply button */}
        {!isEditing && user && level < maxLevel && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            Responder
          </button>
        )}

        {/* Reply form */}
        {isReplying && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              rows={2}
              maxLength={2000}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReply}
                disabled={loading || !replyContent.trim()}
                className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                Enviar
              </button>
              <button
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
