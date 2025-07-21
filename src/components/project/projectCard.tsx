import React from 'react';
import { Project } from '@/types/index';

interface ProjectCardProps {
  project: Project;
  colorClass: string;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  colorClass, 
  onClick 
}) => {
  return (
    <div 
      className={`relative ${colorClass} rounded-2xl p-4 w-48 h-24 flex-shrink-0 flex items-center justify-center text-center cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
      onClick={onClick}
    >
      <div className="absolute top-4 left-4 w-2.5 h-2.5 bg-white rounded-full opacity-70"></div>
      <h3 className="text-white text-lg font-semibold line-clamp-2 leading-tight">
        {project.name}
      </h3>
    </div>
  );
};

export default ProjectCard;
