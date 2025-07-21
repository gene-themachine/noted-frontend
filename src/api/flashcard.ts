import { api } from './apiUtils'
import { Flashcard } from '../types'

export interface CreateFlashcardsPayload {
  noteId: string
  selectedLibraryItems?: string[]
  includeNoteContent: boolean
}

export const createFlashcards = async (payload: CreateFlashcardsPayload) => {
  const response = await api.post('/flashcards/create', payload)
  return response.data
}

export const getFlashcardsByNote = async (noteId: string) => {
  const response = await api.get(`/notes/${noteId}/flashcards`)
  return response.data
}

export const markFlashcardsAsNeedingUpdate = async (noteId: string) => {
  const response = await api.put(`/notes/${noteId}/flashcards/mark-needs-update`)
  return response.data
}

export const addLibraryItemToFlashcard = async (flashcardId: string, libraryItemId: string) => {
  const response = await api.post(`/flashcards/${flashcardId}/library-items/${libraryItemId}`)
  return response.data
}

export const removeLibraryItemFromFlashcard = async (flashcardId: string, libraryItemId: string) => {
  const response = await api.delete(`/flashcards/${flashcardId}/library-items/${libraryItemId}`)
  return response.data
} 