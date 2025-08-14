import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Send, Check, AlertCircle, Clock, Star } from 'lucide-react';
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
  const [showHistory, setShowHistory] = useState(false);

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
    setShowHistory(false);
  };
  
  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !questionId) return;
    
    try {
      const evaluation = await evaluateFreeResponseMutation.mutateAsync({
        questionId,
        payload: { userAnswer: userAnswer.trim() }
      });
      
      setCurrentEvaluation(evaluation);
    } catch (error) {
      console.error('Failed to evaluate response:', error);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden px-2 py-1 md:px-4 md:py-2 pb-4">
      {/* Header with back button and history toggle */}
      <div className="w-full flex justify-between items-center mb-2 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Questions
        </button>
        
        {evaluationHistory && evaluationHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-xs"
          >
            <Clock className="w-3 h-3" />
            History ({evaluationHistory.length})
          </button>
        )}
      </div>

      {/* Content container - properly constrained */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        {/* Progress indicator */}
        <div className="mb-4 text-base font-bold text-foreground tracking-wider flex-shrink-0">
          {currentIndex + 1} of {questions.length}
        </div>

        {/* Question and Answer Container */}
        <div className="w-full max-w-4xl flex-1 flex flex-col justify-center min-h-0">
          <div key={currentIndex} className="flex flex-col justify-center space-y-6">
            {/* Question */}
            <div className="text-center">
              <h2 className="text-lg md:text-xl font-semibold text-foreground leading-tight mb-4">
                {currentQuestion.question}
              </h2>
              
              {/* Model Answer (collapsed by default) */}
              <details className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
                <summary className="cursor-pointer text-blue-700 font-medium text-sm">
                  View Model Answer
                </summary>
                <p className="mt-2 text-blue-800 text-sm leading-relaxed">
                  {currentQuestion.answer}
                </p>
              </details>
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Response:
                </label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your detailed response here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  disabled={!!currentEvaluation}
                />
              </div>

              {/* Submit Button */}
              {!currentEvaluation && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || evaluateFreeResponseMutation.isPending}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    {evaluateFreeResponseMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Response
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Evaluation Results */}
              <AnimatePresence>
                {currentEvaluation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Score */}
                    <div className={`border rounded-lg p-4 ${getScoreBgColor(currentEvaluation.score)}`}>
                      <div className="flex items-center gap-3 mb-3">
                        {currentEvaluation.isCorrect ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        )}
                        <div>
                          <div className={`text-lg font-bold ${getScoreColor(currentEvaluation.score)}`}>
                            Score: {currentEvaluation.score}/100
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentEvaluation.isCorrect ? 'Excellent response!' : 'Good effort! See feedback below.'}
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      {currentEvaluation.feedback && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Feedback:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {currentEvaluation.feedback}
                          </p>
                        </div>
                      )}

                      {/* Key Points */}
                      {currentEvaluation.keyPoints.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Key Points Covered:</h4>
                          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                            {currentEvaluation.keyPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {currentEvaluation.improvements.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Areas for Improvement:</h4>
                          <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                            {currentEvaluation.improvements.map((improvement, index) => (
                              <li key={index}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Try Again Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={resetQuestion}
                        className="px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* History Panel */}
              <AnimatePresence>
                {showHistory && evaluationHistory && evaluationHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Previous Attempts
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {evaluationHistory.map((evaluation, index) => (
                        <div key={evaluation.id} className="bg-white border rounded p-3 text-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${getScoreColor(evaluation.score)}`}>
                              Score: {evaluation.score}/100
                            </span>
                            <span className="text-gray-500">
                              {new Date(evaluation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 line-clamp-2">{evaluation.userAnswer}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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