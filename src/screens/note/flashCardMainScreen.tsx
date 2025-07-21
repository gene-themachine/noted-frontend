import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Play, Plus, RefreshCw, Paperclip, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useFlashcardsByNote, useAddLibraryItemToFlashcard, useRemoveLibraryItemFromFlashcard } from '../../hooks/flashcard';
import { Button } from '../../components/ui/button';
import { useNote } from '../../hooks/note';
import { useProjectLibraryItems } from '../../hooks/library';
import { Flashcard, LibraryItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import AddLibraryItemModalFlashcard from '../../components/common/addLibraryItemModalFlashcard';

export default function FlashCardMainScreen() {
  const { noteId, projectId } = useParams<{ noteId: string; projectId: string }>();
  const navigate = useNavigate();
  
  const { data: flashcardsData, isLoading, error } = useFlashcardsByNote(noteId!);
  const { data: note } = useNote(noteId!);
  const { data: projectLibrary } = useProjectLibraryItems(projectId!);
  const addLibraryItemMutation = useAddLibraryItemToFlashcard();
  const removeLibraryItemMutation = useRemoveLibraryItemFromFlashcard();
  
  const [showAttachedFiles, setShowAttachedFiles] = useState(false);
  const [isFlashcardLibraryModalOpen, setIsFlashcardLibraryModalOpen] = useState(false);

  const flashcards = useMemo(() => flashcardsData?.flashcards || [], [flashcardsData]);
  const libraryItems = useMemo(() => note?.libraryItems || [], [note]);
  
  // Get unique library items attached to any flashcard
  const flashcardLibraryItems = useMemo(() => {
    const itemsSet = new Set();
    const uniqueItems: LibraryItem[] = [];
    
    flashcards.forEach((flashcard: Flashcard) => {
      flashcard.libraryItems?.forEach((item: LibraryItem) => {
        if (!itemsSet.has(item.id)) {
          itemsSet.add(item.id);
          uniqueItems.push(item);
        }
      });
    });
    
    return uniqueItems;
  }, [flashcards]);

  const handleAddLibraryItemToFlashcard = (libraryItemId: string) => {
    // For now, add to the first flashcard. In a real app, you might want to let users choose
    if (flashcards.length > 0) {
      addLibraryItemMutation.mutate({ 
        flashcardId: flashcards[0].id, 
        libraryItemId 
      });
    }
  };

  const handleRemoveLibraryItemFromFlashcard = (libraryItemId: string) => {
    // Remove from all flashcards that have this item
    flashcards.forEach((flashcard: Flashcard) => {
      if (flashcard.libraryItems?.some((item: LibraryItem) => item.id === libraryItemId)) {
        removeLibraryItemMutation.mutate({
          flashcardId: flashcard.id,
          libraryItemId
        });
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex items-center gap-3 text-foreground-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading flashcards...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground-secondary">
        <div className="text-lg mb-4">Error loading flashcards</div>
        <div className="text-sm">Please try again later</div>
      </div>
    );
  }

  const handleStartStudy = () => {
    navigate(`/project/${projectId}/note/${noteId}/flashcards/study`);
  };

  const handleCreateFlashcards = () => {
    // This could trigger the flashcard creation modal
    // For now, navigate back to note screen where they can create flashcards
    navigate(`/project/${projectId}/note/${noteId}`);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-xl font-semibold text-foreground mb-2">Flashcards</h1>
        {note && (
          <p className="text-sm text-gray-500">
            {note.name}
          </p>
        )}
      </div>

      {flashcardLibraryItems.length > 0 && (
        <div className="mb-8">
          <div
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
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
              <Paperclip className="w-4 h-4 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Flashcard Assets
              </h3>
              <span className="text-xs font-normal text-gray-500">
                ({flashcardLibraryItems.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlashcardLibraryModalOpen(true);
                }}
                className="p-1 text-gray-500 hover:text-primary-blue rounded-full transition-all duration-200"
                aria-label="Manage flashcard assets"
              >
                <Plus className="w-4 h-4" />
              </button>
              {showAttachedFiles ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {showAttachedFiles && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                  {flashcardLibraryItems.map((item: LibraryItem) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 p-2 rounded-lg text-xs text-gray-700 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {flashcards.length > 0 && flashcardLibraryItems.length === 0 && (
        <div className="mb-8">
          <button
            onClick={() => setIsFlashcardLibraryModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-2 text-gray-500 hover:text-primary-blue rounded-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200"
          >
            <Plus className="w-5 h-5" />
            <span>Add Assets to Flashcards</span>
          </button>
        </div>
      )}
      
      {flashcards.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-6">
            No flashcards yet
          </h2>
          <Button
            onClick={handleCreateFlashcards}
            className="flex items-center gap-2 bg-primary-blue hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4" />
            Create Flashcards
          </Button>
        </div>
      ) : (
        /* Flashcards List */
        <div className="flex-1">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-foreground-secondary">
              {flashcards.length} flashcards
            </div>
            <Button
              onClick={handleStartStudy}
              className="flex items-center gap-2 bg-primary-blue hover:bg-blue-600 text-white"
            >
              <Play className="w-4 h-4" />
              Learn
            </Button>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {flashcards.map((flashcard: Flashcard, index: number) => (
              <div
                key={flashcard.id}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary-blue hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={handleStartStudy}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                  {flashcard.needsUpdate && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </div>
                <h3 className="font-medium text-foreground text-sm leading-relaxed line-clamp-3">
                  {flashcard.term}
                </h3>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleCreateFlashcards}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-blue transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create more
            </button>
          </div>
        </div>
      )}

      {/* Flashcard Library Modal */}
      <AddLibraryItemModalFlashcard
        isOpen={isFlashcardLibraryModalOpen}
        onClose={() => setIsFlashcardLibraryModalOpen(false)}
        projectLibrary={projectLibrary || []}
        flashcardLibrary={flashcardLibraryItems}
        onAddItem={handleAddLibraryItemToFlashcard}
        onRemoveItem={handleRemoveLibraryItemFromFlashcard}
      />
    </div>
  );
}