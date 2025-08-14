import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Home } from 'lucide-react';
import FileTree from '../file-tree/FileTree';
import { useProject } from '../../hooks/project';

interface ProjectControllerProps {
  projectId?: string;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onAddItem?: () => void;
}

const ProjectController: React.FC<ProjectControllerProps> = ({
  projectId,
  onMobileClose,
  isCollapsed = false,
  onAddItem,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: project, isLoading, isError } = useProject(projectId!);

  const tabs = ['LIBRARY', 'TOOLS'];

  const handleTabClick = (tab: string) => {
    if (!projectId) return;
    navigate(`/project/${projectId}/${tab.toLowerCase()}`);
    onMobileClose?.();
  };

  const handleHomeClick = () => {
    if (!projectId) return;
    navigate(`/project/${projectId}`);
    onMobileClose?.();
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Error loading project</div>;

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col"
          >
            <div className="flex-shrink-0 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-bold truncate pr-3">{project?.name}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleHomeClick}
                    className="p-2 rounded-lg hover:bg-surface-hover"
                    title="Go to home"
                  >
                    <Home className="w-5 h-5 text-foreground-secondary" />
                  </button>
                  <button
                    onClick={onAddItem}
                    className="p-2 rounded-lg hover:bg-surface-hover"
                    title="Add new item"
                  >
                    <Plus className="w-5 h-5 text-foreground-secondary" />
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      location.pathname.includes(tab.toLowerCase())
                        ? 'bg-surface-pressed text-foreground'
                        : 'bg-surface-hover text-foreground-secondary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto mt-6">
              {project?.folderTree && (
                <FileTree root={project.folderTree} projectId={project.id} onMobileClose={onMobileClose} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectController;