import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

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
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const canProceed = selectedAnswer !== null || isAnswerLocked;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-600">
                Score: {score}/{totalQuestions}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 ${
                timeLeft <= 10 
                  ? 'bg-red-100 text-red-700 animate-pulse' 
                  : timeLeft <= 20 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 transform transition-all duration-300 animate-slideIn">
          {/* Category Badge */}
          {currentQuestion?.category && (
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {currentQuestion.category}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQuestion?.question}
          </h2>
          
          <div className="space-y-4">
            {currentQuestion?.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isDisabled = isAnswerLocked;
              
              return (
                <button
                  key={index}
                  onClick={() => onAnswerSelect(index)}
                  disabled={isDisabled}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white animate-scaleIn"></div>
                      )}
                    </div>
                    <span className="text-lg flex-1">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Time Up Message */}
          {isAnswerLocked && selectedAnswer === null && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-700 font-medium">⏰ Time's up! Moving to next question...</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onNextQuestion}
            disabled={!canProceed}
            className={`px-8 py-4 rounded-xl font-bold text-lg transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              canProceed
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
              {!isLastQuestion && <ChevronRight className="w-5 h-5" />}
            </span>
          </button>
          
          {!canProceed && (
            <p className="text-gray-500 text-sm mt-2">
              Please select an answer to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;