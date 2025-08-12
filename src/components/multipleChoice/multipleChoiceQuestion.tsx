import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { ParsedChoice, ParsedQuestion } from '../../types';

interface MultipleChoiceQuestionProps {
  question: ParsedQuestion;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
  isCompleted: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult,
  isCompleted,
}: MultipleChoiceQuestionProps) {
  const getChoiceStyle = (choice: ParsedChoice) => {
    if (!showResult) {
      return 'border-divider hover:border-primary-blue hover:bg-blue-50 cursor-pointer';
    }

    if (choice.letter === question.correctAnswer) {
      return 'border-green-500 bg-green-50 text-green-800';
    }

    if (choice.letter === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return 'border-red-500 bg-red-50 text-red-800';
    }

    return 'border-divider opacity-60';
  };

  const getChoiceIcon = (choice: ParsedChoice) => {
    if (!showResult) return null;

    if (choice.letter === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    if (choice.letter === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl p-8 shadow-card"
    >
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Choices */}
      <div className="space-y-4 mb-6">
        {question.choices.map((choice) => (
          <motion.button
            key={choice.letter}
            onClick={() => !showResult && !isCompleted && onAnswerSelect(choice.letter)}
            disabled={showResult || isCompleted}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 ${getChoiceStyle(choice)}`}
            whileHover={!showResult && !isCompleted ? { scale: 1.02 } : {}}
            whileTap={!showResult && !isCompleted ? { scale: 0.98 } : {}}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-semibold">
                  {choice.letter}
                </div>
              </div>
              <div className="flex-grow text-left">
                {choice.text}
              </div>
              <div className="flex-shrink-0">
                {getChoiceIcon(choice)}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Explanation - shown after answer is selected */}
      {showResult && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
        >
          <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800 leading-relaxed">
            {question.explanation}
          </p>
        </motion.div>
      )}

      {/* Result indicator */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          {selectedAnswer === question.correctAnswer ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-semibold">Correct!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="w-6 h-6" />
              <span className="text-lg font-semibold">
                Incorrect. The correct answer is {question.correctAnswer}.
              </span>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}