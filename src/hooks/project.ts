// src/hooks/projects.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, getProjectById, getAllProjects } from '../api/project';
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
      createProject(body.name, body.description || '').then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
