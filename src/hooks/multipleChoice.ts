import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMultipleChoiceSet,
  getMultipleChoiceSetsByNote,
  getMultipleChoiceSet,
  updateMultipleChoiceSet,
  deleteMultipleChoiceSet,
  regenerateMultipleChoiceSet,
  CreateMultipleChoiceSetPayload,
  UpdateMultipleChoiceSetPayload,
  MultipleChoiceSet,
} from '../api/multipleChoice';
import { toast } from 'react-hot-toast';

// Hook to get multiple choice sets for a note
export const useMultipleChoiceSetsByNote = (noteId: string) => {
  return useQuery({
    queryKey: ['multipleChoiceSets', noteId],
    queryFn: () => getMultipleChoiceSetsByNote(noteId),
    enabled: !!noteId,
  });
};

// Hook to get a specific multiple choice set
export const useMultipleChoiceSet = (setId: string) => {
  return useQuery({
    queryKey: ['multipleChoiceSet', setId],
    queryFn: () => {
      console.log('🔍 Hook: Fetching multiple choice set for ID:', setId);
      return getMultipleChoiceSet(setId);
    },
    enabled: !!setId,
    select: (data) => {
      console.log('🔍 Hook: Data received from API:', data);
      return data;
    },
  });
};

// Hook to create a multiple choice set
export const useCreateMultipleChoiceSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMultipleChoiceSetPayload) => createMultipleChoiceSet(payload),
    onSuccess: (data, variables) => {
      // Invalidate and refetch multiple choice sets for the note
      queryClient.invalidateQueries({ queryKey: ['multipleChoiceSets', variables.noteId] });
      // Invalidate study options to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['studyOptions', variables.noteId] });
      toast.success('Multiple choice set created! Questions are being generated...');
    },
    onError: (error: any) => {
      console.error('Error creating multiple choice set:', error);
      toast.error('Failed to create multiple choice set');
    },
  });
};

// Hook to update a multiple choice set
export const useUpdateMultipleChoiceSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setId, payload }: { setId: string; payload: UpdateMultipleChoiceSetPayload }) =>
      updateMultipleChoiceSet(setId, payload),
    onSuccess: (data) => {
      // Invalidate specific set
      queryClient.invalidateQueries({ queryKey: ['multipleChoiceSet', data.id] });
      // Invalidate sets for the note
      if (data.noteId) {
        queryClient.invalidateQueries({ queryKey: ['multipleChoiceSets', data.noteId] });
      }
      toast.success('Multiple choice set updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating multiple choice set:', error);
      toast.error('Failed to update multiple choice set');
    },
  });
};

// Hook to delete a multiple choice set
export const useDeleteMultipleChoiceSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setId: string) => deleteMultipleChoiceSet(setId),
    onSuccess: (_, setId) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['multipleChoiceSet', setId] });
      queryClient.invalidateQueries({ queryKey: ['multipleChoiceSets'] });
      toast.success('Multiple choice set deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting multiple choice set:', error);
      toast.error('Failed to delete multiple choice set');
    },
  });
};

// Hook to regenerate a multiple choice set
export const useRegenerateMultipleChoiceSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setId: string) => regenerateMultipleChoiceSet(setId),
    onSuccess: (data) => {
      // Invalidate specific set
      queryClient.invalidateQueries({ queryKey: ['multipleChoiceSet', data.id] });
      // Invalidate sets for the note
      if (data.noteId) {
        queryClient.invalidateQueries({ queryKey: ['multipleChoiceSets', data.noteId] });
      }
      // Invalidate study options to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['studyOptions', data.noteId] });
      toast.success('Multiple choice set regeneration started!');
    },
    onError: (error: any) => {
      console.error('Error regenerating multiple choice set:', error);
      toast.error('Failed to regenerate multiple choice set');
    },
  });
};