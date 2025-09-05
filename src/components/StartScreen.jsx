import React, { useState } from 'react';
import { Trophy, Play, Star, Settings, Zap, Brain, Target } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../services/apiService';

/**
 * ============================================
 * StartScreen Component
 * ============================================
 * Acts as the *landing page* of the quiz app.  
 * Responsibilities:
 *   - Showcase user stats (score, quizzes played, streak).
 *   - Allow a quick-start quiz with sensible defaults.
 *   - Give users the option to configure quiz preferences.
 * 
 * Why separate this into its own screen?
 *   - Keeps the UX flow clean: "start → quiz → results".
 *   - Decouples setup/config logic from the main quiz controller (`Home.jsx`).
 *   - Makes this component reusable (we could easily add it to a dashboard later).
 * 
 * Design decisions:
 *   - Defaults: difficulty = easy, questions = 10, no category → reduces friction for casual users.
 *   - Stats: placed prominently to motivate and show progress.
 *   - Settings: hidden behind a toggle so the main screen stays clean and beginner-friendly.
 *   - Visuals: gradient backgrounds + animated blobs/icons → gamified look and feel.
 */
const StartScreen = ({ onStartQuiz, userStats }) => { 
  // -------------------------------
  // Local state: config UI only
  // -------------------------------
  // This state is local since it’s just temporary setup values
  // until the parent (`Home.jsx`) actually starts the quiz.
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [showSettings, setShowSettings] = useState(false); 
  const [amount, setAmount] = useState(10); 

  // Kick off quiz with the chosen settings.
  // We push the config up to `Home.jsx` via callback → keeps StartScreen dumb/simple.
  const handleStartQuiz = () => {
    onStartQuiz(selectedDifficulty, selectedCategory, amount);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950">
      
      {/* ==============================
          Background Layer (Decoration)
          ------------------------------
          Adds animated color blobs behind the main card.
          Purpose: playful, engaging look without adding noise to logic.
      =============================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* ==============================
          Main Card (Core Content)
          ------------------------------
          Houses branding, stats, and config UI.
          Visually separated via glassmorphism.
      =============================== */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        
        {/* Branding / Header Section */}
        <div className="mb-10">
          {/* Logo: Brain = knowledge, Zap = energy/game feel */}
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Brain className="w-14 h-14 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Zap className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
            Quiz Master
          </h1>
          <p className="text-white/80 mt-3">
            Challenge your mind with fun & dynamic trivia questions.
          </p>
        </div>

        {/* ==============================
            Stats Section
            ------------------------------
            Small motivators showing personal progress.
            Why? Encourages replay by highlighting improvement.
        =============================== */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: <Star className="w-5 h-5 text-yellow-400" />, value: `${userStats.highScore}%`, label: 'Best Score' },
            { icon: <Trophy className="w-5 h-5 text-purple-400" />, value: userStats.totalQuizzes, label: 'Quizzes' },
            { icon: <Target className="w-5 h-5 text-pink-400" />, value: userStats.bestStreak, label: 'Best Streak' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-purple-500/20 transition transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ==============================
            Quick Start Button
            ------------------------------
            For impatient users → start immediately
            with defaults. Difficulty shown as a tag.
        =============================== */}
        <button
          onClick={handleStartQuiz}
          className="relative w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 shadow-xl transform hover:scale-105 transition mb-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Play className="w-6 h-6 animate-ping" />
            <span>Start Quiz</span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
              {DIFFICULTIES[selectedDifficulty]}
            </span>
          </div>
        </button>

        {/* Settings Toggle → collapsible panel */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full py-3 px-4 text-white hover:text-gray-300 font-medium flex items-center justify-center gap-2  bg-gradient-to-r from-pink-500 to-purple-500 hover:bg-white/10 hover:scale-105 transition  hover:from-purple-600 hover:to-pink-600 rounded-xl border border-white/10 "
        >
          <Settings className={`w-5 h-5 animate-pulse `} />
          {showSettings ? 'Hide Settings' : 'Customize Settings'}
        </button>

        {/* ==============================
            Settings Panel
            ------------------------------
            Lets users tweak quiz config.
            Hidden by default → avoids overwhelming new users.
        =============================== */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showSettings ? 'max-h-[1000px] mt-6 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Quiz Configuration
            </h3>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/90 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DIFFICULTIES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition ${
                      selectedDifficulty === key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/90 mb-3">
                Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((num) => (
                  <button
                    key={num}
                    onClick={() => setAmount(num)}
                    className={`py-2 px-3 rounded-xl text-sm font-medium border transition ${
                      amount === num
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm backdrop-blur-sm"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
