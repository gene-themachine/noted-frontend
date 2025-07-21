import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  getNote as apiGetNote,
  createFolder as apiCreateFolder,
  deleteFolder as apiDeleteFolder,
  getStudyOptions,
  updateStudyOptions,
  UpdateStudyOptionsPayload,
  CreateNotePayload,
  CreateFolderPayload,
  getAvailableStudyOptions,
  addLibraryItemToNote as apiAddLibraryItemToNote,
  removeLibraryItemFromNote as apiRemoveLibraryItemFromNote,
} from '../api/note'
import { getProjectTree } from '../api/project'
import { Note } from '../types'

export const useProjectTree = (projectId: string) =>
  useQuery({
    queryKey: ['projectTree', projectId],
    queryFn: () => getProjectTree(projectId),
    enabled: !!projectId,
  })

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotePayload) => apiCreateNote(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFolderPayload) => apiCreateFolder(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};

export const useAddLibraryItemToNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { noteId: string; libraryItemId: string }) =>
      apiAddLibraryItemToNote(data.noteId, data.libraryItemId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['note', variables.noteId] });
    },
  });
};

export const useRemoveLibraryItemFromNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { noteId: string; libraryItemId: string }) =>
      apiRemoveLibraryItemFromNote(data.noteId, data.libraryItemId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['note', variables.noteId] });
    },
  });
};

export const useNote = (noteId: string) =>
  useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => (await apiGetNote(noteId)).data.note,
    enabled: !!noteId,
  })

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { noteId: string; payload: Partial<Note> }) =>
      apiUpdateNote(data.noteId, data.payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['note', variables.noteId] });
      queryClient.invalidateQueries({
        queryKey: ['project', data.data.note.projectId],
      });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      const note: any = queryClient.getQueryData(['note', noteId]);
      await apiDeleteNote(noteId);
      return note;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['project', data.projectId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['project'] });
      }
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderId: string) => apiDeleteFolder(folderId),
    onSuccess: (data, variables) => {
      // Since we don't know the project ID from the folder ID,
      // we have to invalidate all project queries.
      // A better solution would be for the API to return the project ID.
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
};

export const useStudyOptions = (noteId: string) =>
  useQuery({
    queryKey: ['studyOptions', noteId],
    queryFn: () => getStudyOptions(noteId),
    enabled: !!noteId,
    staleTime: 5 * 60 * 1000, // 5 minutes - study options don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
  })

export const useAvailableStudyOptions = () =>
  useQuery({
    queryKey: ['availableStudyOptions'],
    queryFn: getAvailableStudyOptions,
    staleTime: Infinity, // This data never changes
    gcTime: Infinity, // Keep in cache forever
  })

export const useUpdateStudyOptions = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string
      payload: UpdateStudyOptionsPayload
    }) => updateStudyOptions(noteId, payload),
    // Optimistic update for instant UI feedback
    onMutate: async ({ noteId, payload }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['studyOptions', noteId] })
      
      // Snapshot previous value
      const previousStudyOptions = queryClient.getQueryData(['studyOptions', noteId])
      
      // Optimistically update cache
      queryClient.setQueryData(['studyOptions', noteId], (old: any) => ({
        ...old,
        ...payload,
      }))
      
      // Return context with previous and new values
      return { previousStudyOptions, noteId }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousStudyOptions) {
        queryClient.setQueryData(['studyOptions', context.noteId], context.previousStudyOptions)
      }
      // You could add toast notification here if needed
      console.error('Failed to update study options:', err)
    },
    onSuccess: (data, variables) => {
      // Update cache with server response
      queryClient.setQueryData(['studyOptions', variables.noteId], data)
    },
  })
}
