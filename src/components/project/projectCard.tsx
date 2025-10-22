import React, { useState } from 'react';
import { Project } from '@/types/index';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  colorClass: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  colorClass,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const hasCustomColor = project.color && project.color.startsWith('#');

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.();
  };

  const handleCardClick = () => {
    if (!showMenu) {
      onClick?.();
    }
  };

  return (
    <div
      className={`relative ${!hasCustomColor ? colorClass : ''} rounded-2xl p-4 w-48 h-24 flex-shrink-0 flex items-center justify-center text-center cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
      style={hasCustomColor ? { backgroundColor: project.color || '#000000' } : undefined}
      onClick={handleCardClick}
    >
      {/* Decorative dot */}
      <div className="absolute top-4 left-4 w-2.5 h-2.5 bg-white rounded-full opacity-70"></div>

      {/* Project name */}
      <h3 className="text-white text-lg font-semibold line-clamp-2 leading-tight px-8">
        {project.name}
      </h3>

      {/* Context menu button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleMenuClick}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Project options"
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div
            className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Project
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
