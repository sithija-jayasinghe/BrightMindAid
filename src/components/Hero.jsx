import React from 'react';
import { Search, Filter, Sparkles, BookOpen, Users } from 'lucide-react';

export default function Hero({ onSearch, onFilterMedium, totalDownloads = 0 }) {
    return (
        <section className="hero">
            {/* Background Image */}
            <div className="hero-bg">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" 
                    alt="Students studying together"
                />
            </div>
            
            <div className="container hero-content">
                <div className="badge-pill">
                    <Sparkles size={14} />
                    <span>Free for all Sri Lankan students</span>
                </div>
                
                <h1>
                    Learn Together,<br/>
                    <span className="highlight">Grow Together.</span>
                </h1>
                
                <p>
                    Access thousands of free study materials shared by students across Sri Lanka. 
                    Notes, past papers, and more — all in one place.
                </p>
                
                <div className="hero-search-box">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search notes, past papers..."
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="search-divider"></div>
                    <div className="search-select-wrapper">
                        <Filter className="filter-icon" size={16} />
                        <select onChange={(e) => onFilterMedium(e.target.value)}>
                            <option value="">All Mediums</option>
                            <option value="Sinhala">Sinhala</option>
                            <option value="English">English</option>
                            <option value="Tamil">Tamil</option>
                        </select>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-value">{totalDownloads.toLocaleString()}+</span>
                        <span className="stat-label">Downloads</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">100%</span>
                        <span className="stat-label">Free Forever</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">24/7</span>
                        <span className="stat-label">Access</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
