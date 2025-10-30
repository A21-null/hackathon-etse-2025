import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getCommentsByNote, createComment } from '../../api/comments';
import CommentItem from './CommentItem';

export default function CommentSection({ noteId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [noteId]);

  const fetchComments = async () => {
    try {
      setFetchLoading(true);
      const response = await getCommentsByNote(noteId);
      setComments(response.data.comments || []);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error fetching comments:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await createComment({
        noteId,
        content: newComment.trim()
      });

      // Refresh comments
      await fetchComments();
      setNewComment('');
    } catch (err) {
      alert('Error al crear comentario: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId, content) => {
    await createComment({
      noteId,
      content: content.trim(),
      parentId
    });

    // Refresh comments
    await fetchComments();
  };

  const handleDelete = async (commentId) => {
    // Refresh comments after delete
    await fetchComments();
  };

  const handleUpdate = (commentId, newContent) => {
    // Update local state optimistically
    const updateCommentInList = (comments) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, content: newContent };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentInList(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(updateCommentInList(comments));
  };

  if (fetchLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error && error.includes('only available for public notes')) {
    return (
      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
        <p className="text-yellow-800 text-sm">
          Los comentarios solo están disponibles para apuntes públicos.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Comentarios ({comments.length})
        </h3>
      </div>

      {/* New comment form */}
      {user ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            rows={3}
            maxLength={2000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {newComment.length}/2000 caracteres
            </span>
            <button
              onClick={handleCreateComment}
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Comentar
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            <a href="/auth" className="text-sky-600 hover:underline font-medium">
              Inicia sesión
            </a>{' '}
            para comentar
          </p>
        </div>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        </div>
      ) : (
        <div className="space-y-4 divide-y divide-gray-200">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
