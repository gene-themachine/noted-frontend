// src/hooks/projects.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject,
} from '../api/project';
import { Project } from '../types';

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await getAllProjects()).data.projects,
  });

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => (await getProjectById(projectId)).data.project,
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
      createProject(body.name, body.description || '', body.color || undefined).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; color?: string };
    }) => updateProject(id, data).then((r) => r.data),

    onSuccess: (_, variables) => {
      // Invalidate both the projects list and the specific project
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id).then((r) => r.data),

    onSuccess: () => {
      // Invalidate projects list to remove deleted project
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
