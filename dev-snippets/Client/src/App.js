import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SnippetList from './components/SnippetList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snippets" element={<SnippetList />} />
      </Routes>
    </Router>
  );
}

export default App;
