import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, BookOpen, Clipboard, FileText, X, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { NoteSummary } from '@/types';

interface SelectedSources {
  files: File[];
  notes: NoteSummary[];
  pastedTexts: { id: string; content: string; name: string }[];
  libraryItems: { id: string; name: string }[];
}

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (sources: SelectedSources) => void;
  onSelectNote: () => Promise<NoteSummary | null>;
  onSelectLibraryItems: () => Promise<{ id: string; name: string }[]>;
  theme?: 'light' | 'dark';
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  count?: number;
  onClick: () => void;
  theme: 'light' | 'dark';
}

const ActionCard = React.forwardRef<HTMLButtonElement, ActionCardProps>(({ icon, title, description, count = 0, onClick, theme }, ref) => {
  const isLightTheme = theme === 'light';
  
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={clsx(
        'relative p-4 rounded-xl border transition-colors duration-200 text-left w-full',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        isLightTheme 
          ? 'bg-white border-gray-200 hover:bg-gray-50 focus:ring-primary-blue focus:ring-offset-white' 
          : 'bg-surface border-white/10 hover:bg-surface-hover focus:ring-white/20 focus:ring-offset-surface'
      )}
    >
      {count > 0 && (
        <div className={clsx(
          'absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
          'bg-primary-blue text-white'
        )}>
          {count > 99 ? '99+' : count}
        </div>
      )}
      <div className="flex flex-col items-center space-y-2">
        <div className={clsx(
          'p-2 rounded-full',
          isLightTheme 
            ? 'bg-gray-100 text-gray-700' 
            : 'bg-white/10 text-white'
        )}>
          {icon}
        </div>
        <div className="text-center">
          <h3 className={clsx(
            'font-semibold text-sm',
            isLightTheme ? 'text-gray-900' : 'text-white'
          )}>
            {title}
          </h3>
          <p className={clsx(
            'text-xs mt-1',
            isLightTheme ? 'text-gray-600' : 'text-gray-400'
          )}>
            {description}
          </p>
        </div>
      </div>
    </button>
  );
});

ActionCard.displayName = 'ActionCard';

