import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, FileText, PlusCircle, MinusCircle } from 'lucide-react';
import { LibraryItem } from '../../types';

interface AddLibraryItemModalFlashcardProps {
  isOpen: boolean;
  onClose: () => void;
  projectLibrary: LibraryItem[];
  flashcardLibrary: LibraryItem[]; // Items currently attached to flashcards
  onAddItem: (libraryItemId: string) => void;
  onRemoveItem: (libraryItemId: string) => void;
}

export default function AddLibraryItemModalFlashcard({
  isOpen,
  onClose,
  projectLibrary,
  flashcardLibrary,
  onAddItem,
  onRemoveItem,
}: AddLibraryItemModalFlashcardProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLibrary = projectLibrary.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAttachedToFlashcard = (itemId: string) =>
    flashcardLibrary.some((item) => item.id === itemId);

  const handleToggleItem = (itemId: string) => {
    if (isAttachedToFlashcard(itemId)) {
      onRemoveItem(itemId);
    } else {
      onAddItem(itemId);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-lg flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Flashcard Assets</h3>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Add or remove library items from your flashcards. These assets will be associated with the flashcard set.
            </p>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search library items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Library Items List */}
            <div className="flex-1 overflow-y-auto">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {projectLibrary.length === 0
                    ? 'No library items in this project yet.'
                    : 'No items match your search.'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLibrary.map((item) => {
                    const isAttached = isAttachedToFlashcard(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleItem(item.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 select-none ${
                          isAttached
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                        style={{ userSelect: 'none' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.mimeType} • {(item.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {isAttached ? (
                              <MinusCircle className="w-5 h-5 text-blue-500" />
                            ) : (
                              <PlusCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
