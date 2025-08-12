import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcardSet, useProjectStarredFlashcards, useStarFlashcard, useUnstarFlashcard } from '../../hooks/studySets';

export default function FlashcardDetailScreen() {
  const { projectId, setId, cardId } = useParams<{ projectId: string; setId: string; cardId: string }>();
  const navigate = useNavigate();
  
  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId || null);
  const { data: starredFlashcards = [] } = useProjectStarredFlashcards(projectId || null);
  const starFlashcard = useStarFlashcard();
  const unstarFlashcard = useUnstarFlashcard();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  
  const flashcards = useMemo(() => flashcardSet?.flashcards || [], [flashcardSet]);
  
  // Find current flashcard and its index
  const currentIndex = useMemo(() => {
    if (cardId) {
      return flashcards.findIndex((card: any) => card.id === cardId);
    }
    return 0; // Start from first card if no specific card ID
  }, [flashcards, cardId]);
  
  const currentFlashcard = useMemo(() => {
    return flashcards[currentIndex];
  }, [flashcards, currentIndex]);
  
  // Check if current flashcard is starred
  const isCurrentFlashcardStarred = useMemo(() => {
    if (!currentFlashcard || !starredFlashcards) return false;
    return starredFlashcards.some((starred: any) => starred.id === currentFlashcard.id);
  }, [currentFlashcard, starredFlashcards]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      const prevCard = flashcards[currentIndex - 1];
      navigate(`/project/${projectId}/study-sets/flashcards/${setId}/study/${prevCard.id}`);
      setIsFlipped(false);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      const nextCard = flashcards[currentIndex + 1];
      navigate(`/project/${projectId}/study-sets/flashcards/${setId}/study/${nextCard.id}`);
      setIsFlipped(false);
    }
  };
  
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}/study-sets/flashcards/${setId}`);
  };

  const handleStarToggle = () => {
    if (!currentFlashcard || !projectId) return;
    
    if (isCurrentFlashcardStarred) {
      unstarFlashcard.mutate({ projectId, flashcardId: currentFlashcard.id });
    } else {
      starFlashcard.mutate({ projectId, flashcardId: currentFlashcard.id });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-foreground-secondary">
          Loading flashcard...
        </div>
      </div>
    );
  }
  
  if (error || !flashcardSet || !currentFlashcard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">Flashcard not found</div>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.94,
    }),
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden p-4 md:p-6">
      {/* Header with back button and star button */}
      <motion.div
        className="w-full flex justify-between items-center mb-2 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flashcards
        </motion.button>

        <motion.button
          onClick={handleStarToggle}
          disabled={starFlashcard.isPending || unstarFlashcard.isPending}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm
            ${isCurrentFlashcardStarred 
              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
            ${(starFlashcard.isPending || unstarFlashcard.isPending) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star 
            className={`w-4 h-4 transition-colors ${isCurrentFlashcardStarred ? 'fill-current' : ''}`} 
          />
          {isCurrentFlashcardStarred ? 'Starred' : 'Star'}
        </motion.button>
      </motion.div>

      {/* Content container - centered and constrained */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Progress indicator */}
        <motion.div 
          className="mb-4 text-base md:text-lg font-bold text-foreground tracking-wider flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentIndex + 1} of {flashcards.length}
        </motion.div>

      {/* Flashcard */}
      <div className="relative w-full max-w-lg aspect-square flex-shrink-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 0.8,
            }}
            className="absolute inset-0"
          >
            <div 
              className="relative w-full h-full cursor-pointer perspective-1000"
              onClick={handleCardClick}
            >
              <motion.div
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  mass: 0.6,
                }}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
              >
                {/* Front of card (Term) */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="w-full h-full bg-primary-blue rounded-3xl shadow-xl flex items-center justify-center p-8">
                    <div className="text-white text-2xl font-semibold text-center leading-relaxed">
                      {currentFlashcard.term}
                    </div>
                  </div>
                </div>

                {/* Back of card (Definition) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl shadow-xl flex items-center justify-center p-8">
                    <div className="text-white text-lg text-center leading-relaxed">
                      {currentFlashcard.definition}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex items-center justify-center gap-6 mt-4 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`
            w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg transition-all duration-200 
            flex items-center justify-center
            ${currentIndex === 0 
              ? 'bg-surface text-foreground-muted cursor-not-allowed' 
              : 'bg-white text-gray-700'
            }
          `}
          whileHover={currentIndex === 0 ? {} : { 
            scale: 1.1, 
            backgroundColor: "#f9fafb",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          whileTap={currentIndex === 0 ? {} : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className={`
            w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg transition-all duration-200 
            flex items-center justify-center
            ${currentIndex === flashcards.length - 1
              ? 'bg-surface text-foreground-muted cursor-not-allowed' 
              : 'bg-white text-gray-700'
            }
          `}
          whileHover={currentIndex === flashcards.length - 1 ? {} : { 
            scale: 1.1, 
            backgroundColor: "#f9fafb",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          whileTap={currentIndex === flashcards.length - 1 ? {} : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>
      </div>
    </div>
  );
}