import React from 'react';

interface StartWorkflowProps {
  onClick?: () => void;
}

const StartWorkflow: React.FC<StartWorkflowProps> = ({ onClick }) => {
  return (
    <div 
      className="w-48 h-48 bg-home-circle rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label="Start new workflow"
    />
  );
};

export default StartWorkflow;
