import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultScreen';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScrenn';
import { fetchQuizQuestions } from './services/apiService';
import './App.css';

const TIMER_DURATION = 30; 

const Home = () => {
  // Main app state
  const [gameState, setGameState] = useState('start'); // start, loading, quiz, results, error
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [error, setError] = useState('');

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('quizHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'quiz' && timeLeft > 0 && !isAnswerLocked) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerLocked) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, isAnswerLocked]);

  const handleTimeUp = () => {
    setIsAnswerLocked(true);
    // Auto-submit with no answer (will be marked as incorrect)
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const startQuiz = async (selectedDifficulty = 'easy', selectedCategory = '') => {
    setGameState('loading');
    setDifficulty(selectedDifficulty);
    setCategory(selectedCategory);
    
    try {
      const fetchedQuestions = await fetchQuizQuestions(selectedDifficulty, selectedCategory);
      
      if (fetchedQuestions.length === 0) {
        throw new Error('No questions received from API');
      }
      
      setQuestions(fetchedQuestions);
      setGameState('quiz');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setUserAnswers([]);
      setScore(0);
      setTimeLeft(TIMER_DURATION);
      setIsAnswerLocked(false);
      setError('');
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message || 'Failed to load quiz questions. Please try again.');
      setGameState('error');
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswerLocked) return;
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    
    const answerData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswerIndex,
      options: currentQuestion.options,
      isCorrect,
      correctAnswerText: currentQuestion.options[currentQuestion.correctAnswerIndex]
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
  };

  const finishQuiz = (finalScore) => {
    const percentage = Math.round((finalScore / questions.length) * 100);
    if (percentage > highScore) {
      setHighScore(percentage);
      localStorage.setItem('quizHighScore', percentage.toString());
    }
    setGameState('results');
  };

  const resetQuiz = () => {
    setGameState('start');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(TIMER_DURATION);
    setIsAnswerLocked(false);
    setError('');
  };

  const retryQuiz = () => {
    startQuiz(difficulty, category);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Render different screens based on game state
  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStartQuiz={startQuiz} highScore={highScore} />;
      case 'loading':
        return <LoadingScreen />;
      case 'quiz':
        return (
          <QuizScreen
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            score={score}
            timeLeft={timeLeft}
            progress={progress}
            isAnswerLocked={isAnswerLocked}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            score={score}
            totalQuestions={questions.length}
            userAnswers={userAnswers}
            onResetQuiz={resetQuiz}
            highScore={highScore}
            isNewHighScore={Math.round((score / questions.length) * 100) > highScore}
          />
        );
      case 'error':
        return <ErrorScreen error={error} onRetry={retryQuiz} onGoBack={resetQuiz} />;
      default:
        return <StartScreen onStartQuiz={startQuiz} highScore={highScore} />;
    }
  };

  return (
    <div className="font-sans min-h-screen">
      {renderScreen()}
    </div>
  );
};

export default Home;