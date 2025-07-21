import React, { useState } from 'react';
import NoteRightBar from '../../components/rightBar/noteRightBar';
import TodoListRightBar from '../../components/rightBar/todoListRightBar';

const RightBar = () => {
  const [activeView, setActiveView] = useState('todos'); // 'todos' or 'note'

  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Header section - with navigation */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 rounded-lg bg-surface-hover">
            <button
              onClick={() => setActiveView('todos')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeView === 'todos'
                  ? 'bg-surface-raised text-foreground'
                  : 'text-foreground-secondary hover:bg-surface-pressed'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveView('note')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
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
        {activeView === 'todos' && <TodoListRightBar />}
        {activeView === 'note' && <NoteRightBar />}
      </div>
    </div>
  );
};

export default RightBar;   