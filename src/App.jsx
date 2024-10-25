import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Login from './login.jsx';
import Register from './register.jsx';
import Jacobi from './jacobi.jsx';

// 25.10
const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        </nav>
        <div class="elem">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jacobi" element={<Jacobi />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

