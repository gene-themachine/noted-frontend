import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText } from 'lucide-react';
import clsx from 'clsx';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: 'folder' | 'note', name: string) => void;
  theme?: 'light' | 'dark';
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
  theme = 'dark',
}: AddItemModalProps) {
  const [itemType, setItemType] = useState<'folder' | 'note'>('folder');
  const [itemName, setItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      onSubmit(itemType, itemName.trim());
      setItemName('');
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
            Create New
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p
                className={clsx(
                  'text-sm font-medium mb-3',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Select Type
              </p>
              <div
                className={clsx(
                  'flex gap-4 p-1 rounded-lg',
                  isLightTheme ? 'bg-gray-100' : 'bg-white/5',
                )}
              >
                <button
                  type="button"
                  onClick={() => setItemType('folder')}
                  className={clsx(
                    'flex-1 py-2.5 rounded-md transition-colors text-sm font-semibold flex items-center justify-center gap-2',
                    itemType === 'folder'
                      ? isLightTheme
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-white/10 text-white'
                      : isLightTheme
                      ? 'text-gray-500 hover:text-gray-800'
                      : 'text-gray-400 hover:text-white',
                  )}
                >
                  <Folder className="w-4 h-4" />
                  <span>Folder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('note')}
                  className={clsx(
                    'flex-1 py-2.5 rounded-md transition-colors text-sm font-semibold flex items-center justify-center gap-2',
                    itemType === 'note'
                      ? isLightTheme
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-white/10 text-white'
                      : isLightTheme
                      ? 'text-gray-500 hover:text-gray-800'
                      : 'text-gray-400 hover:text-white',
                  )}
                >
                  <FileText className="w-4 h-4" />
                  <span>Note</span>
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label
                htmlFor="item-name"
                className={clsx(
                  'block text-sm font-medium mb-2',
                  isLightTheme ? 'text-gray-600' : 'text-gray-400',
                )}
              >
                Name
              </label>
              <input
                id="item-name"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={`Enter ${itemType} name...`}
                className={clsx(
                  'w-full rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2',
                  isLightTheme
                    ? 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                    : 'bg-white/5 text-white focus:ring-white/20',
                )}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
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
                disabled={!itemName.trim()}
                className={clsx(
                  'px-5 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm',
                  isLightTheme
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : 'bg-white text-black',
                )}
              >
                Create
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 