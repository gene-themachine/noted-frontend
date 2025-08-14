import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Search } from 'lucide-react';
import clsx from 'clsx';
import { NoteSummary } from '@/types';

interface NoteSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (noteId: string) => void;
  notes: NoteSummary[];
  theme?: 'light' | 'dark';
}

export default function NoteSelectionModal({
  isOpen,
  onClose,
  onSelectNote,
  notes = [],
  theme = 'light',
}: NoteSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const isLightTheme = theme === 'light';

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className={clsx(
          'fixed inset-0 flex items-center justify-center z-50',
          isLightTheme ? 'bg-black/30' : 'bg-black/70 backdrop-blur-sm',
        )}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-selection-title"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ 
            duration: 0.15, 
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.12 }
          }}
          className={clsx(
            'relative rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl',
            'will-change-transform',
            isLightTheme
              ? 'bg-white border border-gray-200'
              : 'bg-surface border border-white/10',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2
              id="note-selection-title"
              className={clsx(
                'text-lg font-bold',
                isLightTheme ? 'text-gray-900' : 'text-white',
              )}
            >
              Select Note
            </h2>
            <button
              onClick={onClose}
              className={clsx(
                'p-2 rounded-full transition-colors duration-150',
                isLightTheme 
                  ? 'hover:bg-gray-100 text-gray-500 hover:text-gray-700' 
                  : 'hover:bg-white/10 text-gray-400 hover:text-white'
              )}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className={clsx(
              'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
              isLightTheme ? 'text-gray-400' : 'text-gray-500'
            )} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={clsx(
                'w-full rounded-lg pl-10 pr-4 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-blue',
                isLightTheme
                  ? 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  : 'bg-white/5 text-white placeholder-gray-400'
              )}
            />
          </div>

          {/* Notes List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className={clsx(
                'text-center py-8',
                isLightTheme ? 'text-gray-500' : 'text-gray-400'
              )}>
                {searchTerm ? 'No notes found' : 'No notes available'}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-blue',
                      isLightTheme
                        ? 'hover:bg-gray-50 focus:ring-offset-white'
                        : 'hover:bg-white/5 focus:ring-offset-surface'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className={clsx(
                        'w-4 h-4 flex-shrink-0',
                        isLightTheme ? 'text-gray-600' : 'text-gray-400'
                      )} />
                      <div className="min-w-0 flex-1">
                        <h3 className={clsx(
                          'font-medium text-sm truncate',
                          isLightTheme ? 'text-gray-900' : 'text-white'
                        )}>
                          {note.name}
                        </h3>
                        <p className={clsx(
                          'text-xs mt-1',
                          isLightTheme ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}