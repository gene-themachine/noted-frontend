import { api } from './apiUtils'
import { Flashcard, CreateFlashcardsPayload } from '../types'
import { CreateStudySetRequest } from '../types/studySets'

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

// Project-level flashcard sets
export const getProjectFlashcardSets = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/study-sets/flashcards`)
  return response.data
}

export const getFlashcardSet = async (setId: string) => {
  const response = await api.get(`/study-sets/flashcards/${setId}`)
  return response.data
}

export const createProjectFlashcardSet = async (projectId: string, payload: Omit<CreateStudySetRequest, 'projectId'>) => {
  const response = await api.post(`/projects/${projectId}/study-sets/flashcards`, payload)
  return response.data
}

export const deleteFlashcardSet = async (setId: string) => {
  const response = await api.delete(`/study-sets/flashcards/${setId}`)
  return response.data
}

// Starred flashcards functionality
export const getProjectStarredFlashcards = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/starred-flashcards`)
  return response.data
}

export const starFlashcard = async (projectId: string, flashcardId: string) => {
  const response = await api.post(`/projects/${projectId}/flashcards/${flashcardId}/star`)
  return response.data
}

export const unstarFlashcard = async (projectId: string, flashcardId: string) => {
  const response = await api.delete(`/projects/${projectId}/flashcards/${flashcardId}/star`)
  return response.data
} 