// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import NotesPreview from "./components/NotesPreview";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Auth />} />
        
        {/* Main App */}
        <Route path="/home" element={<NotesPreview />} />
        
        {/* Catch-all: Redirect to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;