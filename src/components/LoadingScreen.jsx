import React from 'react';
import { Loader2, Download, Shuffle } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Loading Animation */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Quiz</h2>
          <p className="text-gray-600">Fetching questions from Open Trivia DB...</p>
        </div>
        
        {/* Loading Steps */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Download className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">Downloading questions...</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shuffle className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Shuffling answers...</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        
        <p className="text-xs text-gray-500">
          This may take a few seconds depending on your connection
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;