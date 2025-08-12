import React, { useState } from 'react';
import NoteRightBar from '../rightBar/noteRightBar';
import TodoListRightBar from '../rightBar/todoListRightBar';
import Notification from '../rightBar/notification';

const RightBar = () => {
  const [activeView, setActiveView] = useState('notifications'); // 'todos', 'note', or 'notifications'

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
              Todos
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