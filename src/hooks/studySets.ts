import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { FlashcardSet, MultipleChoiceSet, CreateStudySetRequest } from '../types/studySets'
import { 
  getProjectFlashcardSets, 
  getFlashcardSet, 
  createProjectFlashcardSet,
  deleteFlashcardSet,
  getProjectStarredFlashcards,
  starFlashcard,
  unstarFlashcard
} from '../api/flashcard'
import { 
  getProjectMultipleChoiceSets, 
  getProjectMultipleChoiceSet, 
  createProjectMultipleChoiceSet,
  deleteProjectMultipleChoiceSet 
} from '../api/multipleChoice'
import { getProjectNotesSummary } from '../api/project'

// Get all flashcard sets for a project
export const useProjectFlashcardSets = (projectId: string | null) => {
  return useQuery({
    queryKey: ['flashcard-sets', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectFlashcardSets(projectId!)
      const data = response.data || response || []
      
      // Ensure consistent data structure for each set
      return data.map((set: any) => {
        // Add type property if missing
        if (!set.type) {
          set.type = 'flashcard'
        }
        return set
      })
    },
    enabled: !!projectId,
  })
}

// Get all multiple choice sets for a project
export const useProjectMultipleChoiceSets = (projectId: string | null) => {
  return useQuery({
    queryKey: ['multiple-choice-sets', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectMultipleChoiceSets(projectId!)
      const data = response.data || response || []
      
      // Ensure consistent data structure for each set
      return data.map((set: any) => {
        // Add type property if missing
        if (!set.type) {
          set.type = 'multiple_choice'
        }
        // Ensure questions property exists
        if (set.multipleChoiceQuestions && !set.questions) {
          set.questions = set.multipleChoiceQuestions
        }
        return set
      })
    },
    enabled: !!projectId,
  })
}

// Get a specific flashcard set by ID
export const useFlashcardSet = (setId: string | null) => {
  return useQuery({
    queryKey: ['flashcard-set', setId],
    queryFn: async () => {
      const response = await getFlashcardSet(setId!)
      const data = response.data || response
      
      // Ensure consistent data structure
      if (data && !data.type) {
        data.type = 'flashcard'
      }
      
      return data
    },
    enabled: !!setId,
  })
}

// Get a specific multiple choice set by ID
export const useMultipleChoiceSet = (setId: string | null) => {
  return useQuery({
    queryKey: ['multiple-choice-set', setId],
    queryFn: async () => {
      const response = await getProjectMultipleChoiceSet(setId!)
      const data = response.data || response
      
      // Ensure consistent data structure
      if (data) {
        if (!data.type) {
          data.type = 'multiple_choice'
        }
        // Ensure questions property exists
        if (data.multipleChoiceQuestions && !data.questions) {
          data.questions = data.multipleChoiceQuestions
        }
      }
      
      return data
    },
    enabled: !!setId,
  })
}

// Create a new flashcard set
export const useCreateFlashcardSet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStudySetRequest & { type: 'flashcard' }) => {
      const { projectId, ...payload } = data
      return createProjectFlashcardSet(projectId, payload)
    },
    onSuccess: (data, variables) => {
      toast.success('Flashcard set created! Cards are being generated...')
      // Invalidate project flashcard sets to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['flashcard-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error creating flashcard set:', error)
      toast.error('Failed to create flashcard set')
    },
  })
}

// Create a new multiple choice set
export const useCreateMultipleChoiceSet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStudySetRequest & { type: 'multiple_choice' }) => {
      const { projectId, ...payload } = data
      return createProjectMultipleChoiceSet(projectId, payload)
    },
    onSuccess: (data, variables) => {
      toast.success('Multiple choice set created! Questions are being generated...')
      // Invalidate project multiple choice sets to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['multiple-choice-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error creating multiple choice set:', error)
      toast.error('Failed to create multiple choice set')
    },
  })
}

// Delete a study set
export const useDeleteStudySet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ setId, type }: { setId: string; type: 'flashcard' | 'multiple_choice' }) => {
      if (type === 'flashcard') {
        return deleteFlashcardSet(setId)
      } else {
        return deleteProjectMultipleChoiceSet(setId)
      }
    },
    onSuccess: (data, variables) => {
      toast.success('Study set deleted successfully')
      // Invalidate both types of queries since we don't know which project this belongs to
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets'] })
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-sets'] })
    },
    onError: (error: any) => {
      console.error('Error deleting study set:', error)
      toast.error('Failed to delete study set')
    },
  })
}

// Get project notes summary for content selection (lightweight - no content field)
export const useProjectNotes = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project-notes-summary', projectId],
    queryFn: async () => {
      const response = await getProjectNotesSummary(projectId!)
      return response.data.data?.notes || response.data.notes || []
    },
    enabled: !!projectId,
  })
}

// Get starred flashcards for a project
export const useProjectStarredFlashcards = (projectId: string | null) => {
  return useQuery({
    queryKey: ['starred-flashcards', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectStarredFlashcards(projectId!)
      return response.data || response || []
    },
    enabled: !!projectId,
  })
}

// Star a flashcard
export const useStarFlashcard = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, flashcardId }: { projectId: string; flashcardId: string }) => {
      return starFlashcard(projectId, flashcardId)
    },
    onSuccess: (data, variables) => {
      // Invalidate starred flashcards to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-flashcards', 'project', variables.projectId] 
      })
      // Also invalidate flashcard sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['flashcard-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error starring flashcard:', error)
      toast.error('Failed to star flashcard')
    },
  })
}

// Unstar a flashcard
export const useUnstarFlashcard = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, flashcardId }: { projectId: string; flashcardId: string }) => {
      return unstarFlashcard(projectId, flashcardId)
    },
    onSuccess: (data, variables) => {
      // Invalidate starred flashcards to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-flashcards', 'project', variables.projectId] 
      })
      // Also invalidate flashcard sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['flashcard-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error unstarring flashcard:', error)
      toast.error('Failed to unstar flashcard')
    },
  })
}

