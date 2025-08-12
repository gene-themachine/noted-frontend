import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft, Check, X } from 'lucide-react';
import { useMultipleChoiceSet } from '../../hooks/studySets';
import { ParsedQuestion, ParsedChoice } from '../../types';

// Function to parse the answer field into structured data
function parseMultipleChoiceAnswer(question: string, answer: string, id: string): ParsedQuestion {
  const lines = answer.split('\n').map(line => line.trim()).filter(line => line);
  
  const choices: ParsedChoice[] = [];
  let correctAnswer = '';
  let explanation = '';
  
  let currentSection = '';
  
  for (const line of lines) {
    if (line.startsWith('Choices:')) {
      currentSection = 'choices';
      continue;
    }
    
    if (line.startsWith('Correct Answer:')) {
      correctAnswer = line.replace('Correct Answer:', '').trim();
      currentSection = 'correct';
      continue;
    }
    
    if (line.startsWith('Explanation:')) {
      explanation = line.replace('Explanation:', '').trim();
      currentSection = 'explanation';
      continue;
    }
    
    if (currentSection === 'choices' && line.match(/^[A-D]:/)) {
      const [letter, ...textParts] = line.split(':');
      choices.push({
        letter: letter.trim(),
        text: textParts.join(':').trim()
      });
    } else if (currentSection === 'explanation') {
      explanation += ' ' + line;
    }
  }
  
  return {
    id,
    question,
    choices,
    correctAnswer: correctAnswer.trim(),
    explanation: explanation.trim()
  };
}

export default function MultipleChoiceDetailScreen() {
  const { projectId, setId, questionId } = useParams<{ projectId: string; setId: string; questionId: string }>();
  const navigate = useNavigate();
  
  const { data: multipleChoiceSet, isLoading, error } = useMultipleChoiceSet(setId || null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const questions = useMemo(() => {
    if (!multipleChoiceSet?.questions) return [];
    
    return multipleChoiceSet.questions.map((q: any) => 
      parseMultipleChoiceAnswer(q.question, q.answer, q.id)
    );
  }, [multipleChoiceSet]);
  
  // Find current question and its index
  const currentIndex = useMemo(() => {
    if (questionId) {
      return questions.findIndex((q: any) => q.id === questionId);
    }
    return 0; // Start from first question if no specific question ID
  }, [questions, questionId]);
  
  const currentQuestion = useMemo(() => {
    return questions[currentIndex] as ParsedQuestion | undefined;
  }, [questions, currentIndex]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevQuestion = questions[currentIndex - 1];
      navigate(`/project/${projectId}/study-sets/multiple-choice/${setId}/study/${prevQuestion.id}`);
      resetQuestion();
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      navigate(`/project/${projectId}/study-sets/multiple-choice/${setId}/study/${nextQuestion.id}`);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const handleAnswerSelect = (answerLetter: string) => {
    if (showResult) return; // Don't allow changing answer after showing result
    setSelectedAnswer(answerLetter);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setShowResult(true);
    }
  };

  const handleBack = () => {
    navigate(`/project/${projectId}/study-sets/multiple-choice/${setId}`);
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
  
  if (error || !multipleChoiceSet || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-foreground-secondary">
        <div className="text-lg mb-4">Question not found</div>
      </div>
    );
  }

  const isCorrect = (answerLetter: string) => {
    return currentQuestion?.correctAnswer === answerLetter;
  };

  const getAnswerStyle = (answerLetter: string) => {
    if (!showResult) {
      return selectedAnswer === answerLetter 
        ? 'bg-primary-orange border-primary-orange text-white' 
        : 'bg-surface/30 border-divider/40 hover:border-primary-orange hover:bg-orange-50/20';
    }
    
    if (isCorrect(answerLetter)) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    
    if (selectedAnswer === answerLetter && !isCorrect(answerLetter)) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    
    return 'bg-surface/20 border-divider/30 text-foreground-secondary';
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden p-3 md:p-4">
      {/* Back button */}
      <div className="w-full flex justify-start mb-1 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Questions
        </button>
      </div>

      {/* Content container - centered and constrained */}
      <div className="flex flex-col items-center justify-start flex-1 min-h-0 py-1">
        {/* Progress indicator */}
        <div className="mb-1 text-base md:text-lg font-bold text-foreground tracking-wider flex-shrink-0">
          {currentIndex + 1} of {questions.length}
        </div>

        {/* Question Card */}
        <div className="w-full max-w-2xl flex-1 flex flex-col min-h-0">
          <div key={currentIndex} className="flex flex-col">
              {/* Question */}
              <div className="bg-surface/50 rounded-2xl border border-divider/20 p-3 mb-4 flex-shrink-0">
                <h2 className="text-lg md:text-xl font-semibold text-foreground leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {currentQuestion?.choices?.map((choice: ParsedChoice, index: number) => (
                  <button
                    key={choice.letter}
                    onClick={() => handleAnswerSelect(choice.letter)}
                    className={`w-full p-4 rounded-xl border-2 text-left ${getAnswerStyle(choice.letter)}`}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {choice.letter}. {choice.text}
                      </span>
                      {showResult && (
                        <div className="flex-shrink-0 ml-2">
                          {isCorrect(choice.letter) ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : selectedAnswer === choice.letter ? (
                            <X className="w-5 h-5 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit/Continue Button */}
              <div className="mt-4 flex justify-center flex-shrink-0">
                {!showResult ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className={`px-8 py-3 rounded-lg font-medium ${
                      selectedAnswer 
                        ? 'bg-primary-orange hover:bg-orange-600 text-white' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {selectedAnswer && isCorrect(selectedAnswer) ? (
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Check className="w-5 h-5" />
                        Correct!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 font-medium">
                        <X className="w-5 h-5" />
                        Incorrect. The correct answer is {currentQuestion?.correctAnswer}.
                      </div>
                    )}
                    
                    {/* Show explanation if available */}
                    {currentQuestion?.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 max-w-md text-center">
                        <h4 className="font-semibold text-blue-900 mb-1 text-sm">Explanation:</h4>
                        <p className="text-blue-800 text-sm leading-tight">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-center gap-6 mt-3 flex-shrink-0">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center
                    ${currentIndex === 0 
                      ? 'bg-surface text-foreground-muted cursor-not-allowed' 
                      : 'bg-surface/50 border border-divider/30 text-gray-700 hover:bg-surface/80'
                    }
                  `}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg flex items-center justify-center
                    ${currentIndex === questions.length - 1
                      ? 'bg-surface text-foreground-muted cursor-not-allowed' 
                      : 'bg-surface/50 border border-divider/30 text-gray-700 hover:bg-surface/80'
                    }
                  `}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}