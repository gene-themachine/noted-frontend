import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, RefreshCw, ArrowLeft, BookOpen, Play } from 'lucide-react';
import { useProjectStarredFlashcards } from '../../hooks/studySets';
import { Button } from '../../components/ui/button';

export default function StarredFlashcardsScreen() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const { data: starredFlashcards, isLoading, error } = useProjectStarredFlashcards(projectId || null);
  
  const flashcards = useMemo(() => starredFlashcards || [], [starredFlashcards]);

  const handleBack = () => {
    navigate(`/project/${projectId}/tools`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex items-center gap-3 text-foreground-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading starred flashcards...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-foreground-secondary">
        <div className="text-lg mb-4">Error loading starred flashcards</div>
        <div className="text-sm mb-6">Unable to load your starred flashcards at this time.</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </button>
      </div>
    );
  }

  const handleFlashcardClick = (flashcard: any) => {
    // Navigate to the flashcard's set and then to the specific flashcard
    navigate(`/project/${projectId}/study-sets/flashcards/${flashcard.flashcardSet.id}/study/${flashcard.id}`);
  };

  const handleStartStudy = () => {
    navigate(`/project/${projectId}/starred-flashcards/study`);
  };

  return (
    <div className="flex flex-col h-full p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <h1 className="text-xl font-semibold text-foreground">Starred Flashcards</h1>
        </div>
        <p className="text-sm text-gray-500">
          Your favorite flashcards from all sets
        </p>
      </div>
      
      {flashcards.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-6">
            No starred flashcards yet
          </h2>
          <p className="text-sm text-foreground-secondary mb-6">
            Star flashcards from your study sets to see them here.
          </p>
        </div>
      ) : (
        /* Starred Flashcards List */
        <div className="flex-1">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-foreground-secondary">
              {flashcards.length} starred flashcard{flashcards.length !== 1 ? 's' : ''}
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
            {flashcards.map((flashcard: any, index: number) => (
              <div
                key={flashcard.id}
                className="group bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary-blue hover:shadow-sm transition-all duration-200 cursor-pointer relative"
                onClick={() => handleFlashcardClick(flashcard)}
              >
                {/* Star indicator */}
                <div className="absolute top-3 right-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                  {flashcard.needsUpdate && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </div>
                
                <h3 className="font-medium text-foreground text-sm leading-relaxed line-clamp-3 pr-6">
                  {flashcard.term}
                </h3>
                
                {/* Show which flashcard set this is from */}
                {flashcard.flashcardSet && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 truncate">
                        {flashcard.flashcardSet.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}