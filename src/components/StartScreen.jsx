import React, { useState } from 'react';
import { Trophy, Play, Star, Settings } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../services/apiService';

const StartScreen = ({ onStartQuiz, highScore }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleStartQuiz = () => {
    onStartQuiz(selectedDifficulty, selectedCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Master</h1>
          <p className="text-gray-600">Test your knowledge with questions from Open Trivia DB!</p>
        </div>
        
        {/* High Score Display */}
        {highScore > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Star className="w-5 h-5" />
              <span className="font-semibold">Best Score: {highScore}%</span>
            </div>
          </div>
        )}
        
        {/* Quick Start Button */}
        <div className="mb-6">
          <button
            onClick={handleStartQuiz}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4"
          >
            <Play className="w-5 h-5 inline mr-2" />
            Start Quiz ({DIFFICULTIES[selectedDifficulty]})
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize Settings
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Settings</h3>
            
            {/* Difficulty Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DIFFICULTIES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedDifficulty === key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Current Selection Summary */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Current Selection:</div>
              <div className="text-sm font-medium text-gray-800">
                {DIFFICULTIES[selectedDifficulty]} • {CATEGORIES[selectedCategory] || 'Any Category'}
              </div>
            </div>
          </div>
        )}
        
        {/* Features List */}
        <div className="text-left text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>10 multiple-choice questions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>30 seconds per question</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Instant results & review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;