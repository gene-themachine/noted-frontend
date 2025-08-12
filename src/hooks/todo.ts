import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  CreateTodoPayload,
  UpdateTodoPayload,
  Todo,
} from '../api/todo';

/**
 * Hook to fetch all todos for the authenticated user
 */
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a specific todo by ID
 */
export const useTodo = (todoId: string) => {
  return useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => getTodo(todoId),
    enabled: !!todoId,
  });
};

/**
 * Hook to create a new todo
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      // Add the new todo to the todos list
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [newTodo];
        return [newTodo, ...oldTodos];
      });

      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error('❌ Error creating todo:', error);
    },
  });
};

/**
 * Hook to update a todo
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ todoId, payload }: { todoId: string; payload: UpdateTodoPayload }) =>
      updateTodo(todoId, payload),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo);

      // Update the todo in the todos list
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [updatedTodo];
        return oldTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
      });

      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error('❌ Error updating todo:', error);
    },
  });
};

/**
 * Hook to delete a todo
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, todoId) => {
      // Remove the todo from cache
      queryClient.removeQueries({ queryKey: ['todo', todoId] });

      // Remove the todo from the todos list
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [];
        return oldTodos.filter((todo) => todo.id !== todoId);
      });

      // Invalidate and refetch todos to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      console.error('❌ Error deleting todo:', error);
    },
  });
};

/**
 * Hook to toggle todo completion status
 */
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,
    onMutate: async (todoId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      await queryClient.cancelQueries({ queryKey: ['todo', todoId] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);
      const previousTodo = queryClient.getQueryData(['todo', todoId]);

      // Optimistically update todos list
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [];
        return oldTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
        );
      });

      // Optimistically update specific todo
      queryClient.setQueryData(['todo', todoId], (oldTodo: Todo | undefined) => {
        if (!oldTodo) return undefined;
        return { ...oldTodo, isCompleted: !oldTodo.isCompleted };
      });

      // Return a context object with the snapshotted value
      return { previousTodos, previousTodo, todoId };
    },
    onError: (error, _, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context) {
        queryClient.setQueryData(['todos'], context.previousTodos);
        queryClient.setQueryData(['todo', context.todoId], context.previousTodo);
      }
      console.error('❌ Error toggling todo:', error);
    },
    onSuccess: (updatedTodo) => {
      // Update with the actual server response
      queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo);

      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [updatedTodo];
        return oldTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};