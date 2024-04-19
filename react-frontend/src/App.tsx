// App.js or App.tsx
import React from 'react';
import './App.css';
import PlayerList from './components/PlayerDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">B-12 Project</header>
        <Routes>
          <Route path="/" element={<PlayerList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
