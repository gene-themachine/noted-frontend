import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import ToDoListComponent from './components/toDoListComponent';
import { useTodos, useCreateTodo } from '../../hooks/todo';
import DateTimePicker from '../ui/DateTimePicker';

const TodoListRightBar = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');

  const { data: todos, isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) return;

    try {
      await createTodoMutation.mutateAsync({
        title: newTodoTitle.trim(),
        dueDate: newTodoDueDate || undefined,
      });

      // Reset form
      setNewTodoTitle('');
      setNewTodoDueDate('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleCancelAdd = () => {
    setNewTodoTitle('');
    setNewTodoDueDate('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header section - fixed height */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-base font-semibold text-foreground-muted uppercase tracking-wider">Todos</h2>
      </div>

      {/* Scrollable content area - fills remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-4 h-4 animate-spin text-foreground-tertiary" />
            <span className="ml-2 text-sm text-foreground-tertiary">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-3 text-sm text-status-error">
            Failed to load todos.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!todos || todos.length === 0) && (
          <div className="py-8 text-center">
            <p className="text-sm text-foreground-tertiary">No todos yet</p>
          </div>
        )}

        {/* Todos List */}
        {todos && todos.length > 0 && (
          <div className="border-t border-border-light">
            {todos.map((todo) => (
              <ToDoListComponent key={todo.id} todo={todo} />
            ))}
          </div>
        )}

        {/* Add Todo Form */}
        {showAddForm && (
          <form onSubmit={handleAddTodo} className="border-t border-border-light p-3 space-y-2">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full px-2 py-1 bg-transparent text-sm placeholder-foreground-tertiary focus:outline-none"
              autoFocus
            />
            
            <DateTimePicker
              value={newTodoDueDate}
              onChange={setNewTodoDueDate}
              placeholder="Due date and time (optional)"
              className="mt-1"
            />
            
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={!newTodoTitle.trim() || createTodoMutation.isPending}
                className="text-xs text-primary-blue hover:text-primary-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {createTodoMutation.isPending ? 'Adding...' : 'Add'}
              </button>
              
              <button
                type="button"
                onClick={handleCancelAdd}
                className="text-xs text-foreground-tertiary hover:text-foreground-secondary transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Add Todo Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 text-left text-sm text-foreground-tertiary hover:text-foreground-secondary transition-colors duration-200 flex items-center gap-2 border-t border-border-light"
          >
            <Plus className="w-3 h-3" />
            Add todo
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoListRightBar;
