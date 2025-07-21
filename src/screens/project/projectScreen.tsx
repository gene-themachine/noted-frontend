import React from 'react';
import StartWorkflow from '@/components/startWorkflow';

const ProjectScreen = () => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow flex items-center justify-center mt-[151px]">
        <StartWorkflow />
      </div>
      {/* This empty div acts as a spacer to push the StartWorkflow up,
          matching the vertical alignment from the home screen. 
          h-44 is an approximation of the project card row's height. */}
      <div className="h-44" />
    </div>
  );
};

export default ProjectScreen;
