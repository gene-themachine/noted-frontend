import React, { useState } from 'react';
import NoteRightBar from '../rightBar/noteRightBar';
import TodoListRightBar from '../rightBar/todoListRightBar';
import Notification from '../rightBar/notification';
import { useTodos } from '../../hooks/todo';

const RightBar = () => {
  const [activeView, setActiveView] = useState('notifications'); // 'todos', 'note', or 'notifications'
  const { data: todos } = useTodos();
  const todoCount = todos?.length || 0;

  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Header section - with navigation */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-hover">
            <button
              onClick={() => setActiveView('notifications')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                activeView === 'notifications'
                  ? 'bg-surface-raised text-foreground'
                  : 'text-foreground-secondary hover:bg-surface-pressed'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveView('todos')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                activeView === 'todos'
                  ? 'bg-surface-raised text-foreground'
                  : 'text-foreground-secondary hover:bg-surface-pressed'
              }`}
            >
              <span className="flex items-center gap-2">
                Todos
                {todoCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium text-white bg-primary-blue rounded-full">
                    {todoCount > 99 ? '99+' : todoCount}
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveView('note')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
                activeView === 'note'
                  ? 'bg-surface-raised text-foreground'
                  : 'text-foreground-secondary hover:bg-surface-pressed'
              }`}
            >
              Note
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {activeView === 'notifications' && <Notification />}
        {activeView === 'todos' && <TodoListRightBar />}
        {activeView === 'note' && <NoteRightBar />}
      </div>
    </div>
  );
};

export default RightBar;   