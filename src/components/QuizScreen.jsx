import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

/**
 * QuizScreen Component
 * ---------------------
 * Props:
 * - currentQuestion: Object containing question, options, and category
 * - currentQuestionIndex: Index of the current question
 * - totalQuestions: Total number of questions in quiz
 * - selectedAnswer: The index of the currently selected answer
 * - onAnswerSelect: Callback function when an answer is selected
 * - onNextQuestion: Callback function when moving to the next question
 * - score: Current score of the user
 * - timeLeft: Remaining time in seconds for the current question
 * - progress: Percentage of quiz completed (for progress bar)
 * - isAnswerLocked: Boolean indicating if answers are locked (e.g., when time runs out)
 */
const QuizScreen = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  score,
  timeLeft,
  progress,
  isAnswerLocked
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1; // Check if this is the last question
  const canProceed = selectedAnswer !== null || isAnswerLocked; // User can proceed if answer selected or time expired

  return (
    <div className="mi-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 p-6 backdrop-blur-3xl">
      <div className="w-full max-w-4xl">
        
        {/* Header Section: Shows question count, score, timer, and progress bar */}
        <div className="backdrop-blur-6xl bg-white/5 border border-white/50 rounded-2xl shadow-xl p-6 mb-5">
          <div className="flex items-center justify-between mb-6">
            {/* Question counter */}
            <div className="text-sm font-medium text-white/80">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>

            {/* Score and Timer */}
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-white/80">
                Score: {score}/{totalQuestions}
              </div>
              
              {/* Timer with color based on urgency */}
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  timeLeft <= 10
                    ? 'bg-red-500/20 text-red-200 animate-pulse'
                    : timeLeft <= 20
                    ? 'bg-yellow-500/20 text-yellow-200'
                    : 'bg-green-500/20 text-green-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Progress bar showing completion */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 h-2 rounded-full shadow-lg transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="backdrop-blur-6xl bg-white/10 border border-white/50 rounded-2xl shadow-xl p-8 mb-8">
          {/* Optional category badge */}
          {currentQuestion?.category && (
            <div className="inline-block bg-purple-500/30 text-purple-200 text-xs font-semibold px-4  rounded-full ">
              {currentQuestion.category}
            </div>
          )}

          {/* Question text */}
          <h2 className="text-2xl font-bold text-white mb-5 leading-relaxed">
            {currentQuestion?.question}
          </h2>

          {/* Answer options */}
          <div className="space-y-4">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedAnswer === index; // Highlight selected answer
              const isDisabled = isAnswerLocked; // Disable if time is up

              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={isDisabled}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none ${
                    isSelected
                      ? 'border-pink-400 bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white font-semibold shadow-lg'
                      : 'border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-white/40'
                  } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Time up message */}
          {isAnswerLocked && selectedAnswer === null && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-center">
              <p className="text-red-200 font-medium">
                ⏰ Time's up! Moving to next question...
              </p>
            </div>
          )}
        </div>
            {/* Question indicator dots */}
          <div className="flex items-center gap-1.5 mx-auto mb-8 justify-center">
            {Array.from({ length: Math.min(totalQuestions, 10) }, (_, index) => {
              // Show only first 10 dots for space efficiency
              if (totalQuestions > 10) {
                if (index === 9) {
                  return <span key="ellipsis" className="text-white/50 text-xs">...</span>;
                }
                if (currentQuestionIndex >= 10 && index < 8) {
                  return null;
                }
                if (currentQuestionIndex >= 10 && index >= 8) {
                  const actualIndex = currentQuestionIndex - (9 - index);
                  return (
                    <div
                      key={actualIndex}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        actualIndex === currentQuestionIndex
                          ? 'bg-gradient-to-r from-pink-400 to-purple-500 scale-125'
                          : actualIndex < currentQuestionIndex
                          ? 'bg-green-400'
                          : 'bg-white/30'
                      }`}
                    />
                  );
                }
              }
              
              return (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500 scale-125'
                      : index < currentQuestionIndex
                      ? 'bg-green-400'
                      : 'bg-white/30'
                  }`}
                />
              );
            })}
          </div>

        {/* Action Button: Next or Finish */}
        <div className="text-center">
          <button
            onClick={onNextQuestion}
            disabled={!canProceed}
            className={`px-10 py-4 rounded-xl font-bold text-lg transform transition-all duration-300 focus:outline-none ${
              canProceed
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105 shadow-xl'
                : 'bg-gray-500/40 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              {!isLastQuestion && <ChevronRight className="w-5 h-5" />}
            </span>
          </button>

          {/* Hint if button is disabled */}
          {!canProceed && (
            <p className="text-gray-300 text-sm mt-2">
              Please select an answer to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
