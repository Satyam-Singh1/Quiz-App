import React from 'react';
import { Trophy, RotateCcw, CheckCircle, XCircle, Star, Award, TrendingUp, Clock, Target, Brain } from 'lucide-react';

const ResultsScreen = ({ score, totalQuestions, userAnswers, onResetQuiz, highScore, isNewHighScore }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🌟", color: "text-yellow-600", icon: Award, bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    if (percentage >= 75) return { message: "Excellent work! 🎉", color: "text-green-600", icon: Trophy, bgColor: "bg-green-50", borderColor: "border-green-200" };
    if (percentage >= 60) return { message: "Good job! 👍", color: "text-blue-600", icon: TrendingUp, bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    if (percentage >= 40) return { message: "Not bad! Keep practicing", color: "text-orange-600", icon: TrendingUp, bgColor: "bg-orange-50", borderColor: "border-orange-200" };
    return { message: "Keep learning! 📚", color: "text-red-600", icon: Brain, bgColor: "bg-red-50", borderColor: "border-red-200" };
  };

  const scoreInfo = getScoreMessage();
  const ScoreIcon = scoreInfo.icon;
  
  // Calculate additional statistics
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const averageTimePerQuestion = 30; // Assuming 30 seconds per question for display
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Score Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 text-center transform transition-all duration-300 hover:scale-105">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <ScoreIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <div className={`inline-block px-4 py-2 rounded-full ${scoreInfo.bgColor} ${scoreInfo.borderColor} border-2`}>
              <p className={`text-lg font-medium ${scoreInfo.color}`}>{scoreInfo.message}</p>
            </div>
          </div>
          
          {/* Main Score Display */}
          <div className="mb-6">
            <div className="text-6xl font-bold text-gray-800 mb-2 animate-fadeIn">{score}/{totalQuestions}</div>
            <div className="text-2xl text-gray-600 mb-4">{percentage}% Correct</div>
            
            {/* Score Progress Bar */}
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out progress-bar"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            {/* New High Score Badge */}
            {isNewHighScore && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-bounce">
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <Star className="w-6 h-6 animate-spin" />
                  <span className="font-bold text-lg">New High Score!</span>
                  <Star className="w-6 h-6 animate-spin" />
                </div>
                <p className="text-sm text-yellow-600 mt-1">You beat your previous best of {highScore}%!</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onResetQuiz}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 btn-hover"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Try Again
            </button>
          </div>
          
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{highScore}%</div>
              <div className="text-sm text-gray-600">Best Score</div>
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Performance Analytics
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100 card-hover">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100 card-hover">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-100 card-hover">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{percentage}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100 card-hover">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{highScore}%</div>
              <div className="text-sm text-gray-600">Personal Best</div>
            </div>
          </div>
        </div>

        {/* Detailed Answer Review */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Answer Review
          </h2>
          
          <div className="space-y-6">
            {userAnswers.map((answer, index) => {
              const isCorrect = answer.isCorrect;
              const userSelectedText = answer.selectedAnswer !== null 
                ? answer.options[answer.selectedAnswer] 
                : 'No answer selected (Time expired)';
              
              return (
                <div 
                  key={answer.questionId} 
                  className={`border-l-4 pl-6 pb-6 transition-all duration-300 hover:bg-gray-50 rounded-r-lg pr-4 py-4 ${
                    isCorrect ? 'border-green-400 hover:border-green-500' : 'border-red-400 hover:border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCorrect ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          Question {index + 1}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isCorrect 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-base leading-relaxed">
                        {answer.question}
                      </p>
                      
                      <div className="space-y-3">
                        {/* User's Answer */}
                        <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          isCorrect 
                            ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                            : 'bg-red-50 border-red-200 hover:bg-red-100'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-medium text-gray-700">Your Answer:</div>
                            {answer.selectedAnswer === null && (
                              <Clock className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <div className={`font-semibold text-base ${
                            isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {userSelectedText}
                          </div>
                        </div>
                        
                        {/* Correct Answer (only show if user was wrong) */}
                        {!isCorrect && (
                          <div className="p-4 rounded-lg bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all duration-200">
                            <div className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</div>
                            <div className="font-semibold text-green-700 text-base">
                              {answer.correctAnswerText}
                            </div>
                          </div>
                        )}
                        
                        {/* All Options for Reference */}
                        <div className="mt-4">
                          <details className="group">
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium list-none">
                              <span className="flex items-center gap-1">
                                View all options
                                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </span>
                            </summary>
                            <div className="mt-2 pl-4 space-y-1">
                              {answer.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex} 
                                  className={`text-sm p-2 rounded ${
                                    optionIndex === answer.correctAnswer 
                                      ? 'bg-green-100 text-green-700 font-medium' 
                                      : optionIndex === answer.selectedAnswer && !isCorrect
                                        ? 'bg-red-100 text-red-700'
                                        : 'text-gray-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                  {optionIndex === answer.correctAnswer && ' ✓'}
                                  {optionIndex === answer.selectedAnswer && !isCorrect && ' ✗'}
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Share Results Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Your Results</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const text = `I just scored ${score}/${totalQuestions} (${percentage}%) on Quiz Master! 🧠✨`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                    alert('Results copied to clipboard!');
                  }
                }}
                className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
              >
                📱 Share Score
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                🖨️ Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;