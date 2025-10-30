import { useState, useCallback } from 'react'
import { notesAPI } from '../api/notes'

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllNotes = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await notesAPI.getAllNotes(params)
      // Extract notes array from nested response structure
      const notesData = response.data?.notes || response.notes || response.data || response
      setNotes(Array.isArray(notesData) ? notesData : [])
      return response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to fetch notes'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchNoteById = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await notesAPI.getNoteById(id)
      return response.data || response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to fetch note'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserNotes = useCallback(async (userId, params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await notesAPI.getNotesByUserId(userId, params)
      // Extract notes array from nested response structure
      const notesData = response.data?.notes || response.notes || response.data || response
      setNotes(Array.isArray(notesData) ? notesData : [])
      return response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to fetch user notes'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createNote = useCallback(async (noteData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await notesAPI.createNote(noteData)
      return response.data || response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to create note'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateNote = useCallback(async (id, noteData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await notesAPI.updateNote(id, noteData)
      return response.data || response
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to update note'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteNote = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)
      await notesAPI.deleteNote(id)
      setNotes(notes.filter(note => note.id !== id))
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to delete note'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [notes])

  return {
    notes,
    loading,
    error,
    fetchAllNotes,
    fetchNoteById,
    fetchUserNotes,
    createNote,
    updateNote,
    deleteNote,
  }
}
