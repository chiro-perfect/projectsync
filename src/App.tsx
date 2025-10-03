// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './components/Pages/HomePage';
import UserBoard from './components/Pages/UserBoard';
import AboutPage from './components/Pages/AboutPage';


// Définition de React.FC (Functional Component) pour le typage
const App: React.FC = () => {
  return (
    <Router>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* L'ID utilisateur est géré par React Router */}
            <Route path="/user/:id" element={<UserBoard />} /> 
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
    </Router>
  );
}

export default App;