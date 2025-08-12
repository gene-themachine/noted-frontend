import { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import FlashCardComponent from '../../components/mainWindow/flashCardComponent';
import { useFlashcardSet } from '../../hooks/studySets';

export default function FlashcardSetStudyScreen() {
  const { projectId, setId } = useParams<{ projectId: string; setId: string }>();
  const navigate = useNavigate();
  
  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId || null);

  const handleBack = () => {
    navigate(`/project/${projectId}/study-sets/flashcards/${setId}`);
  };

  const handleStudyComplete = useCallback(() => {
    console.log('Study session completed for flashcard set:', setId);
    // For project-level sets, we don't need to update study options
    // Could potentially track completion statistics here
  }, [setId]);

  const handleStudyFailed = useCallback(() => {
    console.log('Study session failed for flashcard set:', setId);
    // For project-level sets, we don't need to update study options
    // Could potentially track failure statistics here
  }, [setId]);

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

  if (error || !flashcardSet) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">Error loading flashcard set</div>
        <div className="text-sm mb-6">Please try again later</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flashcard Set
        </button>
      </div>
    );
  }

  const flashcards = flashcardSet.flashcards || [];

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-lg mb-4 text-foreground">No flashcards available</div>
        <div className="text-sm text-foreground-secondary mb-6">
          This flashcard set doesn't have any cards to study yet.
        </div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flashcard Set
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
      <FlashCardComponent 
        flashcards={flashcards} 
        onComplete={handleStudyComplete}
        onFail={handleStudyFailed}
      />
    </div>
  );
}