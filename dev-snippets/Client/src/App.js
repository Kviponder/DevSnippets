import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SnippetList from './components/SnippetList';
import SignupForm from './components/SignupForm';
import Header from './components/header';
import Footer from './components/Footer';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snippets" element={<SnippetList />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
