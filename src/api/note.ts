import axios from 'axios';
import { SERVER_URL } from '../utils/constants';
import { getBearerToken } from '../utils/localStorage';
import { Note, CreateNotePayload, CreateFolderPayload, UpdateNotePayload, UpdateStudyOptionsPayload } from '../types';
import { api } from './apiUtils'

const noteApi = axios.create({
  baseURL: `${SERVER_URL}`,
});

noteApi.interceptors.request.use(
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

export const createNote = (payload: CreateNotePayload) =>
  noteApi.post('/notes', payload);

export const createFolder = (payload: CreateFolderPayload) =>
  noteApi.post('/folders', payload);

export const getNote = (noteId: string) => noteApi.get(`/notes/${noteId}`);

export const updateNote = (noteId: string, payload: UpdateNotePayload) =>
  noteApi.put(`/notes/${noteId}`, payload);

export const deleteNote = (noteId: string) => noteApi.delete(`/notes/${noteId}`);

export const deleteFolder = (folderId: string) =>
  noteApi.delete(`/folders/${folderId}`);

export const getStudyOptions = async (noteId: string) => {
  const response = await api.get(`/notes/${noteId}/study-options`)
  return response.data
}

export const getAvailableStudyOptions = async () => {
  const response = await api.get('/study-options')
  return response.data
}

export const updateStudyOptions = async (
  noteId: string,
  payload: UpdateStudyOptionsPayload
) => {
  const response = await api.put(`/notes/${noteId}/study-options`, payload)
  return response.data
}

export const addLibraryItemToNote = async (noteId: string, libraryItemId: string) => {
  const response = await api.post(`/notes/${noteId}/library-items/${libraryItemId}`)
  return response.data
}

export const removeLibraryItemFromNote = async (noteId: string, libraryItemId: string) => {
  const response = await api.delete(`/notes/${noteId}/library-items/${libraryItemId}`)
  return response.data
}

export const moveNode = async (
  projectId: string,
  nodeId: string,
  newParentId: string,
  newIndex: number
) => {
  const response = await noteApi.put(`/projects/${projectId}/tree/move`, {
    nodeId,
    newParentId,
    newIndex,
  })
  return response.data
}

export const reorderNodes = async (projectId: string, parentId: string, childIds: string[]) => {
  const response = await noteApi.put(`/projects/${projectId}/tree/reorder`, {
    parentId,
    childIds,
  })
  return response.data
}
