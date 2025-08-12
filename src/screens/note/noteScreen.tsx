import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './noteEditor.css';
import {
  Trash2,
  Save,
  Paperclip,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { IndentExtension } from '../../extensions/indentExtension';
import { QABlockExtension, QAParagraph } from '../../extensions/qaBlockExtension';
import { useNote, useUpdateNote, useDeleteNote } from '../../hooks/note';
import { useMarkFlashcardsAsNeedingUpdate } from '../../hooks/flashcard';
import { useStreamQA } from '../../hooks/qa';
import { LibraryItem } from '../../types';
import FloatingToolbar from '../../components/editor/FloatingToolbar';

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
  const markFlashcardsAsNeedingUpdateMutation = useMarkFlashcardsAsNeedingUpdate();
  const { startStream, stopStream } = useStreamQA();

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [toolbarKey, setToolbarKey] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<{ name: string; content: string } | null>(null);

  const nameInputRef = useRef<HTMLTextAreaElement>(null);
  const isMountedRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Configure custom underline with keyboard shortcuts
  const CustomUnderline = Underline.extend({
    name: 'customUnderline', // Give it a unique name
    addKeyboardShortcuts() {
      return {
        'Mod-u': () => this.editor.commands.toggleUnderline(),
        'Mod-U': () => this.editor.commands.toggleUnderline(), // For caps lock
      }
    },
  });

  // Initialize Tiptap editor only when we have note data
  const editor = useEditor({
    extensions: [
      StarterKit,
      QAParagraph, // Extend paragraph with data-qa-id support
      CustomUnderline,
      IndentExtension,
      QABlockExtension,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (isMountedRef.current) {
        const htmlContent = editor.getHTML();
        setContent(htmlContent);
      }
    },
    onTransaction: () => {
      // Force re-render to update toolbar state immediately
      if (isMountedRef.current) {
        setToolbarKey(prev => prev + 1);
      }
    },
    editorProps: {
      attributes: {
        class: 'w-full text-base text-foreground-secondary leading-relaxed bg-transparent focus:outline-none p-4 border-none min-h-[400px] font-helvetica tiptap-editor',
        style: 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 1rem; line-height: 1.75; color: rgb(31 41 55);',
      },
    },
  }, [noteId]); // Only recreate when switching notes

  // Auto-resize textarea function for name only
  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (nameInputRef.current) {
      autoResizeTextarea(nameInputRef.current);
    }
  }, [name]);

  // Stabilized event handler callback
  const handleQABlockInserted = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const { id, question } = customEvent.detail;
    console.log('🤔 Q&A block inserted:', { id, question, noteId });
    
    if (!noteId || !id || !question) {
      console.error('❌ Missing required parameters for Q&A:', { noteId, id, question });
      return;
    }

    // Generate Q&A answer using streaming
    console.log('🚀 Starting Q&A streaming...');
    startStream(
      {
        noteId,
        qaBlockId: id,
        question,
      },
      // onChunk: Update the Q&A block with accumulated answer
      (chunk: string, accumulatedAnswer: string) => {
        console.log('📄 Received chunk:', { chunk, accumulatedLength: accumulatedAnswer.length });
        if (editor) {
          editor.commands.updateQABlock(id, {
            status: 'loading',
            answer: accumulatedAnswer,
          });
        }
      },
      // onComplete: Mark as completed
      (finalAnswer: string) => {
        console.log('✅ Q&A streaming completed:', { finalLength: finalAnswer.length });
        if (editor) {
          editor.commands.updateQABlock(id, {
            status: 'completed',
            answer: finalAnswer,
          });
        }
      },
      // onError: Show error
      (error: string) => {
        console.error('❌ Q&A streaming error:', error);
        if (editor) {
          editor.commands.updateQABlock(id, {
            status: 'error',
            errorMessage: error,
          });
        }
      }
    );
  }, [noteId, editor, startStream]);

  // Handle Q&A block insertion
  useEffect(() => {

    window.addEventListener('qa-block-inserted', handleQABlockInserted as EventListener);
    return () => {
      window.removeEventListener('qa-block-inserted', handleQABlockInserted as EventListener);
    };
  }, [handleQABlockInserted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);


  // Initialize state when note loads or changes
  useEffect(() => {
    if (note) {
      setName(note.name);
      setContent(note.content);
      setLastSavedContent({ name: note.name, content: note.content });
      setSaveError(false);
      retryCountRef.current = 0;
      
      // Update editor content when switching notes
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(note.content);
      }
    }
  }, [note?.id, editor]); // Only when switching notes
  
  // Sync state back after successful saves (when note data updates but ID stays same)
  useEffect(() => {
    if (note && note.content !== content) {
      // Note was updated (likely from save), sync back the content
      setContent(note.content);
      if (editor && !editor.isFocused && !editor.isDestroyed) {
        editor.commands.setContent(note.content);
      }
    }
    if (note && note.name !== name && document.activeElement !== nameInputRef.current) {
      // Note name was updated, sync back (but don't overwrite if user is typing)
      setName(note.name);
    }
  }, [note?.updatedAt]); // Sync when note is updated (after saves)

  // Save content to localStorage as backup
  useEffect(() => {
    if (noteId && content && name) {
      const backupData = { noteId, name, content, timestamp: Date.now() };
      localStorage.setItem(`note-backup-${noteId}`, JSON.stringify(backupData));
    }
  }, [noteId, name, content]);

  // Restore from localStorage if needed
  useEffect(() => {
    if (noteId && note && !content && !name) {
      const backupKey = `note-backup-${noteId}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        try {
          const backupData = JSON.parse(backup);
          if (backupData.noteId === noteId && backupData.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
            toast('Restored unsaved changes from backup', {
              icon: '💾',
              duration: 3000,
            });
            setName(backupData.name);
            setContent(backupData.content);
            if (editor && !editor.isDestroyed) {
              editor.commands.setContent(backupData.content);
            }
          }
        } catch (e) {
          console.error('Failed to restore backup:', e);
        }
      }
    }
  }, [noteId, note]);

  // Robust save function with retry mechanism
  const performSave = useCallback(async (retryCount = 0) => {
    if (!note || !noteId || !isMountedRef.current) return;

    const contentHasChanged = content !== (lastSavedContent?.content ?? note.content);
    const nameHasChanged = name !== (lastSavedContent?.name ?? note.name);

    if (!contentHasChanged && !nameHasChanged) return;

    console.log(`💾 Saving note (attempt ${retryCount + 1})...`);
    setIsSaving(true);
    setSaveError(false);

    try {
      await updateNoteMutation.mutateAsync(
        { noteId: note.id, payload: { name, content } }
      );

      if (isMountedRef.current) {
        setLastSavedContent({ name, content });
        retryCountRef.current = 0;
        setSaveError(false);
        setIsSaving(false);
        
        // Clear localStorage backup on successful save
        localStorage.removeItem(`note-backup-${noteId}`);
        
        // Show success toast for manual saves or after retry
        if (retryCount > 0) {
          toast.success('Note saved successfully', {
            duration: 2000,
            icon: <CheckCircle className="w-4 h-4" />,
          });
        }

        // Mark flashcards as needing update if content changed
        if (contentHasChanged && noteId) {
          markFlashcardsAsNeedingUpdateMutation.mutate(noteId);
        }
      }
    } catch (error) {
      console.error('❌ Save failed:', error);
      
      if (isMountedRef.current) {
        setSaveError(true);
        setIsSaving(false);

        // Implement exponential backoff retry
        if (retryCount < 3) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
          toast.error(`Save failed. Retrying in ${delay / 1000}s...`, {
            duration: delay,
            icon: <AlertCircle className="w-4 h-4" />,
          });
          
          setTimeout(() => {
            if (isMountedRef.current) {
              performSave(retryCount + 1);
            }
          }, delay);
        } else {
          toast.error('Failed to save note. Please try again manually.', {
            duration: 5000,
            icon: <AlertCircle className="w-4 h-4" />,
          });
        }
      }
    }
  }, [note, noteId, name, content, lastSavedContent, updateNoteMutation, markFlashcardsAsNeedingUpdateMutation]);

  // Debounced save for note content and title
  useEffect(() => {
    // Do not save if the note is not loaded yet
    if (!note || !noteId) return;
    
    // Don't save if content/name are still empty (initial state)
    if (!content && !name) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      performSave();
    }, 800); // 0.8-second debounce delay

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, name, performSave]);

  // Periodic auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSavedContent && (content !== lastSavedContent.content || name !== lastSavedContent.name)) {
        console.log('⏰ Periodic auto-save triggered');
        performSave();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [lastSavedContent, content, name, performSave]);

  // Force save on unmount
  useEffect(() => {
    return () => {
      if (isMountedRef.current && lastSavedContent && 
          (content !== lastSavedContent.content || name !== lastSavedContent.name)) {
        console.log('🚪 Force save on unmount');
        // Use synchronous save or beacon API here if needed
        performSave();
      }
    };
  }, []);

  const handleManualSave = () => {
    if (!note || !isMountedRef.current) return;
    
    toast.promise(
      performSave(),
      {
        loading: 'Saving...',
        success: 'Note saved successfully',
        error: 'Failed to save note',
      },
      {
        duration: 2000,
      }
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


  const handleInsertFormat = (formatType: string) => {
    if (!editor) {
      return;
    }

    editor.chain().focus();

    switch (formatType) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'underline':
        editor.chain().focus().toggleUnderline().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      default:
        break;
    }
  };

  const hasUnsavedChanges = lastSavedContent 
    ? (content !== lastSavedContent.content || name !== lastSavedContent.name)
    : (note && (content !== note.content || name !== note.name));

  // Debug logging for save status
  useEffect(() => {
    console.log('📊 Save Status Debug:', {
      hasUnsavedChanges,
      isSaving,
      saveError,
      contentMatch: content === (lastSavedContent?.content ?? note?.content),
      nameMatch: name === (lastSavedContent?.name ?? note?.name),
    });
  }, [hasUnsavedChanges, isSaving, saveError, content, name, lastSavedContent, note]);

  if (isLoading || !note) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-medium text-foreground-secondary">Loading Note...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-medium text-status-error">Error loading note.</div>
      </div>
    );
  }

  // Wait for editor to be initialized with note content and title to be loaded
  if (!editor || !name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-medium text-foreground-secondary">Initializing editor...</div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 md:p-6 lg:p-8 xl:p-12 font-helvetica"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-x-8 gap-y-4">
              <textarea
                ref={nameInputRef}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  autoResizeTextarea(e.target);
                }}
                placeholder="Untitled Note"
                className="w-full xl:flex-grow text-3xl lg:text-5xl font-bold text-foreground bg-transparent focus:outline-none placeholder-foreground-muted transition-colors duration-200 resize-none overflow-hidden min-h-[3rem]"
                rows={1}
              />
              <div className="w-full xl:w-auto xl:max-w-xs flex flex-col items-stretch gap-2 flex-shrink-0">
                <div className="flex items-center justify-end gap-2">
                  {(isSaving || saveError || hasUnsavedChanges) && (
                    <span className={`text-sm mr-2 flex items-center gap-1 ${
                      saveError ? 'text-status-error' : 'text-foreground-tertiary'
                    }`}>
                      {isSaving ? (
                        <>
                          <div className="w-3 h-3 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : saveError ? (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Save failed
                        </>
                      ) : hasUnsavedChanges ? (
                        <>
                          <div className="w-2 h-2 bg-amber-500 rounded-full" />
                          Unsaved changes
                        </>
                      ) : null}
                    </span>
                  )}

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
                    title={saveError ? 'Click to retry save' : 'Save Note'}
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

          {/* Editor - Single Consolidated Editor */}
          <div className="w-full">
            <EditorContent editor={editor} />
          </div>
        </div>
      </motion.div>

      {/* Floating Toolbar */}
      <FloatingToolbar key={toolbarKey} onInsertFormat={handleInsertFormat} editor={editor} />

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
