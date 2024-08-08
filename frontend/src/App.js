// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import SubmitSample from './components/SubmitSample';
import GetSamples from './components/GetSamples';
import Navigation from './components/Navigation';
import './styles.css'; // Ensure this line is present

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  const handleLogin = (authStatus, userRole) => {
    setIsAuthenticated(authStatus);
    setRole(userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
  };

  return (
    <Router>
      <div className="App">
        <Navigation isAuthenticated={isAuthenticated} role={role} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit-sample" element={isAuthenticated && role === 'business' ? <SubmitSample /> : <Navigate to="/login" />} />
          <Route path="/view-samples" element={isAuthenticated ? <GetSamples /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
