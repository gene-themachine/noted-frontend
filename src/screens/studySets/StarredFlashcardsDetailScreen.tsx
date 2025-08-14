import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStarredFlashcards, useStarFlashcard, useUnstarFlashcard } from '../../hooks/studySets';

export default function StarredFlashcardsDetailScreen() {
  const { projectId, cardId } = useParams<{ projectId: string; cardId: string }>();
  const navigate = useNavigate();
  
  const { data: starredFlashcards, isLoading, error } = useProjectStarredFlashcards(projectId || null);
  const starFlashcard = useStarFlashcard();
  const unstarFlashcard = useUnstarFlashcard();
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  
  const flashcards = useMemo(() => starredFlashcards || [], [starredFlashcards]);
  
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
  
  // Check if current flashcard is starred (should always be true for this screen)
  const isCurrentFlashcardStarred = useMemo(() => {
    if (!currentFlashcard || !flashcards) return false;
    return flashcards.some((card: any) => card.id === currentFlashcard.id);
  }, [currentFlashcard, flashcards]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      const prevCard = flashcards[currentIndex - 1];
      navigate(`/project/${projectId}/starred-flashcards/study/${prevCard.id}`);
      setIsFlipped(false);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      const nextCard = flashcards[currentIndex + 1];
      navigate(`/project/${projectId}/starred-flashcards/study/${nextCard.id}`);
      setIsFlipped(false);
    }
  };
  
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}/starred-flashcards`);
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
          Loading starred flashcards...
        </div>
      </div>
    );
  }
  
  if (error || !flashcards.length || !currentFlashcard) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">No starred flashcards found</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Starred Flashcards
        </button>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
    }),
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden px-2 py-1 md:px-4 md:py-2">
      {/* Header with back button and star button */}
      <motion.div
        className="w-full flex justify-between items-center mb-1 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Starred
        </motion.button>

        <motion.button
          onClick={handleStarToggle}
          disabled={starFlashcard.isPending || unstarFlashcard.isPending}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-xs
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
            className={`w-3 h-3 transition-colors ${isCurrentFlashcardStarred ? 'fill-current' : ''}`} 
          />
          {isCurrentFlashcardStarred ? 'Starred' : 'Star'}
        </motion.button>
      </motion.div>

      {/* Content container - centered and constrained */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Progress indicator with source flashcard set */}
        <motion.div 
          className="mb-4 md:mb-6 text-center flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm md:text-base font-bold text-foreground tracking-wider">
            {currentIndex + 1} of {flashcards.length}
          </div>
          {currentFlashcard.flashcardSet && (
            <div className="text-xs text-foreground-secondary mt-1">
              From: {currentFlashcard.flashcardSet.name}
            </div>
          )}
        </motion.div>

      {/* Flashcard */}
      <div className="relative w-full max-w-lg aspect-[4/5] max-h-[55vh] md:max-h-[60vh] flex-shrink-0">
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
              stiffness: 400,
              damping: 30,
              mass: 0.5,
            }}
            className="absolute inset-0"
          >
            <motion.div 
              className="relative w-full h-full cursor-pointer"
              onClick={handleCardClick}
              animate={{ y: isFlipped ? -10 : 0 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.6,
              }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <AnimatePresence mode="wait">
                {!isFlipped ? (
                  <motion.div
                    key="term"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl shadow-xl flex items-center justify-center p-6 md:p-8">
                      <div className="text-white text-xl md:text-2xl font-semibold text-center leading-relaxed overflow-auto max-h-full">
                        {currentFlashcard.term}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="definition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl shadow-xl flex items-center justify-center p-6 md:p-8">
                      <div className="text-white text-base md:text-lg text-center leading-relaxed overflow-auto max-h-full">
                        {currentFlashcard.definition}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div 
        className="flex items-center justify-center gap-4 md:gap-6 mt-2 md:mt-3 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`
            w-10 h-10 md:w-11 md:h-11 rounded-full shadow-lg transition-all duration-200 
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
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className={`
            w-10 h-10 md:w-11 md:h-11 rounded-full shadow-lg transition-all duration-200 
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
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </motion.div>
      </div>
    </div>
  );
}