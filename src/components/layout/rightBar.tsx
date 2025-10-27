import React from 'react';
import TodoListRightBar from '../rightBar/todoListRightBar';

const RightBar = () => {
  return (
    <div className="flex flex-col h-full text-foreground">
      {/* Content Area - Todos only */}
      <div className="flex-1 min-h-0">
        <TodoListRightBar />
      </div>
    </div>
  );
};

export default RightBar;   