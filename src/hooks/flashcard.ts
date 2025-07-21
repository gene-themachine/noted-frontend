import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFlashcards, getFlashcardsByNote, markFlashcardsAsNeedingUpdate, addLibraryItemToFlashcard, removeLibraryItemFromFlashcard, CreateFlashcardsPayload } from '../api/flashcard'

export const useCreateFlashcards = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFlashcardsPayload) => createFlashcards(payload),
    onSuccess: (data, variables) => {
      // Invalidate flashcards for this note
      queryClient.invalidateQueries({ queryKey: ['flashcards', variables.noteId] })
      // Also invalidate study options to reflect the change
      queryClient.invalidateQueries({ queryKey: ['studyOptions', variables.noteId] })
    },
  })
}

export const useFlashcardsByNote = (noteId: string) =>
  useQuery({
    queryKey: ['flashcards', noteId],
    queryFn: () => getFlashcardsByNote(noteId),
    enabled: !!noteId,
  })

export const useMarkFlashcardsAsNeedingUpdate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) => markFlashcardsAsNeedingUpdate(noteId),
    onSuccess: (data, noteId) => {
      // Invalidate flashcards to reflect the needsUpdate change
      queryClient.invalidateQueries({ queryKey: ['flashcards', noteId] })
    },
  })
}

export const useAddLibraryItemToFlashcard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flashcardId, libraryItemId }: { flashcardId: string; libraryItemId: string }) => 
      addLibraryItemToFlashcard(flashcardId, libraryItemId),
    onSuccess: () => {
      // Invalidate flashcards to refresh library items
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}

export const useRemoveLibraryItemFromFlashcard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flashcardId, libraryItemId }: { flashcardId: string; libraryItemId: string }) => 
      removeLibraryItemFromFlashcard(flashcardId, libraryItemId),
    onSuccess: () => {
      // Invalidate flashcards to refresh library items
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
} 