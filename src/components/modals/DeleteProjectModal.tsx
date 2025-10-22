import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { AlertTriangle } from 'lucide-react';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
  isDeleting?: boolean;
  theme?: 'light' | 'dark';
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  projectName,
  isDeleting = false,
  theme = 'dark',
}: DeleteProjectModalProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText === 'DELETE') {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const isLightTheme = theme === 'light';
  const canDelete = confirmText === 'DELETE' && !isDeleting;

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
          {/* Warning Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2
              className={clsx(
                'text-xl font-bold',
                isLightTheme ? 'text-gray-900' : 'text-white',
              )}
            >
              Delete Project
            </h2>
          </div>

          {/* Warning Message */}
          <div className="mb-6">
            <p
              className={clsx(
                'text-sm mb-3',
                isLightTheme ? 'text-gray-700' : 'text-gray-300',
              )}
            >
              You are about to permanently delete:
            </p>
            <div
              className={clsx(
                'px-4 py-3 rounded-lg mb-4',
                isLightTheme ? 'bg-gray-100' : 'bg-white/5',
              )}
            >
              <p
                className={clsx(
                  'font-semibold',
                  isLightTheme ? 'text-gray-900' : 'text-white',
                )}
              >
                {projectName}
              </p>
            </div>
            <p
              className={clsx(
                'text-sm mb-2',
                isLightTheme ? 'text-red-600' : 'text-red-400',
              )}
            >
              <strong>Warning:</strong> This action cannot be undone.
            </p>
            <p
              className={clsx(
                'text-sm',
                isLightTheme ? 'text-gray-600' : 'text-gray-400',
              )}
            >
              All notes, flashcards, quizzes, and files in this project will be permanently deleted.
            </p>
          </div>

          {/* Confirmation Input */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="confirm-delete"
                className={clsx(
                  'block text-sm font-medium mb-2',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Type <span className="font-bold">DELETE</span> to confirm:
              </label>
              <input
                id="confirm-delete"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={isDeleting}
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 font-mono',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-red-500'
                    : 'bg-white/5 text-white focus:ring-red-500/50',
                  isDeleting && 'opacity-50 cursor-not-allowed',
                )}
                autoFocus
                autoComplete="off"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className={clsx(
                  'px-5 py-2 rounded-lg transition-colors font-medium text-sm',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10',
                  isDeleting && 'opacity-50 cursor-not-allowed',
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canDelete}
                className={clsx(
                  'px-5 py-2 rounded-lg font-semibold transition-colors text-sm min-w-[120px] flex items-center justify-center',
                  canDelete
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-500/50 text-white/70 cursor-not-allowed',
                )}
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Delete Project'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
