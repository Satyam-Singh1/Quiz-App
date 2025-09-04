import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultScreen';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Navigate to="/" replace />} />
          <Route path="/results" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}