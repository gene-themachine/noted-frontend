import { api, handleResponse, handleError } from './apiUtils';

export interface Todo {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoPayload {
  title: string;
  dueDate?: string;
}

export interface UpdateTodoPayload {
  title?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
}

export interface TodoResponse {
  success: boolean;
  data: Todo;
  message?: string;
}

export interface TodosResponse {
  success: boolean;
  data: Todo[];
}

/**
 * Get all todos for the authenticated user
 */
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await api.get('/todos');
    const data = handleResponse(response);
    return data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Create a new todo
 */
export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  try {
    const response = await api.post('/todos', payload);
    const data = handleResponse(response);
    return data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Get a specific todo by ID
 */
export const getTodo = async (todoId: string): Promise<Todo> => {
  try {
    const response = await api.get(`/todos/${todoId}`);
    const data = handleResponse(response);
    return data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Update a todo
 */
export const updateTodo = async (todoId: string, payload: UpdateTodoPayload): Promise<Todo> => {
  try {
    const response = await api.put(`/todos/${todoId}`, payload);
    const data = handleResponse(response);
    return data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Delete a todo
 */
export const deleteTodo = async (todoId: string): Promise<void> => {
  try {
    const response = await api.delete(`/todos/${todoId}`);
    handleResponse(response);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

/**
 * Toggle todo completion status
 */
export const toggleTodo = async (todoId: string): Promise<Todo> => {
  try {
    const response = await api.patch(`/todos/${todoId}/toggle`);
    const data = handleResponse(response);
    return data.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};