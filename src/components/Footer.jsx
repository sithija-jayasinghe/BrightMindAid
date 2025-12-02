import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart, BookOpen, MessageSquare, Video, Calendar, BarChart3, Sparkles } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/', label: 'Home', icon: BookOpen },
        { path: '/browse', label: 'Browse', icon: BookOpen },
        { path: '/requests', label: 'Requests', icon: MessageSquare },
        { path: '/videos', label: 'Videos', icon: Video },
        { path: '/planner', label: 'Planner', icon: Calendar },
        { path: '/impact', label: 'Impact', icon: BarChart3 },
    ];

    const socialLinks = [
        { 
            href: 'https://www.linkedin.com/in/sithija-harshana-jayasinghe-552822340/', 
            label: 'LinkedIn', 
            icon: Linkedin 
        },
        { 
            href: 'https://github.com/sithija-jayasinghe', 
            label: 'GitHub', 
            icon: Github 
        },
        { 
            href: 'mailto:harshanajayasinghe113@gmail.com', 
            label: 'Email', 
            icon: Mail 
        },
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Brand & Mission */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Sparkles size={24} />
                            <span>BrightMindAid</span>
                        </div>
                        <p className="footer-mission">
                            Helping students rebuild their future, one note at a time.
                        </p>
                        {/* Social Links */}
                        <div className="footer-social">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Quick Links</h4>
                        <nav className="footer-nav">
                            {quickLinks.map((link) => (
                                <Link key={link.path} to={link.path} className="footer-link">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources */}
                    <div className="footer-links">
                        <h4 className="footer-heading">Resources</h4>
                        <nav className="footer-nav">
                            <Link to="/revision" className="footer-link">Revision Cards</Link>
                            <Link to="/thanks" className="footer-link">Thank You Notes</Link>
                            <a href="https://github.com/sithija-jayasinghe/EduRelief" target="_blank" rel="noopener noreferrer" className="footer-link">
                                Source Code
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} BrightMindAid | Developed with <Heart size={14} className="heart-icon" /> by{' '}
                        <a 
                            href="https://www.linkedin.com/in/sithija-jayasinghe/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="developer-link"
                        >
                            Sithija Harshana Jayasinghe
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
