import { api } from './apiUtils';
import { FreeResponseQuestion, FreeResponseSet, CreateFreeResponseSetPayload, UpdateFreeResponseSetPayload } from '../types';
import { CreateStudySetRequest } from '../types/studySets';

// Create a new free response set
export const createFreeResponseSet = async (payload: CreateFreeResponseSetPayload): Promise<FreeResponseSet> => {
  const response = await api.post('/free-response/sets', payload);
  return response.data;
};

// Get free response sets for a note
export const getFreeResponseSetsByNote = async (noteId: string): Promise<FreeResponseSet[]> => {
  const response = await api.get(`/notes/${noteId}/free-response/sets`);
  return response.data.data || response.data || []; // Handle multiple response formats
};

// Get a specific free response set
export const getFreeResponseSet = async (setId: string): Promise<FreeResponseSet> => {
  console.log('🔍 API: Fetching free response set:', setId);
  const response = await api.get(`/free-response/sets/${setId}`);
  console.log('🔍 API: Free response set response:', response.data);
  
  // Ensure consistent data structure
  const data = response.data;
  if (data && data.freeResponses && !data.questions) {
    data.questions = data.freeResponses;
  }
  
  return data;
};

// Update a free response set
export const updateFreeResponseSet = async (setId: string, payload: UpdateFreeResponseSetPayload): Promise<FreeResponseSet> => {
  const response = await api.put(`/free-response/sets/${setId}`, payload);
  return response.data;
};

// Delete a free response set
export const deleteFreeResponseSet = async (setId: string): Promise<void> => {
  await api.delete(`/free-response/sets/${setId}`);
};

// Regenerate a free response set
export const regenerateFreeResponseSet = async (setId: string): Promise<FreeResponseSet> => {
  const response = await api.post(`/free-response/sets/${setId}/regenerate`);
  return response.data;
};

// Project-level free response sets
export const getProjectFreeResponseSets = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/study-sets/free-response`)
  const data = response.data.data || response.data || []
  
  // Ensure consistent data structure for each set
  return data.map((set: any) => {
    if (set.freeResponses && !set.questions) {
      set.questions = set.freeResponses
    }
    return set
  })
}

export const getProjectFreeResponseSet = async (setId: string) => {
  const response = await api.get(`/study-sets/free-response/${setId}`)
  const data = response.data
  
  // Ensure consistent data structure
  if (data && data.freeResponses && !data.questions) {
    data.questions = data.freeResponses
  }
  
  return data
}

export const createProjectFreeResponseSet = async (projectId: string, payload: Omit<CreateStudySetRequest, 'projectId'>) => {
  const response = await api.post(`/projects/${projectId}/study-sets/free-response`, payload)
  return response.data
}

export const deleteProjectFreeResponseSet = async (setId: string) => {
  const response = await api.delete(`/study-sets/free-response/${setId}`)
  return response.data
}