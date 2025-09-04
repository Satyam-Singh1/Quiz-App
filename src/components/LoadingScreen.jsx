import React from 'react';
import { Loader2, Download, Shuffle } from 'lucide-react';

/**
 * LoadingScreen Component
 *
 * This component shows a nice loading state while the quiz data
 * is being fetched and prepared. It's mainly for user feedback,
 * so people know what's happening instead of staring at a blank screen.
 *
 * --- Architecture & Design Decisions ---
 * 1. **Component Structure**:
 *    - Kept it as a small, stateless functional component since
 *      it doesn’t need local state or props right now.
 *    - Easier to reuse and plug into different pages if needed.
 *
 * 2. **Visual Hierarchy**:
 *    - Central card (`bg-white rounded-2xl`) stands out against
 *      the gradient background → improves focus.
 *    - Loader icon placed inside a colored circle for emphasis.
 *    - Step indicators (download/shuffle) give the sense of progress.
 *
 * 3. **UX Decisions**:
 *    - Added progress bar + small text about connection → sets expectations.
 *    - Animations (`animate-spin`, `animate-pulse`) make it feel alive.
 *    - Icons from `lucide-react` instead of plain text → more intuitive.
 *
 * 4. **Styling**:
 *    - Tailwind CSS is used for utility-first design. It helps keep
 *      styles inline, readable, and avoids switching between CSS files.
 *    - Gradient background chosen for a more "modern quiz app" feel.
 */

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 flex items-center justify-center p-4">
      {/* Centered card to hold the loader and progress info */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        
        {/* Loader + Header */}
        <div className="mb-8">
          {/* Circle loader container */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {/* Spinning loader icon */}
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Preparing Your Quiz
          </h2>
          <p className="text-gray-600">Fetching questions from Open Trivia DB...</p>
        </div>
        
        {/* Steps section to mimic a "checklist" of loading tasks */}
        <div className="space-y-4 mb-8">
          {/* Step 1: Downloading */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Download className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-700 font-medium">
              Downloading questions...
            </span>
          </div>
          {/* Step 2: Shuffling */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shuffle className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              Shuffling answers...
            </span>
          </div>
        </div>
        
        {/* Progress bar for overall loading */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          {/* Filled portion of the progress bar */}
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse"
            style={{ width: '70%' }} // Hardcoded for now, can be dynamic later
          ></div>
        </div>
        
        {/* Small helper text at the bottom */}
        <p className="text-xs text-gray-500">
          This may take a few seconds depending on your connection
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
