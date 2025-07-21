import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Save,
  X,
  Paperclip,
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';
import { useNote, useUpdateNote, useDeleteNote } from '../../hooks/note';
import {
  useProjectLibraryItems,
  useAddLibraryItemToNote,
  useRemoveLibraryItemFromNote,
} from '../../hooks/library';
import { useMarkFlashcardsAsNeedingUpdate } from '../../hooks/flashcard';
import { LibraryItem } from '../../types';
import useViewStore from '../../store/slices/viewSlice';

interface NoteScreenContext {
  openLibraryModal: () => void;
}

export default function NoteScreen() {
  const { noteId, projectId } = useParams<{ noteId: string; projectId: string }>();
  const navigate = useNavigate();
  const { openLibraryModal } = useOutletContext<NoteScreenContext>();
  const { data: note, isLoading, isError } = useNote(noteId!);
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const { data: projectLibrary } = useProjectLibraryItems(projectId!);
  const addLibraryItemMutation = useAddLibraryItemToNote();
  const removeLibraryItemMutation = useRemoveLibraryItemFromNote();
  const markFlashcardsAsNeedingUpdateMutation = useMarkFlashcardsAsNeedingUpdate();


  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);


  const nameInputRef = useRef<HTMLTextAreaElement>(null);
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    if (nameInputRef.current) {
      // Auto-resize the height of the textarea
      nameInputRef.current.style.height = 'auto';
      nameInputRef.current.style.height = `${nameInputRef.current.scrollHeight}px`;
    }
  }, [name]);

  // Set the active note in the view store
  

  useEffect(() => {
    if (note) {
      // Only update state if the input is not focused to avoid overwriting user input
      if (document.activeElement !== nameInputRef.current) {
        setName(note.name);
      }
      if (document.activeElement !== contentTextAreaRef.current) {
        setContent(note.content);
      }
    }
  }, [note]);

  // Debounced save for note content and title
  useEffect(() => {
    // Do not save if the note is not loaded yet
    if (!note) return;
    // Do not save if content is unchanged
    if (content === note.content && name === note.name) return;

    // Check if content specifically has changed (not just name)
    const contentHasChanged = content !== note.content;

    const handler = setTimeout(() => {
      setIsSaving(true);
      updateNoteMutation.mutate(
        { noteId: note.id, payload: { name, content } },
        {
          onSuccess: () => {
            setIsSaving(false);
            // Mark flashcards as needing update if content changed
            if (contentHasChanged && noteId) {
              markFlashcardsAsNeedingUpdateMutation.mutate(noteId);
            }
          },
          onError: () => setIsSaving(false),
        },
      );
    }, 1000); // 1-second debounce delay

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(handler);
    };
  }, [content, name, note, updateNoteMutation, noteId, markFlashcardsAsNeedingUpdateMutation]);

  const handleManualSave = () => {
    if (!note) return;
    
    // Check if content specifically has changed (not just name)
    const contentHasChanged = content !== note.content;
    
    setIsSaving(true);
    updateNoteMutation.mutate(
      { noteId: note.id, payload: { name, content } },
      {
        onSuccess: () => {
          setIsSaving(false);
          // Mark flashcards as needing update if content changed
          if (contentHasChanged && noteId) {
            markFlashcardsAsNeedingUpdateMutation.mutate(noteId);
          }
        },
        onError: () => setIsSaving(false),
      },
    );
  };

  const handleDelete = () => {
    if (!note) return;
    deleteNoteMutation.mutate(note.id, {
      onSuccess: () => {
        navigate(`/project/${projectId}`);
      },
    });
  };

  const handleAddLibraryItem = (libraryItemId: string) => {
    if (!noteId) return;
    addLibraryItemMutation.mutate({ noteId, libraryItemId });
  };

  const handleRemoveLibraryItem = (libraryItemId: string) => {
    if (!noteId) return;
    removeLibraryItemMutation.mutate({ noteId, libraryItemId });
  };



  const hasUnsavedChanges = note && (content !== note.content || name !== note.name);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl font-medium text-foreground-secondary">Loading Note...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl font-medium text-status-error">Error loading note.</div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-2xl font-medium text-foreground-secondary">Note not a found.</div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-12 font-helvetica"
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-x-8 gap-y-4">
              <textarea
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Untitled Note"
                className="w-full xl:flex-grow text-3xl lg:text-5xl font-bold text-foreground bg-transparent focus:outline-none placeholder-foreground-muted transition-colors duration-200 resize-none overflow-hidden"
                rows={1}
              />
              <div className="w-full xl:w-auto xl:max-w-xs flex flex-col items-stretch gap-2 flex-shrink-0">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm text-foreground-tertiary mr-2">
                    {isSaving
                      ? 'Saving...'
                      : note.updatedAt && `Saved ${new Date(note.updatedAt).toLocaleString()}`}
                  </span>

                  <button
                    type="button"
                    onClick={handleManualSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 ${
                      hasUnsavedChanges && !isSaving
                        ? 'text-primary-blue hover:text-primary-blue/80 hover:bg-blue-50'
                        : 'text-foreground-muted cursor-not-allowed opacity-50'
                    }`}
                    aria-label="Save Note"
                  >
                    <Save className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-foreground-muted hover:text-status-error rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-2"
                    aria-label="Delete Note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {/* Attached Library Items */}
                <div className="mt-4">
                  {note.libraryItems && note.libraryItems.length > 0 ? (
                    <div className="relative">
                      <div
                        className="flex items-center justify-between cursor-pointer hover:bg-background-alt p-2 rounded-lg"
                        onClick={() => setShowAttachedFiles(!showAttachedFiles)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setShowAttachedFiles(!showAttachedFiles);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-foreground-muted" />
                          <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
                            Attached Files
                          </h3>
                          <span className="text-sm font-normal text-foreground-muted">
                            ({note.libraryItems.length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent toggling the list
                              openLibraryModal();
                            }}
                            className="p-1 text-foreground-muted hover:text-primary-blue rounded-full transition-all duration-200"
                            aria-label="Add or manage attached files"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          {showAttachedFiles ? (
                            <ChevronUp className="w-5 h-5 text-foreground-muted" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-foreground-muted" />
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {showAttachedFiles && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-2 w-full bg-surface shadow-floating rounded-lg p-2 z-dropdown border border-divider"
                          >
                            <div className="flex flex-wrap gap-2">
                              {note.libraryItems.map((item: LibraryItem) => (
                                <div
                                  key={item.id}
                                  className="bg-background-alt p-2 rounded-lg text-sm text-foreground-secondary flex items-center gap-2"
                                >
                                  <span>{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={openLibraryModal}
                      className="w-full flex items-center justify-center gap-2 p-2 text-foreground-muted hover:text-primary-blue rounded-xl transition-all duration-200 bg-background-alt hover:bg-background-alt-hover"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Assets</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <textarea
            ref={contentTextAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full flex-1 text-lg text-foreground-secondary leading-relaxed bg-transparent resize-none focus:outline-none placeholder-foreground-muted transition-colors duration-200"
          />
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background-overlay flex items-center justify-center z-modal">
          <div className="bg-surface rounded-2xl p-6 max-w-md w-full mx-4 shadow-floating-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Delete Note</h3>
            <p className="text-foreground-secondary mb-6">
              Are you sure you want to delete &quot;{note.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-foreground-secondary hover:text-foreground transition-colors duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteNoteMutation.isPending}
                className="px-4 py-2 bg-status-error text-foreground-inverse rounded-xl hover:bg-status-error/90 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-status-error focus:ring-offset-2"
              >
                {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
