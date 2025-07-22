import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStudyOptions } from './note' // Import useStudyOptions
import {
  createFlashcards,
  getFlashcardsByNote,
  markFlashcardsAsNeedingUpdate,
  addLibraryItemToFlashcard,
  removeLibraryItemFromFlashcard,
  CreateFlashcardsPayload,
} from '../api/flashcard'
import { useState, useEffect, useRef, useCallback } from 'react'
import { getBearerToken } from '../utils/localStorage'
import { SERVER_URL } from '../utils/constants'

export const useCreateFlashcards = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFlashcards,
    onSuccess: (data) => {
      console.log('✅ Flashcard creation queued:', data)
      // Don't invalidate queries here - let SSE handle the updates
    },
    onError: (error: any) => {
      console.error('❌ Flashcard creation failed:', error)
      const message = error.response?.data?.message || 'Failed to start flashcard generation'
      console.error('Error message:', message)
      
      // Invalidate queries on error to refresh UI state
      queryClient.invalidateQueries({ queryKey: ['study-options'] })
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) => markFlashcardsAsNeedingUpdate(noteId),
    onSuccess: (data, noteId) => {
      queryClient.invalidateQueries({ queryKey: ['flashcards', 'note', noteId] })
    },
  })
}

export const useAddLibraryItemToFlashcard = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ flashcardId, libraryItemId }: { flashcardId: string; libraryItemId: string }) =>
      addLibraryItemToFlashcard(flashcardId, libraryItemId),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}

// Real-time SSE hook for flashcard status
interface FlashcardStatusData {
  noteId: string
  status: string | null
  hasFlashcards: boolean
  flashcardCount: number
  message: string
  timestamp: string
}

interface UseFlashcardStatusStreamOptions {
  onStatusChange?: (status: FlashcardStatusData) => void
  onComplete?: (data: FlashcardStatusData) => void
  onFailed?: (data: FlashcardStatusData) => void
  onError?: (error: Error) => void
}

export const useFlashcardStatusStream = (
  noteId: string | null,
  options: UseFlashcardStatusStreamOptions = {}
) => {
  const [statusData, setStatusData] = useState<FlashcardStatusData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const queryClient = useQueryClient()

  // Get the initial study options to check the status
  const { data: studyOptions } = useStudyOptions(noteId!)
  const flashcardStatus = studyOptions?.flashcard

  const { onStatusChange, onComplete, onFailed, onError } = options

  const connect = useCallback(() => {
    // Only connect if the status is 'queued'
    if (!noteId || eventSourceRef.current || flashcardStatus !== 'queued') {
      return
    }

    try {
      const token = getBearerToken()
      if (!token) {
        throw new Error('No authentication token available')
      }

      // Create EventSource with auth header (using URL params since EventSource doesn't support custom headers)
      const url = `${SERVER_URL}/notes/${noteId}/flashcards/events?token=${encodeURIComponent(token)}`
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log('🔄 SSE connection opened for note:', noteId)
        setIsConnected(true)
        setError(null)
      }

      eventSource.onmessage = (event) => {
        try {
          const data: FlashcardStatusData = JSON.parse(event.data)
          console.log('📡 Received flashcard status update:', data)
          
          setStatusData(data)
          onStatusChange?.(data)

          // Handle status changes
          if (data.status === 'completed') {
            console.log('✅ Flashcard generation completed!')
            console.log('🎉 Flashcards are ready for study!')
            onComplete?.(data)
            
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['flashcards', 'note', noteId] })
            queryClient.invalidateQueries({ queryKey: ['study-options'] })
            
            // Close the connection since we're done
            disconnect()
          } else if (data.status === 'failed') {
            console.log('❌ Flashcard generation failed')
            console.error('💥 Flashcard generation failed. Please try again.')
            onFailed?.(data)
            
            // Invalidate queries to refresh UI state
            queryClient.invalidateQueries({ queryKey: ['study-options'] })
            
            // Close the connection
            disconnect()
          } else if (data.status === 'queued') {
            console.log('⏳ Flashcard generation in progress...')
            // Update query cache with current status
            queryClient.invalidateQueries({ queryKey: ['study-options'] })
          }
        } catch (parseError) {
          console.error('Failed to parse SSE message:', parseError)
          setError(new Error('Failed to parse status update'))
        }
      }

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event)
        const errorObj = new Error('SSE connection failed')
        setError(errorObj)
        setIsConnected(false)
        onError?.(errorObj)
        
        // Stop retrying on auth errors
        if (event.target instanceof EventSource && event.target.readyState === EventSource.CLOSED) {
            console.error('SSE connection closed by server. Halting retries.')
            disconnect()
            return
        }

        // Auto-reconnect after a delay (unless manually disconnected)
        if (eventSourceRef.current === eventSource) {
          setTimeout(() => {
            if (eventSourceRef.current === eventSource) {
              disconnect()
              connect()
            }
          }, 5000)
        }
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create SSE connection')
      console.error('Failed to create SSE connection:', error)
      setError(error)
      onError?.(error)
    }
  }, [noteId, flashcardStatus, onStatusChange, onComplete, onFailed, onError, queryClient])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('🔌 Closing SSE connection for note:', noteId)
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
    }
  }, [noteId])

  // Effect to manage connection based on status
  useEffect(() => {
    if (flashcardStatus === 'queued' && !isConnected) {
      connect()
    } else if (flashcardStatus !== 'queued' && isConnected) {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [flashcardStatus, isConnected, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    statusData,
    isConnected,
    error,
    connect,
    disconnect,
    retry: () => {
      disconnect()
      setTimeout(connect, 1000)
    }
  }
} 