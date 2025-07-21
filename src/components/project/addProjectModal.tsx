import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => void;
  theme?: 'light' | 'dark';
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onSubmit,
  theme = 'dark',
}: AddProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim());
      setName('');
      setDescription('');
    }
  };

  if (!isOpen) return null;

  const isLightTheme = theme === 'light';

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
        onClick={onClose}
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
            Create New Project
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
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                    : 'bg-white/5 text-white focus:ring-white/20',
                )}
                autoFocus
              />
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
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 h-24 resize-none',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                    : 'bg-white/5 text-white focus:ring-white/20',
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className={clsx(
                  'px-5 py-2 rounded-lg transition-colors font-medium text-sm',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10',
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className={clsx(
                  'px-5 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm',
                  isLightTheme
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-white text-black',
                )}
              >
                Create Project
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
