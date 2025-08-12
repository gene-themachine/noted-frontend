import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, PlusCircle, MinusCircle } from 'lucide-react';
import { LibraryItem } from '../../types';

interface AddLibraryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectLibrary: LibraryItem[];
  noteLibrary: LibraryItem[];
  onAddItem: (libraryItemId: string) => void;
  onRemoveItem: (libraryItemId: string) => void;
}

const AddLibraryItemModal: React.FC<AddLibraryItemModalProps> = ({
  isOpen,
  onClose,
  projectLibrary,
  noteLibrary,
  onAddItem,
  onRemoveItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const noteLibraryIds = new Set(noteLibrary.map((item) => item.id));

  const filteredLibrary =
    projectLibrary?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background-overlay flex items-center justify-center z-modal"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-surface rounded-2xl p-6 max-w-lg w-full mx-4 shadow-floating-lg flex flex-col font-helvetica"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Attach Files</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-background-alt">
                <X className="w-5 h-5 text-foreground-muted" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                placeholder="Search project files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-divider rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
            </div>

            {/* Library List */}
            <div className="space-y-2 flex-grow min-h-[200px] max-h-80 overflow-y-auto pr-2">
              {filteredLibrary.length > 0 ? (
                filteredLibrary.map((item) => {
                  const isAdded = noteLibraryIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-background-alt transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-foreground-muted" />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                      <button
                        onClick={() => (isAdded ? onRemoveItem(item.id) : onAddItem(item.id))}
                        className="p-1 rounded-full text-foreground-muted"
                        aria-label={isAdded ? 'Remove item' : 'Add item'}
                      >
                        {isAdded ? (
                          <MinusCircle className="w-6 h-6 text-status-error hover:text-status-error/80" />
                        ) : (
                          <PlusCircle className="w-6 h-6 text-primary-blue hover:text-primary-blue/80" />
                        )}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-foreground-muted">
                  <p>
                    {searchTerm ? 'No files found.' : 'This project has no files in its library.'}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-primary-blue text-foreground-inverse font-semibold rounded-lg hover:bg-primary-blue/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-surface"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLibraryItemModal;
