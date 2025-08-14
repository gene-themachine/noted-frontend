import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { FlashcardSet, MultipleChoiceSet, FreeResponseSet, CreateStudySetRequest, FreeResponseEvaluation, EvaluateResponseRequest } from '../types/studySets'
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
  deleteProjectMultipleChoiceSet,
  getProjectStarredMultipleChoiceQuestions,
  starMultipleChoiceQuestion,
  unstarMultipleChoiceQuestion
} from '../api/multipleChoice'
import {
  getProjectFreeResponseSets,
  getProjectFreeResponseSet,
  createProjectFreeResponseSet,
  deleteProjectFreeResponseSet,
  evaluateFreeResponse,
  getFreeResponseEvaluationHistory,
  getProjectStarredFreeResponseQuestions,
  starFreeResponseQuestion,
  unstarFreeResponseQuestion
} from '../api/freeResponse'
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

// Get all free response sets for a project
export const useProjectFreeResponseSets = (projectId: string | null) => {
  return useQuery({
    queryKey: ['free-response-sets', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectFreeResponseSets(projectId!)
      const data = response.data || response || []
      
      // Ensure consistent data structure for each set
      return data.map((set: any) => {
        // Add type property if missing
        if (!set.type) {
          set.type = 'free_response'
        }
        // Ensure questions property exists
        if (set.freeResponses && !set.questions) {
          set.questions = set.freeResponses
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

// Get a specific free response set by ID
export const useFreeResponseSet = (setId: string | null) => {
  return useQuery({
    queryKey: ['free-response-set', setId],
    queryFn: async () => {
      const response = await getProjectFreeResponseSet(setId!)
      const data = response.data || response
      
      // Ensure consistent data structure
      if (data) {
        if (!data.type) {
          data.type = 'free_response'
        }
        // Ensure questions property exists
        if (data.freeResponses && !data.questions) {
          data.questions = data.freeResponses
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

// Create a new free response set
export const useCreateFreeResponseSet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStudySetRequest & { type: 'free_response' }) => {
      const { projectId, ...payload } = data
      return createProjectFreeResponseSet(projectId, payload)
    },
    onSuccess: (data, variables) => {
      toast.success('Free response set created! Questions are being generated...')
      // Invalidate project free response sets to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['free-response-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error creating free response set:', error)
      toast.error('Failed to create free response set')
    },
  })
}

// Delete a study set
export const useDeleteStudySet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ setId, type }: { setId: string; type: 'flashcard' | 'multiple_choice' | 'free_response' }) => {
      if (type === 'flashcard') {
        return deleteFlashcardSet(setId)
      } else if (type === 'multiple_choice') {
        return deleteProjectMultipleChoiceSet(setId)
      } else {
        return deleteProjectFreeResponseSet(setId)
      }
    },
    onSuccess: (data, variables) => {
      toast.success('Study set deleted successfully')
      // Invalidate all types of queries since we don't know which project this belongs to
      queryClient.invalidateQueries({ queryKey: ['flashcard-sets'] })
      queryClient.invalidateQueries({ queryKey: ['multiple-choice-sets'] })
      queryClient.invalidateQueries({ queryKey: ['free-response-sets'] })
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

// Get starred multiple choice questions for a project
export const useProjectStarredMultipleChoiceQuestions = (projectId: string | null) => {
  return useQuery({
    queryKey: ['starred-multiple-choice-questions', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectStarredMultipleChoiceQuestions(projectId!)
      return response.data || response || []
    },
    enabled: !!projectId,
  })
}

// Star a multiple choice question
export const useStarMultipleChoiceQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, questionId }: { projectId: string; questionId: string }) => {
      return starMultipleChoiceQuestion(projectId, questionId)
    },
    onSuccess: (_, variables) => {
      // Invalidate starred multiple choice questions to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-multiple-choice-questions', 'project', variables.projectId] 
      })
      // Also invalidate multiple choice sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['multiple-choice-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error starring multiple choice question:', error)
      toast.error('Failed to star multiple choice question')
    },
  })
}

// Unstar a multiple choice question
export const useUnstarMultipleChoiceQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, questionId }: { projectId: string; questionId: string }) => {
      return unstarMultipleChoiceQuestion(projectId, questionId)
    },
    onSuccess: (_, variables) => {
      // Invalidate starred multiple choice questions to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-multiple-choice-questions', 'project', variables.projectId] 
      })
      // Also invalidate multiple choice sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['multiple-choice-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error unstarring multiple choice question:', error)
      toast.error('Failed to unstar multiple choice question')
    },
  })
}

// Evaluate a free response answer
export const useEvaluateFreeResponse = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ questionId, payload }: { questionId: string; payload: EvaluateResponseRequest }) => {
      return evaluateFreeResponse(questionId, payload)
    },
    onSuccess: (data, variables) => {
      // Invalidate evaluation history for this question
      queryClient.invalidateQueries({ 
        queryKey: ['free-response-evaluations', variables.questionId] 
      })
      
      // Show feedback to user
      if (data.isCorrect) {
        toast.success(`Correct! Score: ${data.score}/100`)
      } else {
        toast.success(`Score: ${data.score}/100. Check feedback for improvements.`)
      }
    },
    onError: (error: any) => {
      console.error('Error evaluating free response:', error)
      toast.error('Failed to evaluate response')
    },
  })
}

// Get evaluation history for a free response question
export const useFreeResponseEvaluationHistory = (questionId: string | null) => {
  return useQuery({
    queryKey: ['free-response-evaluations', questionId],
    queryFn: async () => {
      const response = await getFreeResponseEvaluationHistory(questionId!)
      return response
    },
    enabled: !!questionId,
  })
}

// Get starred free response questions for a project
export const useProjectStarredFreeResponseQuestions = (projectId: string | null) => {
  return useQuery({
    queryKey: ['starred-free-response-questions', 'project', projectId],
    queryFn: async () => {
      const response = await getProjectStarredFreeResponseQuestions(projectId!)
      return response.data || response || []
    },
    enabled: !!projectId,
  })
}

// Star a free response question
export const useStarFreeResponseQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, questionId }: { projectId: string; questionId: string }) => {
      return starFreeResponseQuestion(projectId, questionId)
    },
    onSuccess: (_, variables) => {
      // Invalidate starred free response questions to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-free-response-questions', 'project', variables.projectId] 
      })
      // Also invalidate free response sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['free-response-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error starring free response question:', error)
      toast.error('Failed to star free response question')
    },
  })
}

// Unstar a free response question
export const useUnstarFreeResponseQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, questionId }: { projectId: string; questionId: string }) => {
      return unstarFreeResponseQuestion(projectId, questionId)
    },
    onSuccess: (_, variables) => {
      // Invalidate starred free response questions to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['starred-free-response-questions', 'project', variables.projectId] 
      })
      // Also invalidate free response sets to update star status
      queryClient.invalidateQueries({ 
        queryKey: ['free-response-sets', 'project', variables.projectId] 
      })
    },
    onError: (error: any) => {
      console.error('Error unstarring free response question:', error)
      toast.error('Failed to unstar free response question')
    },
  })
}

