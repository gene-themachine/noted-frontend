import { api } from './apiUtils';
import { MultipleChoiceQuestion, MultipleChoiceSet, CreateMultipleChoiceSetPayload, UpdateMultipleChoiceSetPayload } from '../types';
import { CreateStudySetRequest } from '../types/studySets';

// Create a new multiple choice set
export const createMultipleChoiceSet = async (payload: CreateMultipleChoiceSetPayload): Promise<MultipleChoiceSet> => {
  const response = await api.post('/multiple-choice/sets', payload);
  return response.data;
};

// Get multiple choice sets for a note
export const getMultipleChoiceSetsByNote = async (noteId: string): Promise<MultipleChoiceSet[]> => {
  const response = await api.get(`/notes/${noteId}/multiple-choice/sets`);
  return response.data.data || response.data || []; // Handle multiple response formats
};

// Get a specific multiple choice set
export const getMultipleChoiceSet = async (setId: string): Promise<MultipleChoiceSet> => {
  console.log('🔍 API: Fetching multiple choice set:', setId);
  const response = await api.get(`/multiple-choice/sets/${setId}`);
  console.log('🔍 API: Multiple choice set response:', response.data);
  
  // Ensure consistent data structure
  const data = response.data;
  if (data && data.multipleChoiceQuestions && !data.questions) {
    data.questions = data.multipleChoiceQuestions;
  }
  
  return data;
};

// Update a multiple choice set
export const updateMultipleChoiceSet = async (setId: string, payload: UpdateMultipleChoiceSetPayload): Promise<MultipleChoiceSet> => {
  const response = await api.put(`/multiple-choice/sets/${setId}`, payload);
  return response.data;
};

// Delete a multiple choice set
export const deleteMultipleChoiceSet = async (setId: string): Promise<void> => {
  await api.delete(`/multiple-choice/sets/${setId}`);
};

// Regenerate a multiple choice set
export const regenerateMultipleChoiceSet = async (setId: string): Promise<MultipleChoiceSet> => {
  const response = await api.post(`/multiple-choice/sets/${setId}/regenerate`);
  return response.data;
};

// Project-level multiple choice sets
export const getProjectMultipleChoiceSets = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/study-sets/multiple-choice`)
  const data = response.data.data || response.data || []
  
  // Ensure consistent data structure for each set
  return data.map((set: any) => {
    if (set.multipleChoiceQuestions && !set.questions) {
      set.questions = set.multipleChoiceQuestions
    }
    return set
  })
}

export const getProjectMultipleChoiceSet = async (setId: string) => {
  const response = await api.get(`/study-sets/multiple-choice/${setId}`)
  const data = response.data
  
  // Ensure consistent data structure
  if (data && data.multipleChoiceQuestions && !data.questions) {
    data.questions = data.multipleChoiceQuestions
  }
  
  return data
}

export const createProjectMultipleChoiceSet = async (projectId: string, payload: Omit<CreateStudySetRequest, 'projectId'>) => {
  const response = await api.post(`/projects/${projectId}/study-sets/multiple-choice`, payload)
  return response.data
}

export const deleteProjectMultipleChoiceSet = async (setId: string) => {
  const response = await api.delete(`/study-sets/multiple-choice/${setId}`)
  return response.data
}