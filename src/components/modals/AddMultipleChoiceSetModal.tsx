import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Book, BrainCircuit, Loader2, BookOpen, CheckCircle, PlusCircle } from 'lucide-react';
import { useProjectLibraryItems } from '../../hooks/library';
import { useCreateMultipleChoiceSet } from '../../hooks/multipleChoice';
import { useProjectNotes } from '../../hooks/studySets';
import { LibraryItem, Note } from '../../types';
import ToggleSwitch from '../common/ToggleSwitch';
import toast from 'react-hot-toast';

interface AddMultipleChoiceSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  projectId: string;
}

const AddMultipleChoiceSetModal: React.FC<AddMultipleChoiceSetModalProps> = ({
  isOpen,
  onClose,
  noteId,
  projectId,
}) => {
  const [name, setName] = useState('Multiple Choice Set');
  const [includeNoteContent, setIncludeNoteContent] = useState(true);
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<string[]>([]);
  const [selectedOtherNotes, setSelectedOtherNotes] = useState<string[]>([]);

  const { data: projectLibrary, isLoading: isLoadingLibrary } = useProjectLibraryItems(projectId);
  const { data: projectNotes, isLoading: isLoadingNotes } = useProjectNotes(projectId);
  const createSetMutation = useCreateMultipleChoiceSet();

  // Filter out the current note from other notes
  const otherNotes = projectNotes?.filter(note => note.id !== noteId) || [];

  const handleToggleLibraryItem = (itemId: string) => {
    setSelectedLibraryItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleOtherNote = (noteIdToToggle: string) => {
    setSelectedOtherNotes((prev) =>
      prev.includes(noteIdToToggle) ? prev.filter((id) => id !== noteIdToToggle) : [...prev, noteIdToToggle]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createSetMutation.isPending) return;

    if (!includeNoteContent && selectedLibraryItems.length === 0 && selectedOtherNotes.length === 0) {
      toast.error('Please select at least one content source.');
      return;
    }

    try {
      // Build the list of selected notes (current note if included + other selected notes)
      const selectedNotes = includeNoteContent ? [noteId, ...selectedOtherNotes] : selectedOtherNotes;
      
      await createSetMutation.mutateAsync({
        noteId,
        name,
        includeNoteContent,
        selectedLibraryItems,
        selectedNotes,
      });
      toast.success('Started generating multiple choice set!');
      onClose();
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-background-alt rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-blue/10 p-2 rounded-lg">
                      <BrainCircuit className="w-6 h-6 text-primary-blue" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Create Multiple Choice Set</h2>
                  </div>
                  <button type="button" onClick={onClose} className="p-1 rounded-full text-foreground-muted hover:bg-hover">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="set-name" className="block text-sm font-medium text-foreground-secondary mb-2">Set Name</label>
                    <input
                      id="set-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-input border border-divider rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary-blue focus:outline-none"
                      placeholder="e.g. Chapter 1 Review"
                      required
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Content Sources</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-foreground-muted" />
                          <span className="font-medium text-foreground">Use content from this note</span>
                        </div>
                        <ToggleSwitch
                          isOn={includeNoteContent}
                          onToggle={() => setIncludeNoteContent(!includeNoteContent)}
                        />
                      </div>

                      <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Book className="w-5 h-5 text-foreground-muted" />
                          <span className="font-medium text-foreground">Use content from library</span>
                        </div>
                        
                        {isLoadingLibrary ? (
                          <div className="text-center py-4">
                            <p className="text-sm text-foreground-secondary">Loading library items...</p>
                          </div>
                        ) : projectLibrary && projectLibrary.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {projectLibrary.map((item: LibraryItem) => (
                              <div
                                key={item.id}
                                onClick={() => handleToggleLibraryItem(item.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                                  selectedLibraryItems.includes(item.id)
                                    ? 'border-primary-blue bg-primary-blue/10'
                                    : 'border-transparent hover:bg-hover'
                                }`}
                              >
                                <FileText className="w-5 h-5 text-foreground-muted flex-shrink-0" />
                                <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                             <p className="text-sm text-foreground-secondary">No library items in this project.</p>
                          </div>
                        )}
                      </div>

                      {/* Other Notes Section */}
                      <div className="p-4 bg-surface rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <BookOpen className="w-5 h-5 text-foreground-muted" />
                          <span className="font-medium text-foreground">Use content from other notes</span>
                        </div>
                        
                        {isLoadingNotes ? (
                          <div className="text-center py-4">
                            <p className="text-sm text-foreground-secondary">Loading notes...</p>
                          </div>
                        ) : otherNotes && otherNotes.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {otherNotes.map((note: Note) => (
                              <div
                                key={note.id}
                                onClick={() => handleToggleOtherNote(note.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 ${
                                  selectedOtherNotes.includes(note.id)
                                    ? 'border-primary-blue bg-primary-blue/10'
                                    : 'border-transparent hover:bg-hover'
                                }`}
                              >
                                <BookOpen className="w-5 h-5 text-foreground-muted flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{note.name}</p>
                                  <p className="text-xs text-foreground-tertiary">
                                    {note.content ? `${note.content.length} characters` : 'Empty note'}
                                  </p>
                                </div>
                                {selectedOtherNotes.includes(note.id) && (
                                  <CheckCircle className="w-5 h-5 text-primary-blue flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                             <p className="text-sm text-foreground-secondary">No other notes in this project.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-surface flex justify-end">
                <button
                  type="submit"
                  disabled={createSetMutation.isPending}
                  className="px-5 py-2.5 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createSetMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Start Generation'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMultipleChoiceSetModal; 