import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Send, Check, X, AlertCircle, Clock, Eye, EyeOff } from 'lucide-react';
import { useFreeResponseSet, useEvaluateFreeResponse, useFreeResponseEvaluationHistory } from '../../hooks/studySets';
import { FreeResponseEvaluation } from '../../types/studySets';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function FreeResponseDetailScreen() {
  const { projectId, setId, questionId } = useParams<{ projectId: string; setId: string; questionId: string }>();
  const navigate = useNavigate();
  
  const { data: freeResponseSet, isLoading, error } = useFreeResponseSet(setId || null);
  const { data: evaluationHistory } = useFreeResponseEvaluationHistory(questionId || null);
  const evaluateFreeResponseMutation = useEvaluateFreeResponse();
  
  const [userAnswer, setUserAnswer] = useState('');
  const [currentEvaluation, setCurrentEvaluation] = useState<FreeResponseEvaluation | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const questions = useMemo(() => freeResponseSet?.questions || [], [freeResponseSet]);
  
  // Find current question and its index
  const currentIndex = useMemo(() => {
    if (questionId) {
      return questions.findIndex((q: any) => q.id === questionId);
    }
    return 0; // Start from first question if no specific question ID
  }, [questions, questionId]);
  
  const currentQuestion = useMemo(() => {
    return questions[currentIndex];
  }, [questions, currentIndex]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevQuestion = questions[currentIndex - 1];
      navigate(`/project/${projectId}/study-sets/free-response/${setId}/study/${prevQuestion.id}`);
      resetQuestion();
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      navigate(`/project/${projectId}/study-sets/free-response/${setId}/study/${nextQuestion.id}`);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setUserAnswer('');
    setCurrentEvaluation(null);
    setShowModelAnswer(false);
  };
  
  const handleSubmitAnswer = async () => {
    // Get questionId from URL params or fall back to current question's ID
    const effectiveQuestionId = questionId || currentQuestion?.id;
    
    if (!userAnswer.trim() || !effectiveQuestionId) {
      console.log('🔍 Submit: Missing answer or questionId', { 
        userAnswer: userAnswer.trim(), 
        urlQuestionId: questionId, 
        currentQuestionId: currentQuestion?.id,
        effectiveQuestionId 
      });
      return;
    }
    
    console.log('🔍 Submit: Starting evaluation', { 
      effectiveQuestionId, 
      urlQuestionId: questionId,
      currentQuestionId: currentQuestion?.id,
      userAnswer: userAnswer.trim() 
    });
    
    try {
      const evaluation = await evaluateFreeResponseMutation.mutateAsync({
        questionId: effectiveQuestionId,
        payload: { userAnswer: userAnswer.trim() }
      });
      
      console.log('🔍 Submit: Evaluation received', evaluation);
      setCurrentEvaluation(evaluation);
    } catch (error) {
      console.error('🔍 Submit: Failed to evaluate response:', error);
    }
  };

  const handleBack = () => {
    navigate(`/project/${projectId}/study-sets/free-response/${setId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-foreground-secondary">
          Loading question...
        </div>
      </div>
    );
  }
  
  if (error || !freeResponseSet || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">Question not found</div>
      </div>
    );
  }

  // Scoring with appropriate colors
  const getScoreDisplay = (score: number) => {
    const isGood = score >= 80;
    return {
      icon: isGood ? <Check className="w-5 h-5 text-primary-green" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />,
      textColor: isGood ? 'text-primary-green' : 'text-yellow-600'
    };
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden px-2 py-1 md:px-4 md:py-2 pb-4">
      {/* Header with back button */}
      <div className="w-full flex justify-start items-center mb-2 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Questions
        </button>
      </div>

      {/* Content container - properly constrained */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Progress indicator */}
        <div className="mb-4 text-base font-bold text-foreground tracking-wider flex-shrink-0">
          {currentIndex + 1} of {questions.length}
        </div>

        {/* Question and Answer Container */}
        <div className="w-full max-w-3xl flex-1 flex flex-col justify-center min-h-0">
          <div key={currentIndex} className="flex flex-col justify-center space-y-4">
            {/* Question */}
            <div className="text-center">
              <h2 className="text-lg md:text-xl font-semibold text-foreground leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Rubric hidden - only shown after evaluation */}

            {/* Answer Input */}
            <div className="space-y-3">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your detailed response here..."
                className="w-full h-32 p-3 md:p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm md:text-base transition-all duration-200"
                disabled={!!currentEvaluation}
              />

              {/* Submit/Continue Button */}
              <div className="flex justify-center pt-2">
                {!currentEvaluation ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || evaluateFreeResponseMutation.isPending}
                    className={`px-6 py-2 rounded-xl font-medium transition-colors duration-200 ${
                      userAnswer.trim() && !evaluateFreeResponseMutation.isPending
                        ? 'bg-primary-green text-white hover:bg-green-600' 
                        : 'bg-background-alt text-foreground-muted cursor-not-allowed border border-divider/20'
                    }`}
                  >
                    {evaluateFreeResponseMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2" />
                        Evaluating...
                      </>
                    ) : (
                      'Submit Response'
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-4 w-full">
                    {/* Score Display */}
                    <div className={`flex items-center gap-2 font-semibold text-lg ${getScoreDisplay(currentEvaluation.score).textColor}`}>
                      {getScoreDisplay(currentEvaluation.score).icon}
                      Score: {currentEvaluation.score}%
                    </div>
                    
                    {/* Results Panel */}
                    <div className="w-full max-w-2xl border border-divider/20 rounded-xl p-4">
                      
                      {/* Overall Feedback */}
                      {currentEvaluation.overallFeedback && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Feedback:</h4>
                          <p className="text-foreground-secondary text-sm leading-relaxed">
                            {currentEvaluation.overallFeedback}
                          </p>
                        </div>
                      )}

                      {/* Criteria Breakdown */}
                      {currentEvaluation.criteriaScores && currentEvaluation.criteriaScores.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-foreground mb-2 text-sm">Grading Criteria:</h4>
                          <div className="space-y-2">
                            {currentEvaluation.criteriaScores.map((criterion, index) => (
                              <div key={index} className="border border-divider/10 rounded p-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium text-xs text-foreground">{criterion.criterion}</span>
                                  <span className={`text-xs font-semibold ${criterion.pointsEarned > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {criterion.pointsEarned > 0 ? '✓ Met' : '✗ Not Met'}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground-secondary">{criterion.feedback}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths and Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentEvaluation.keyStrengths && currentEvaluation.keyStrengths.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-700 mb-2 text-sm flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Strengths:
                            </h4>
                            <ul className="list-disc list-inside text-green-600 text-xs space-y-1">
                              {currentEvaluation.keyStrengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {currentEvaluation.areasForImprovement && currentEvaluation.areasForImprovement.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-yellow-700 mb-2 text-sm flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Areas to Improve:
                            </h4>
                            <ul className="list-disc list-inside text-yellow-600 text-xs space-y-1">
                              {currentEvaluation.areasForImprovement.map((improvement, index) => (
                                <li key={index}>{improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Model Answer Toggle */}
                      <div className="mt-4 pt-3 border-t border-divider/20">
                        <button
                          onClick={() => setShowModelAnswer(!showModelAnswer)}
                          className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1"
                        >
                          {showModelAnswer ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showModelAnswer ? 'Hide' : 'View'} Model Answer
                        </button>
                        <AnimatePresence>
                          {showModelAnswer && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 p-3 border border-divider/10 rounded-lg"
                            >
                              <p className="text-foreground text-sm leading-relaxed">
                                {currentQuestion.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Try Again Button */}
                    <button
                      onClick={resetQuestion}
                      className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation - Positioned lower with more space */}
        <div className="flex items-center justify-center gap-6 mt-8 mb-4 flex-shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`
              w-12 h-12 rounded-full shadow-lg transition-all duration-200 
              flex items-center justify-center
              ${currentIndex === 0 
                ? 'bg-background-alt text-foreground-muted cursor-not-allowed' 
                : 'bg-background-alt border border-divider/30 text-foreground-secondary hover:bg-background-alt-hover hover:border-divider/50'
              }
            `}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`
              w-12 h-12 rounded-full shadow-lg transition-all duration-200 
              flex items-center justify-center
              ${currentIndex === questions.length - 1
                ? 'bg-background-alt text-foreground-muted cursor-not-allowed' 
                : 'bg-background-alt border border-divider/30 text-foreground-secondary hover:bg-background-alt-hover hover:border-divider/50'
              }
            `}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}