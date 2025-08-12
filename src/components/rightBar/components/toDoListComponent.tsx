import React, { useState } from 'react';
import { Check, X, Edit2, Calendar } from 'lucide-react';
import { Todo } from '../../../api/todo';
import { useDeleteTodo, useUpdateTodo } from '../../../hooks/todo';
import DateTimePicker from '../../ui/DateTimePicker';

interface ToDoListComponentProps {
  todo: Todo;
}

export default function ToDoListComponent({ todo }: ToDoListComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  const handleToggleComplete = () => {
    // Delete the todo when checkbox is clicked
    deleteTodoMutation.mutate(todo.id);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      await updateTodoMutation.mutateAsync({
        todoId: todo.id,
        payload: {
          title: editTitle.trim(),
          dueDate: editDueDate || null,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format time if it's today or tomorrow
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600' };
    } else if (diffDays === 0) {
      const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
      return { 
        text: hasTime ? `Due today at ${timeStr}` : 'Due today', 
        color: 'text-amber-600' 
      };
    } else if (diffDays === 1) {
      const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
      return { 
        text: hasTime ? `Due tomorrow at ${timeStr}` : 'Due tomorrow', 
        color: 'text-amber-600' 
      };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'text-foreground-muted' };
    }
  };

  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

  if (isEditing) {
    return (
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-1 bg-transparent border-b border-border-light text-sm focus:outline-none focus:border-primary-blue transition-colors duration-200"
          placeholder="Todo title..."
          autoFocus
        />
        
        <DateTimePicker
          value={editDueDate}
          onChange={setEditDueDate}
          className="border-b border-border-light pb-1"
        />
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSaveEdit}
            disabled={!editTitle.trim() || updateTodoMutation.isPending}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary-blue hover:text-primary-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Check className="w-3 h-3" />
            Save
          </button>
          
          <button
            onClick={handleCancelEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs text-foreground-tertiary hover:text-foreground-secondary transition-all duration-200"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group py-3 border-b border-border-light last:border-0 hover:bg-background-alt/50 transition-colors duration-200">
      <div className="flex items-start gap-3 px-2">
        {/* Completion Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={deleteTodoMutation.isPending}
          className="flex-shrink-0 w-4 h-4 mt-0.5 rounded border border-border-strong hover:border-primary-blue transition-colors duration-200 disabled:opacity-50"
          aria-label="Complete todo"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm text-foreground-secondary leading-relaxed">
              {todo.title}
            </h3>
            
            {/* Edit Button - only show on hover */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 -mr-1 text-foreground-muted hover:text-foreground-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Edit todo"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
          
          {/* Due Date */}
          {dueDateInfo && (
            <div className={`inline-flex items-center gap-1 mt-1 text-xs ${dueDateInfo.color}`}>
              <Calendar className="w-3 h-3" />
              {dueDateInfo.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}