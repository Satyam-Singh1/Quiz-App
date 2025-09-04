import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import { fetchQuizQuestions } from './services/apiService';

// ============================
// ARCHITECTURE NOTES
// ============================
// Think of `Home` as the "brain" of our quiz app. 
// - It runs a simple state machine: start → loading → quiz → results → error.
// - UI for each state is delegated to separate components (keeps them dumb and clean).
// - All the orchestration — fetching, scoring, timers, flow — happens here.
// This makes `Home` a good single source of truth for quiz logic.

// Each question gets 30 seconds before auto timeout
const TIMER_DURATION = 30;

const Home = () => {
  // ----------------------------
  // Core state for the app flow
  // ----------------------------
  const [gameState, setGameState] = useState('start'); // current screen
  const [questions, setQuestions] = useState([]); // full quiz data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // which Q user is on
  const [selectedAnswer, setSelectedAnswer] = useState(null); // current choice
  const [userAnswers, setUserAnswers] = useState([]); // record of all answers
  const [score, setScore] = useState(0); // running score

  // ----------------------------
  // Timer and answer control
  // ----------------------------
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION); // countdown per Q
  const [isAnswerLocked, setIsAnswerLocked] = useState(false); // prevents double-submit
  const [error, setError] = useState(''); // for ErrorScreen
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false); // quick "correct/incorrect" flash

  // ----------------------------
  // Quiz configuration
  // ----------------------------
  const [quizSettings, setQuizSettings] = useState({
    difficulty: 'easy',
    category: '',
    amount: 10
  });

  // ----------------------------
  // User performance stats
  // ----------------------------
  const [userStats, setUserStats] = useState({
    highScore: 0,
    totalQuizzes: 0,
    bestStreak: 0
  });

  // Mocked stats — in real world we’d sync from localStorage or backend
  useEffect(() => {
    setUserStats({
      highScore: 75,
      totalQuizzes: 12,
      bestStreak: 5
    });
  }, []);

  // ============================
  // TIMER LOGIC
  // ============================
  useEffect(() => {
    let timer;
    if (gameState === 'quiz' && timeLeft > 0 && !isAnswerLocked) {
      timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp(); // auto-submit if time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer); // clean up
  }, [gameState, timeLeft, isAnswerLocked]);

  // What happens when time runs out on a question
  const handleTimeUp = useCallback(() => {
    if (isAnswerLocked) return; // no-op if already answered
    setIsAnswerLocked(true);
    setShowAnswerFeedback(true);

    // Pause for 2s so user sees feedback before auto-progress
    setTimeout(() => {
      setShowAnswerFeedback(false);
      handleNextQuestion();
    }, 2000);
  }, [isAnswerLocked]);

  // ============================
  // QUIZ FLOW FUNCTIONS
  // ============================

  // Bootstraps quiz: fetches data and moves to quiz screen
  const startQuiz = async (selectedDifficulty = 'easy', selectedCategory = '', amount = 10) => {
    setGameState('loading'); // temporary screen
    setQuizSettings({ difficulty: selectedDifficulty, category: selectedCategory, amount });

    try {
      const fetchedQuestions = await fetchQuizQuestions(selectedDifficulty, selectedCategory, amount);

      if (fetchedQuestions.length === 0) {
        throw new Error('No questions received from API. Please try different settings.');
      }

      setQuestions(fetchedQuestions);
      setGameState('quiz'); // enter quiz mode
      resetQuizState();
      setError('');

      // bump quizzes played count
      const newTotal = userStats.totalQuizzes + 1;
      setUserStats(prev => ({ ...prev, totalQuizzes: newTotal }));

    } catch (err) {
      // fallback messages → we don’t just show raw error
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

  // Reset state so a quiz run starts fresh
  const resetQuizState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setIsAnswerLocked(false);
    setShowAnswerFeedback(false);
  }, []);

  // When user picks an option
  const handleAnswerSelect = useCallback((answerIndex) => {
    if (isAnswerLocked) return; // don’t let them change after lock
    setSelectedAnswer(answerIndex);
  }, [isAnswerLocked]);

  // When user confirms answer
  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null && !isAnswerLocked) return;

    setIsAnswerLocked(true);
    setShowAnswerFeedback(true);

    // short delay before next question
    setTimeout(() => {
      setShowAnswerFeedback(false);
      handleNextQuestion();
    }, 1500);
  }, [selectedAnswer, isAnswerLocked]);

  // Decides whether to move forward or finish
  const handleNextQuestion = useCallback(() => {
    if (!questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswerIndex;

    // Record this answer for results screen later
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

    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuestionIndex < questions.length - 1) {
      // move to next Q
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(TIMER_DURATION);
      setIsAnswerLocked(false);
    } else {
      // quiz over
      finishQuiz(isCorrect ? score + 1 : score);
    }
  }, [questions, currentQuestionIndex, selectedAnswer, score]);

  // Wrap-up logic: calculate % and update stats
  const finishQuiz = useCallback((finalScore) => {
    const percentage = Math.round((finalScore / questions.length) * 100);
    const currentStreak = calculateStreak(finalScore, questions.length);

    // bump high score if this run was better
    if (percentage > userStats.highScore) {
      setUserStats(prev => ({ ...prev, highScore: percentage }));
    }

    // bump best streak if improved
    if (currentStreak > userStats.bestStreak) {
      setUserStats(prev => ({ ...prev, bestStreak: currentStreak }));
    }

    setGameState('results');
  }, [questions.length, userStats.highScore, userStats.bestStreak]);

  // Helper: checks last 5 answers for streaks
  const calculateStreak = (correctAnswers, totalQuestions) => {
    const recentAnswers = userAnswers.slice(-5);
    let streak = 0;
    for (let i = recentAnswers.length - 1; i >= 0; i--) {
      if (recentAnswers[i].isCorrect) streak++;
      else break;
    }
    return streak;
  };

  // Start screen reset
  const resetQuiz = useCallback(() => {
    setGameState('start');
    resetQuizState();
    setError('');
  }, [resetQuizState]);

  // Same quiz, same settings
  const retryQuiz = useCallback(() => {
    startQuiz(quizSettings.difficulty, quizSettings.category, quizSettings.amount);
  }, [quizSettings]);

  // ============================
  // Derived values
  // ============================
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const isNewHighScore = gameState === 'results' &&
    Math.round((score / questions.length) * 100) > userStats.highScore;

  // ============================
  // Screen rendering (state machine)
  // ============================
  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartQuiz={startQuiz} userStats={userStats} />;
      case 'loading':
        return <LoadingScreen difficulty={quizSettings.difficulty} category={quizSettings.category} />;
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
          <ResultScreen
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
        return <StartScreen onStartQuiz={startQuiz} userStats={userStats} />;
    }
  };

  // ============================
  // Render
  // ============================
  return (
    <div className="min-h-screen min-w-full items-center justify-center">
      <div className="mx-0">
        {renderScreen()}
      </div>
    </div>
  );
};

export default Home;
