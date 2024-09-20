// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Post from './pages/Post';
import Home from './pages/Home';

function App() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };
  
  return (
    <Routes>
      {token ? (
        <>
          <Route path="/post" element={<Post token={token} />} />
          <Route path="/home" element={<Home token={token} />} />
          {/* Redirect root path to home */}
          <Route path="/" element={<Navigate to="/home" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          {/* Redirect root path to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

// Wrap App component in Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
