import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Wifi, WifiOff } from 'lucide-react';

const ErrorScreen = ({ error, onRetry, onGoBack }) => {
  const isNetworkError = error.includes('network') || error.includes('internet') || error.includes('connection');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {isNetworkError ? (
              <WifiOff className="w-10 h-10 text-white" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
          </h1>
        </div>
        
        {/* Error Message */}
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
          
          {isNetworkError && (
            <div className="text-left text-sm text-gray-600 space-y-2">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="space-y-1 ml-4">
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• Disable VPN if active</li>
                <li>• Check if Open Trivia DB is accessible</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <RefreshCw className="w-5 h-5 inline mr-2" />
            Try Again
          </button>
          
          <button
            onClick={onGoBack}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Start
          </button>
        </div>
        
        {/* Status Indicator */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Wifi className="w-4 h-4" />
            <span>Open Trivia DB Status</span>
          </div>
          <div className="mt-2">
            <a
              href="https://opentdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Check API Status
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;