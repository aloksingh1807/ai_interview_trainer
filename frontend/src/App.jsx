import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AwwwardsCanvas from './components/AwwwardsCanvas';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import PreparationHub from './pages/PreparationHub';
import ResumeAtsChecker from './pages/ResumeAtsChecker';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';

// Private routing protection handler
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Interactive Mouse particles backdrop */}
        <AwwwardsCanvas />
        
        {/* Global Animated Color Blobs behind glass cards */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-40">
          <div className="absolute top-[10%] left-[15%] w-[35rem] h-[35rem] rounded-full bg-accentPrimary/10 blur-[130px] animate-blob-slow" />
          <div className="absolute bottom-[15%] right-[20%] w-[40rem] h-[40rem] rounded-full bg-accentSecondary/10 blur-[150px] animate-blob-reverse" />
        </div>

        {/* Global Nav */}
        <Navbar />

        {/* Content routing modules */}
        <main className="w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected candidate workspaces */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/interview" element={
                <PrivateRoute>
                  <InterviewRoom />
                </PrivateRoute>
              } />
              <Route path="/preparation" element={
                <PrivateRoute>
                  <PreparationHub />
                </PrivateRoute>
              } />
              <Route path="/resume" element={
                <PrivateRoute>
                  <ResumeAtsChecker />
                </PrivateRoute>
              } />
              <Route path="/roadmap" element={
                <PrivateRoute>
                  <Roadmap />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              {/* Catch all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}
