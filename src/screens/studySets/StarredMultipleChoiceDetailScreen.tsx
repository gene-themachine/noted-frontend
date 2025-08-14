import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStarredMultipleChoiceQuestions, useStarMultipleChoiceQuestion, useUnstarMultipleChoiceQuestion } from '../../hooks/studySets';

export default function StarredMultipleChoiceDetailScreen() {
  const { projectId, questionId } = useParams<{ projectId: string; questionId: string }>();
  const navigate = useNavigate();
  
  const { data: starredQuestions, isLoading, error } = useProjectStarredMultipleChoiceQuestions(projectId || null);
  const starQuestion = useStarMultipleChoiceQuestion();
  const unstarQuestion = useUnstarMultipleChoiceQuestion();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(0);
  
  const questions = useMemo(() => starredQuestions || [], [starredQuestions]);
  
  // Find current question and its index
  const currentIndex = useMemo(() => {
    if (questionId) {
      return questions.findIndex((question: any) => question.id === questionId);
    }
    return 0; // Start from first question if no specific question ID
  }, [questions, questionId]);
  
  const currentQuestion = useMemo(() => {
    return questions[currentIndex];
  }, [questions, currentIndex]);
  
  // Check if current question is starred (should always be true for this screen)
  const isCurrentQuestionStarred = useMemo(() => {
    if (!currentQuestion || !questions) return false;
    return questions.some((question: any) => question.id === currentQuestion.id);
  }, [currentQuestion, questions]);
  
  // Parse answer choices and correct answer
  const answerChoices = useMemo(() => {
    if (!currentQuestion?.answer) return [];
    try {
      const parsed = JSON.parse(currentQuestion.answer);
      return parsed.choices || [];
    } catch {
      return [];
    }
  }, [currentQuestion?.answer]);
  
  const correctAnswer = useMemo(() => {
    if (!currentQuestion?.answer) return '';
    try {
      const parsed = JSON.parse(currentQuestion.answer);
      return parsed.correct || '';
    } catch {
      return '';
    }
  }, [currentQuestion?.answer]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      const prevQuestion = questions[currentIndex - 1];
      navigate(`/project/${projectId}/starred-multiple-choice-questions/study/${prevQuestion.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      const nextQuestion = questions[currentIndex + 1];
      navigate(`/project/${projectId}/starred-multiple-choice-questions/study/${nextQuestion.id}`);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleBack = () => {
    navigate(`/project/${projectId}/starred-multiple-choice-questions`);
  };

  const handleStarToggle = () => {
    if (!currentQuestion || !projectId) return;
    
    if (isCurrentQuestionStarred) {
      unstarQuestion.mutate({ projectId, questionId: currentQuestion.id });
    } else {
      starQuestion.mutate({ projectId, questionId: currentQuestion.id });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-foreground-secondary">
          Loading starred multiple choice questions...
        </div>
      </div>
    );
  }
  
  if (error || !questions.length || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">No starred multiple choice questions found</div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-foreground hover:text-foreground-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Starred Questions
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
          disabled={starQuestion.isPending || unstarQuestion.isPending}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-xs
            ${isCurrentQuestionStarred 
              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
            ${(starQuestion.isPending || unstarQuestion.isPending) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star 
            className={`w-3 h-3 transition-colors ${isCurrentQuestionStarred ? 'fill-current' : ''}`} 
          />
          {isCurrentQuestionStarred ? 'Starred' : 'Star'}
        </motion.button>
      </motion.div>

      {/* Content container - centered and constrained */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Progress indicator with source question set */}
        <motion.div 
          className="mb-4 md:mb-6 text-center flex-shrink-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-sm md:text-base font-bold text-foreground tracking-wider">
            {currentIndex + 1} of {questions.length}
          </div>
          {currentQuestion.multipleChoiceSet && (
            <div className="text-xs text-foreground-secondary mt-1">
              From: {currentQuestion.multipleChoiceSet.name}
            </div>
          )}
        </motion.div>

        {/* Question Card */}
        <div className="relative w-full max-w-2xl max-h-[60vh] flex-shrink-0">
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
              <div className="w-full h-full bg-white rounded-3xl shadow-xl p-6 md:p-8 overflow-auto">
                {/* Question */}
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Answer Choices */}
                <div className="space-y-3">
                  {answerChoices.map((choice: string, index: number) => {
                    const isSelected = selectedAnswer === choice;
                    const isCorrect = choice === correctAnswer;
                    const showCorrectness = showResult && (isSelected || isCorrect);
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => !showResult && handleAnswerSelect(choice)}
                        disabled={showResult}
                        className={`
                          w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                          ${!showResult 
                            ? 'border-gray-200 hover:border-primary-blue hover:bg-blue-50 cursor-pointer'
                            : showCorrectness
                              ? isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          }
                        `}
                        whileHover={!showResult ? { scale: 1.02 } : {}}
                        whileTap={!showResult ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                            ${!showResult
                              ? 'border-gray-300 bg-white'
                              : showCorrectness
                                ? isCorrect
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : 'border-red-500 bg-red-500 text-white'
                                : 'border-gray-300 bg-gray-100'
                            }
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-foreground">{choice}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Result feedback */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-gray-50"
                  >
                    <div className={`text-sm font-medium ${selectedAnswer === correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                    </div>
                    {selectedAnswer !== correctAnswer && (
                      <div className="text-sm text-gray-600 mt-1">
                        The correct answer is: {correctAnswer}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
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
            disabled={currentIndex === questions.length - 1}
            className={`
              w-10 h-10 md:w-11 md:h-11 rounded-full shadow-lg transition-all duration-200 
              flex items-center justify-center
              ${currentIndex === questions.length - 1
                ? 'bg-surface text-foreground-muted cursor-not-allowed' 
                : 'bg-white text-gray-700'
              }
            `}
            whileHover={currentIndex === questions.length - 1 ? {} : { 
              scale: 1.1, 
              backgroundColor: "#f9fafb",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={currentIndex === questions.length - 1 ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}