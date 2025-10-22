import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import ColorPicker from '../common/ColorPicker';
import { Project } from '@/types/index';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, color: string) => void;
  project: Project | null;
  isUpdating?: boolean;
  theme?: 'light' | 'dark';
}

export default function EditProjectModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  isUpdating = false,
  theme = 'dark',
}: EditProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0078b9');

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setDescription(project.description || '');
      setColor(project.color || '#0078b9');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim(), color);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  if (!isOpen || !project) return null;

  const isLightTheme = theme === 'light';
  const hasChanges =
    name.trim() !== project.name ||
    description.trim() !== (project.description || '') ||
    color !== (project.color || '#0078b9');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={clsx(
          'fixed inset-0 flex items-center justify-center z-50',
          isLightTheme ? 'bg-black/30' : 'bg-black/70 backdrop-blur-sm',
        )}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'rounded-2xl p-8 w-full max-w-md shadow-2xl',
            isLightTheme
              ? 'bg-white border border-gray-200'
              : 'bg-black border border-white/10',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            className={clsx(
              'text-xl font-bold mb-6',
              isLightTheme ? 'text-gray-900' : 'text-white',
            )}
          >
            Edit Project
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="project-name"
                className={clsx(
                  'block text-sm font-medium mb-2',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name..."
                disabled={isUpdating}
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                    : 'bg-white/5 text-white focus:ring-white/20',
                  isUpdating && 'opacity-50 cursor-not-allowed',
                )}
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="project-color"
                className={clsx(
                  'block text-sm font-medium mb-2',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Project Color
              </label>
              <ColorPicker value={color} onChange={setColor} theme={theme} disabled={isUpdating} />
            </div>

            <div className="mb-8">
              <label
                htmlFor="project-description"
                className={clsx(
                  'block text-sm font-medium mb-2',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Description (Optional)
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a brief description..."
                disabled={isUpdating}
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 h-24 resize-none',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                    : 'bg-white/5 text-white focus:ring-white/20',
                  isUpdating && 'opacity-50 cursor-not-allowed',
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUpdating}
                className={clsx(
                  'px-5 py-2 rounded-lg transition-colors font-medium text-sm',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10',
                  isUpdating && 'opacity-50 cursor-not-allowed',
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim() || !hasChanges || isUpdating}
                className={clsx(
                  'px-5 py-2 rounded-lg font-semibold transition-colors text-sm min-w-[120px] flex items-center justify-center',
                  !name.trim() || !hasChanges || isUpdating
                    ? 'bg-gray-500/50 text-white/70 cursor-not-allowed'
                    : isLightTheme
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-white text-black',
                )}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
