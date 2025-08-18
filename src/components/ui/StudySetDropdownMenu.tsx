import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, RefreshCw } from 'lucide-react';

interface StudySetDropdownMenuProps {
  onRename: () => void;
  onDelete: () => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

export function StudySetDropdownMenu({ 
  onRename, 
  onDelete, 
  onRegenerate, 
  isGenerating = false 
}: StudySetDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Study set options"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => handleAction(onRename)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </button>
              
              {onRegenerate && (
                <button
                  onClick={() => handleAction(onRegenerate)}
                  disabled={isGenerating}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              )}
              
              <div className="border-t border-gray-100 my-1" />
              
              <button
                onClick={() => handleAction(onDelete)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}