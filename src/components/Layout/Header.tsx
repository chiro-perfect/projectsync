// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    // Typer l'état du menu mobile
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <header id="main-header">
            <div className="header-content container">
                <div className="logo">
                    <NavLink to="/">
                        <h1>PROJECT<span className="logo-highlight">SYNC</span></h1>
                        <p>GESTION ESN</p>
                    </NavLink>
                </div>
                
                {/* Navigation Desktop */}
                <nav role="navigation" className="main-nav-desktop">
                    <ul className="nav-menu">
                        <li><NavLink to="/">PROJETS & ÉQUIPES</NavLink></li>
                        <li><NavLink to="/about">À PROPOS</NavLink></li>
                    </ul>
                </nav>
                
                <button 
                    className="hamburger-menu" 
                    aria-label="Ouvrir le menu de navigation"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>
            
            {/* Navigation Mobile */}
            <nav className={`nav-menu-mobile ${isMenuOpen ? 'active' : ''}`}>
                 <ul className="nav-menu" onClick={() => setIsMenuOpen(false)}>
                    <li><NavLink to="/">PROJETS & ÉQUIPES</NavLink></li>
                    <li><NavLink to="/about">À PROPOS</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;