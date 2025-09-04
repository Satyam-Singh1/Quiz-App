import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import { fetchQuizQuestions } from './services/apiService';

const TIMER_DURATION = 30;

const Home = () => {
  const [gameState, setGameState] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [error, setError] = useState('');
  const [quizSettings, setQuizSettings] = useState({
    difficulty: 'easy',
    category: '',
    amount: 10
  });
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [userStats, setUserStats] = useState({
    highScore: 0,
    totalQuizzes: 0,
    bestStreak: 0
  });

  useEffect(() => {
    const savedHighScore = localStorage.getItem('quizHighScore');
    const savedTotalQuizzes = localStorage.getItem('totalQuizzesTaken') || 0;
    const savedBestStreak = localStorage.getItem('bestStreak') || 0;
    
    setUserStats({
      highScore: parseInt(savedHighScore) || 0,
      totalQuizzes: parseInt(savedTotalQuizzes),
      bestStreak: parseInt(savedBestStreak)
    });
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'quiz' && timeLeft > 0 && !isAnswerLocked) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, isAnswerLocked]);

  const handleTimeUp = useCallback(() => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    setShowAnswerFeedback(true);
    
    setTimeout(() => {
      setShowAnswerFeedback(false);
      handleNextQuestion();
    }, 2000);
  }, [isAnswerLocked]);

  const startQuiz = async (selectedDifficulty = 'easy', selectedCategory = '', amount = 10) => {
    setGameState('loading');
    setQuizSettings({ 
      difficulty: selectedDifficulty, 
      category: selectedCategory, 
      amount 
    });
    
    try {
      const fetchedQuestions = await fetchQuizQuestions(selectedDifficulty, selectedCategory, amount);
      
      if (fetchedQuestions.length === 0) {
        throw new Error('No questions received from API. Please try different settings.');
      }
      
      setQuestions(fetchedQuestions);
      setGameState('quiz');
      resetQuizState();
      setError('');
      
      const newTotal = userStats.totalQuizzes + 1;
      localStorage.setItem('totalQuizzesTaken', newTotal.toString());
      setUserStats(prev => ({ ...prev, totalQuizzes: newTotal }));
      
    } catch (err) {
      let errorMessage = 'Failed to load quiz questions. Please try again.';
      if (err.message.includes('network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message.includes('No questions')) {
        errorMessage = 'No questions found for the selected criteria. Please try different settings.';
      }
      
      setError(errorMessage);
      setGameState('error');
    }
  };

  const resetQuizState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setIsAnswerLocked(false);
    setShowAnswerFeedback(false);
  }, []);

  const handleAnswerSelect = useCallback((answerIndex) => {
    if (isAnswerLocked) return;
    setSelectedAnswer(answerIndex);
  }, [isAnswerLocked]);

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null && !isAnswerLocked) return;
    
    setIsAnswerLocked(true);
    setShowAnswerFeedback(true);
    
    setTimeout(() => {
      setShowAnswerFeedback(false);
      handleNextQuestion();
    }, 1500);
  }, [selectedAnswer, isAnswerLocked]);

  const handleNextQuestion = useCallback(() => {
    if (!questions[currentQuestionIndex]) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswerIndex;
    
    const answerData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswerIndex,
      options: currentQuestion.options,
      isCorrect,
      correctAnswerText: currentQuestion.options[currentQuestion.correctAnswerIndex],
      userAnswerText: selectedAnswer !== null ? currentQuestion.options[selectedAnswer] : null,
      timeExpired: selectedAnswer === null,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty
    };
    
    setUserAnswers(prev => [...prev, answerData]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_DURATION);
      setIsAnswerLocked(false);
    } else {
      finishQuiz(isCorrect ? score + 1 : score);
    }
  }, [questions, currentQuestionIndex, selectedAnswer, score]);

  const finishQuiz = useCallback((finalScore) => {
    const percentage = Math.round((finalScore / questions.length) * 100);
    const currentStreak = calculateStreak(finalScore, questions.length);
    
    if (percentage > userStats.highScore) {
      localStorage.setItem('quizHighScore', percentage.toString());
      setUserStats(prev => ({ ...prev, highScore: percentage }));
    }
    
    if (currentStreak > userStats.bestStreak) {
      localStorage.setItem('bestStreak', currentStreak.toString());
      setUserStats(prev => ({ ...prev, bestStreak: currentStreak }));
    }
    
    setGameState('results');
  }, [questions.length, userStats.highScore, userStats.bestStreak]);

  const calculateStreak = (correctAnswers, totalQuestions) => {
    const recentAnswers = userAnswers.slice(-5);
    let streak = 0;
    for (let i = recentAnswers.length - 1; i >= 0; i--) {
      if (recentAnswers[i].isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const resetQuiz = useCallback(() => {
    setGameState('start');
    resetQuizState();
    setError('');
  }, [resetQuizState]);

  const retryQuiz = useCallback(() => {
    startQuiz(quizSettings.difficulty, quizSettings.category, quizSettings.amount);
  }, [quizSettings]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isNewHighScore = gameState === 'results' && 
    Math.round((score / questions.length) * 100) > userStats.highScore;

  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return (
          <StartScreen 
            onStartQuiz={startQuiz} 
            userStats={userStats}
          />
        );
      
      case 'loading':
        return (
          <LoadingScreen 
            difficulty={quizSettings.difficulty}
            category={quizSettings.category}
          />
        );
      
      case 'quiz':
        return (
          <QuizScreen
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onAnswerSubmit={handleAnswerSubmit}
            onNextQuestion={handleNextQuestion}
            score={score}
            timeLeft={timeLeft}
            progress={progress}
            isAnswerLocked={isAnswerLocked}
            showAnswerFeedback={showAnswerFeedback}
            difficulty={quizSettings.difficulty}
            category={quizSettings.category}
          />
        );
      
      case 'results':
        return (
          <ResultsScreen
            score={score}
            totalQuestions={questions.length}
            userAnswers={userAnswers}
            onResetQuiz={resetQuiz}
            onRetryQuiz={retryQuiz}
            isNewHighScore={isNewHighScore}
            userStats={userStats}
            quizSettings={quizSettings}
          />
        );
      
      case 'error':
        return (
          <ErrorScreen 
            error={error} 
            onRetry={retryQuiz} 
            onGoBack={resetQuiz}
            quizSettings={quizSettings}
          />
        );
      
      default:
        return (
          <StartScreen 
            onStartQuiz={startQuiz} 
            userStats={userStats}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {renderScreen()}
      </div>
    </div>
  );
};

export default Home;