export default function QuickActionModal({
  isOpen,
  onClose,
  onContinue,
  onSelectNote,
  onSelectLibraryItems,
  theme = 'dark',
}: QuickActionModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSources, setSelectedSources] = useState<SelectedSources>({
    files: [],
    notes: [],
    pastedTexts: [],
    libraryItems: []
  });

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus first action card when modal opens
      setTimeout(() => {
        firstActionRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLightTheme = theme === 'light';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedSources(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
    // Reset input to allow selecting same files again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      setSelectedSources(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSelectNotes = async () => {
    const note = await onSelectNote();
    if (note) {
      setSelectedSources(prev => ({
        ...prev,
        notes: [...prev.notes.filter(n => n.id !== note.id), note]
      }));
    }
  };

  const handleSelectLibraryItems = async () => {
    const items = await onSelectLibraryItems();
    if (items.length > 0) {
      setSelectedSources(prev => ({
        ...prev,
        libraryItems: [...prev.libraryItems, ...items.filter(item => 
          !prev.libraryItems.some(existing => existing.id === item.id)
        )]
      }));
    }
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const pastedItem = {
          id: `paste-${Date.now()}`,
          content: text,
          name: `Pasted Content - ${timestamp}`
        };
        setSelectedSources(prev => ({
          ...prev,
          pastedTexts: [...prev.pastedTexts, pastedItem]
        }));
      }
    } catch (err) {
      // Clipboard access failed - could show error message
      console.error('Failed to access clipboard:', err);
    }
  };

  const removeSource = (type: keyof SelectedSources, id: string | number) => {
    setSelectedSources(prev => ({
      ...prev,
      [type]: prev[type].filter((item: any, index: number) => 
        type === 'files' ? index !== id : item.id !== id
      )
    }));
  };

  const clearAll = () => {
    setSelectedSources({
      files: [],
      notes: [],
      pastedTexts: [],
      libraryItems: []
    });
  };

  const handleContinue = () => {
    onContinue(selectedSources);
    onClose();
  };

  const totalItems = selectedSources.files.length + selectedSources.notes.length + 
                   selectedSources.pastedTexts.length + selectedSources.libraryItems.length;

  const bottomActions = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Select Note',
      description: 'Choose existing note',
      count: selectedSources.notes.length,
      onClick: handleSelectNotes
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'From Library',
      description: 'Use existing files',
      count: selectedSources.libraryItems.length,
      onClick: handleSelectLibraryItems
    },
    {
      icon: <Clipboard className="w-5 h-5" />,
      title: 'Paste Text',
      description: 'Create from clipboard',
      count: selectedSources.pastedTexts.length,
      onClick: handlePasteText
    }
  ];

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
        aria-labelledby="modal-title"
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
            'relative rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl',
            'will-change-transform',
            isLightTheme
              ? 'bg-white border border-gray-200'
              : 'bg-surface border border-white/10',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              id="modal-title"
              className={clsx(
                'text-xl font-bold',
                isLightTheme ? 'text-gray-900' : 'text-white',
              )}
            >
              Quick Actions
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

          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={clsx(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 mb-6',
              isDragging
                ? isLightTheme
                  ? 'border-primary-blue bg-primary-blue/5'
                  : 'border-white/30 bg-white/5'
                : isLightTheme
                ? 'border-gray-300 hover:bg-gray-50'
                : 'border-white/20 hover:bg-white/5'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <UploadCloud className={clsx(
              'w-12 h-12 mx-auto mb-4',
              isLightTheme ? 'text-gray-600' : 'text-gray-400'
            )} />
            <h3 className={clsx(
              'font-semibold text-lg mb-2',
              isLightTheme ? 'text-gray-900' : 'text-white'
            )}>
              Upload Files
            </h3>
            <p className={clsx(
              'text-sm',
              isLightTheme ? 'text-gray-600' : 'text-gray-400'
            )}>
              Drop files here or click to browse
            </p>
          </div>

          {/* Bottom Action Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {bottomActions.map((action, index) => (
              <ActionCard
                key={index}
                ref={index === 0 ? firstActionRef : undefined}
                icon={action.icon}
                title={action.title}
                description={action.description}
                count={action.count}
                onClick={action.onClick}
                theme={theme}
              />
            ))}
          </div>

          {/* Selected Sources Section */}
          {totalItems > 0 && (
            <div className={clsx(
              'border-t pt-4 mb-4',
              isLightTheme ? 'border-gray-200' : 'border-white/10'
            )}>
              <h3 className={clsx(
                'font-semibold text-sm mb-3',
                isLightTheme ? 'text-gray-900' : 'text-white'
              )}>
                Selected Sources ({totalItems} items)
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {/* Files */}
                {selectedSources.files.map((file, index) => (
                  <div key={`file-${index}`} className={clsx(
                    'flex items-center justify-between p-2 rounded-lg',
                    isLightTheme ? 'bg-gray-50' : 'bg-white/5'
                  )}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <UploadCloud className={clsx(
                        'w-4 h-4 flex-shrink-0',
                        isLightTheme ? 'text-gray-600' : 'text-gray-400'
                      )} />
                      <span className={clsx(
                        'text-sm truncate',
                        isLightTheme ? 'text-gray-700' : 'text-gray-300'
                      )}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSource('files', index)}
                      className={clsx(
                        'p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700',
                        'transition-colors duration-200'
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Notes */}
                {selectedSources.notes.map((note) => (
                  <div key={`note-${note.id}`} className={clsx(
                    'flex items-center justify-between p-2 rounded-lg',
                    isLightTheme ? 'bg-gray-50' : 'bg-white/5'
                  )}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <FileText className={clsx(
                        'w-4 h-4 flex-shrink-0',
                        isLightTheme ? 'text-gray-600' : 'text-gray-400'
                      )} />
                      <span className={clsx(
                        'text-sm truncate',
                        isLightTheme ? 'text-gray-700' : 'text-gray-300'
                      )}>
                        {note.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSource('notes', note.id)}
                      className={clsx(
                        'p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700',
                        'transition-colors duration-200'
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Library Items */}
                {selectedSources.libraryItems.map((item) => (
                  <div key={`library-${item.id}`} className={clsx(
                    'flex items-center justify-between p-2 rounded-lg',
                    isLightTheme ? 'bg-gray-50' : 'bg-white/5'
                  )}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <BookOpen className={clsx(
                        'w-4 h-4 flex-shrink-0',
                        isLightTheme ? 'text-gray-600' : 'text-gray-400'
                      )} />
                      <span className={clsx(
                        'text-sm truncate',
                        isLightTheme ? 'text-gray-700' : 'text-gray-300'
                      )}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSource('libraryItems', item.id)}
                      className={clsx(
                        'p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700',
                        'transition-colors duration-200'
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Pasted Texts */}
                {selectedSources.pastedTexts.map((text) => (
                  <div key={`paste-${text.id}`} className={clsx(
                    'flex items-center justify-between p-2 rounded-lg',
                    isLightTheme ? 'bg-gray-50' : 'bg-white/5'
                  )}>
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Clipboard className={clsx(
                        'w-4 h-4 flex-shrink-0',
                        isLightTheme ? 'text-gray-600' : 'text-gray-400'
                      )} />
                      <span className={clsx(
                        'text-sm truncate',
                        isLightTheme ? 'text-gray-700' : 'text-gray-300'
                      )}>
                        {text.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSource('pastedTexts', text.id)}
                      className={clsx(
                        'p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-700',
                        'transition-colors duration-200'
                      )}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex justify-between items-center">
            {totalItems > 0 ? (
              <>
                <button
                  onClick={clearAll}
                  className={clsx(
                    'text-sm font-medium transition-colors duration-200',
                    isLightTheme 
                      ? 'text-gray-600 hover:text-gray-800' 
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  Clear All
                </button>
                <button
                  onClick={handleContinue}
                  className={clsx(
                    'px-6 py-2 rounded-lg font-semibold transition-colors duration-200',
                    'bg-primary-blue text-white hover:bg-primary-blue/90',
                    'focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2',
                    isLightTheme ? 'focus:ring-offset-white' : 'focus:ring-offset-surface'
                  )}
                >
                  Continue
                </button>
              </>
            ) : (
              <div className={clsx(
                'text-sm text-center w-full',
                isLightTheme ? 'text-gray-500' : 'text-gray-400'
              )}>
                Select sources to continue
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}