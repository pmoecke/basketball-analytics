// App.js or App.tsx
import React from 'react';
import './App.css';
import PlayerList from './components/PlayerList';
import PlayerDetail from './components/PlayerDetail';
import HomePage from './components/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">Basketball App</header>
        <Routes>
          <Route path="/" element={<PlayerList />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
