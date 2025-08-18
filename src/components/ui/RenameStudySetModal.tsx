import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface RenameStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
  setType: 'flashcard' | 'multiple_choice' | 'free_response';
  isLoading?: boolean;
}

export function RenameStudySetModal({
  isOpen,
  onClose,
  onRename,
  currentName,
  setType,
  isLoading = false
}: RenameStudySetModalProps) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
    }
  };

  const getDisplayType = () => {
    switch (setType) {
      case 'flashcard': return 'Flashcard Set';
      case 'multiple_choice': return 'Multiple Choice Set';
      case 'free_response': return 'Free Response Set';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Rename {getDisplayType()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="setName" className="block text-sm font-medium text-gray-700 mb-2">
              Set Name
            </label>
            <input
              id="setName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter set name..."
              maxLength={100}
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newName.trim() || newName.trim() === currentName || isLoading}
              className="bg-primary-green hover:bg-green-600"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}