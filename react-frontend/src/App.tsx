// App.js or App.tsx
import React from 'react';
import './App.css';
import PlayerDashboard from './components/PlayerDashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PlayerDashboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
