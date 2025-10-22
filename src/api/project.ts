import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { getBearerToken } from '../utils/localStorage';

const projectApi = axios.create({ baseURL: SERVER_URL });

// Add request interceptor to automatically attach bearer token
projectApi.interceptors.request.use(
  (config) => {
    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getAllProjects = () => projectApi.get('/projects');

export const getProjectById = (id: string) => projectApi.get(`/projects/${id}`);

export const getProjectTree = (projectId: string) =>
  projectApi.get(`/projects/${projectId}/tree`);

export const createProject = (name: string, description: string, color?: string) =>
  projectApi.post('/projects', { name, description, color });

export const updateProject = (
  id: string,
  data: { name?: string; description?: string; color?: string }
) => projectApi.put(`/projects/${id}`, data);

export const deleteProject = (id: string) => projectApi.delete(`/projects/${id}`);

export const getProjectNotes = (projectId: string) =>
  projectApi.get(`/projects/${projectId}/notes`);

// Lightweight endpoint for note selection UI - returns only id, name, createdAt (no content)
export const getProjectNotesSummary = (projectId: string) =>
  projectApi.get(`/projects/${projectId}/notes/summary`);
