import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Shortener from './pages/Shortener';
import Stats from './pages/Stats';
import Redirector from './pages/Redirector'; // Make sure this file exists

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shortener />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/:shortcode" element={<Redirector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
