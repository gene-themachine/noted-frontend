import React from 'react';
import ToDoListComponent from './components/toDoListComponent';

const TodoListRightBar = () => {
  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Header section - fixed height */}
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground">Todos</h2>
      </div>

      {/* Scrollable content area - fills remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {/* Example Todos */}
        <ToDoListComponent text="Review Chapter 1 notes" />
        <ToDoListComponent text="Complete assignment 2" />
        <ToDoListComponent text="Study for midterm exam" />

        {/* Add Todo Button */}
        <button className="w-full p-4 border-2 border-dashed border-border rounded-xl text-foreground-tertiary hover:border-border-strong hover:text-foreground-secondary transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2">
          + Add new todo
        </button>
      </div>
    </div>
  );
};

export default TodoListRightBar;
