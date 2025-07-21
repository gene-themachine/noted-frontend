import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import FlashCardComponent from '../../components/mainWindow/flashCardComponent';
import { useFlashcardsByNote } from '../../hooks/flashcard';
import { useNote } from '../../hooks/note';


export default function FlashcardScreen() {
  const { noteId, projectId } = useParams<{ noteId: string; projectId: string }>();
  const navigate = useNavigate();
  
  const { data: flashcardsData, isLoading, error } = useFlashcardsByNote(noteId!);
  const { data: note } = useNote(noteId!);

  const handleBack = () => {
    navigate(`/project/${projectId}/note/${noteId}/flashcards`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-foreground-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading flashcards...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">Error loading flashcards</div>
        <div className="text-sm mb-6">Please try again later</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flashcards
        </button>
      </div>
    );
  }

  const flashcards = flashcardsData?.flashcards || [];

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-lg mb-4 text-foreground">No flashcards available</div>
                 <div className="text-sm text-foreground-secondary mb-6">
           Create some flashcards from your note to start learning!
         </div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flashcards
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      

      {/* Flashcard Component */}
      <FlashCardComponent flashcards={flashcards} />
    </div>
  );
}