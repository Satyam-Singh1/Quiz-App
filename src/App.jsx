import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';



export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Navigate to="/" replace />} />
          <Route path="/results" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
