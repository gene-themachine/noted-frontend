import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjectLibraryItems as apiGetProjectLibraryItems,
  addLibraryItemToNote as apiAddLibraryItemToNote,
  removeLibraryItemFromNote as apiRemoveLibraryItemFromNote,
} from '../api/library';

export const useProjectLibraryItems = (projectId: string) =>
  useQuery({
    queryKey: ['projectLibrary', projectId],
    queryFn: () => apiGetProjectLibraryItems(projectId),
    enabled: !!projectId,
  });

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