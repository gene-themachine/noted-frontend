import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createFlashcards,
  getFlashcardsByNote,
  markFlashcardsAsNeedingUpdate,
  addLibraryItemToFlashcard,
  removeLibraryItemFromFlashcard,
  CreateFlashcardsPayload,
} from '../api/flashcard'


export const useCreateFlashcards = () => {
  return useMutation({
    mutationFn: createFlashcards,
    onSuccess: (data) => {
      console.log('✅ Flashcard creation queued:', data)
      // SSE handles all cache updates automatically
    },
    onError: (error: any) => {
      console.error('❌ Flashcard creation failed:', error)
      const message = error.response?.data?.message || 'Failed to start flashcard generation'
      console.error('Error message:', message)
      // SSE handles error state updates automatically
    },
  })
}

export const useFlashcardsByNote = (noteId: string) => {
  return useQuery({
    queryKey: ['flashcards', 'note', noteId],
    queryFn: () => getFlashcardsByNote(noteId),
    enabled: !!noteId,
  })
}

export const useMarkFlashcardsAsNeedingUpdate = () => {
  return useMutation({
    mutationFn: (noteId: string) => markFlashcardsAsNeedingUpdate(noteId),
    // SSE handles cache updates automatically
  })
}

export const useAddLibraryItemToFlashcard = () => {
  return useMutation({
    mutationFn: ({ flashcardId, libraryItemId }: { flashcardId: string; libraryItemId: string }) =>
      addLibraryItemToFlashcard(flashcardId, libraryItemId),
    // SSE handles cache updates automatically
  })
}

export const useRemoveLibraryItemFromFlashcard = () => {
  return useMutation({
    mutationFn: ({ flashcardId, libraryItemId }: { flashcardId: string; libraryItemId: string }) =>
      removeLibraryItemFromFlashcard(flashcardId, libraryItemId),
    // SSE handles cache updates automatically
  })
}

