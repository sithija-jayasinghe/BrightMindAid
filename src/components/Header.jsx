import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Zap, ZapOff, Upload, Menu, X } from 'lucide-react';

export default function Header({ liteMode, toggleLiteMode, onUploadClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="header">
            <div className="container header-content">
                {/* Logo */}
                <Link to="/" className="logo-link" onClick={closeMenu}>
                    <div className="logo-icon">
                        <GraduationCap size={24} />
                    </div>
                    <div className="logo-text">
                        <h1>BrightMindAid</h1>
                        <span>Together We Learn & together we Grow</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="nav-desktop">
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/requests"
                            className={`nav-link ${isActive('/requests') ? 'active' : ''}`}
                        >
                            Request Notes
                        </Link>
                    </div>

                    <div className="nav-actions">
                        <button
                            onClick={onUploadClick}
                            className="btn-primary"
                        >
                            <Upload size={16} />
                            Share Material
                        </button>

                        <button
                            onClick={toggleLiteMode}
                            className="btn-icon"
                        >
                            {liteMode ? <ZapOff size={18} /> : <Zap size={18} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Nav Overlay */}
                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-nav-content">
                        <Link
                            to="/"
                            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            Home
                        </Link>
                        <Link
                            to="/requests"
                            className={`mobile-nav-link ${isActive('/requests') ? 'active' : ''}`}
                            onClick={closeMenu}
                        >
                            Request Notes
                        </Link>
                        
                        <div className="mobile-nav-actions">
                            <button
                                onClick={() => {
                                    onUploadClick();
                                    closeMenu();
                                }}
                                className="btn-primary btn-full"
                            >
                                <Upload size={16} />
                                Share Material
                            </button>

                            <button
                                onClick={toggleLiteMode}
                                className="btn-secondary btn-full"
                            >
                                {liteMode ? <ZapOff size={18} /> : <Zap size={18} />}
                                {liteMode ? "Disable Lite Mode" : "Enable Lite Mode"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

