
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PokeMe</h1>
        <h2>your creative pokemon</h2>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
