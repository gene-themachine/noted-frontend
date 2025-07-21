import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '../../types';

interface FlashCardComponentProps {
  flashcards: Flashcard[];
  onClose?: () => void;
}

const FlashCardComponent: React.FC<FlashCardComponentProps> = ({ 
  flashcards, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-foreground-secondary">
        <div className="text-lg mb-4">No flashcards available</div>
        <div className="text-sm">Create some flashcards to start studying!</div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  const [direction, setDirection] = useState(0);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCardClick = () => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  const isFlipped = flippedCards.has(currentIndex);

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
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-8">
      {/* Progress indicator */}
      <motion.div 
        className="mb-8 text-lg font-bold text-foreground tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentIndex + 1} of {flashcards.length}
      </motion.div>

      {/* Flashcard */}
      <div className="relative w-full max-w-lg aspect-square mb-8">
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
        className="flex items-center justify-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={`
            w-12 h-12 rounded-full shadow-lg transition-all duration-200 
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
            w-12 h-12 rounded-full shadow-lg transition-all duration-200 
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
  );
};

export default FlashCardComponent;
