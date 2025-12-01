import React, { useState } from 'react';
import { Search, Filter, Sparkles, BookOpen, Users, GraduationCap, FileText, TrendingUp, X } from 'lucide-react';

export default function Hero({ 
    onSearch, 
    onFilterMedium, 
    onFilterGrade,
    onFilterType,
    onFilterYear,
    onFilterSubject,
    onSort,
    totalDownloads = 0,
    totalNotes = 0,
    subjects = []
}) {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        medium: '',
        grade: '',
        type: '',
        year: '',
        subject: ''
    });

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => ({ ...prev, [filterType]: value }));
        
        switch(filterType) {
            case 'medium':
                onFilterMedium(value);
                break;
            case 'grade':
                onFilterGrade(value);
                break;
            case 'type':
                onFilterType(value);
                break;
            case 'year':
                onFilterYear(value);
                break;
            case 'subject':
                onFilterSubject(value);
                break;
        }
    };

    const clearAllFilters = () => {
        setActiveFilters({
            medium: '',
            grade: '',
            type: '',
            year: '',
            subject: ''
        });
        onFilterMedium('');
        onFilterGrade('');
        onFilterType('');
        onFilterYear('');
        onFilterSubject('');
    };

    const hasActiveFilters = Object.values(activeFilters).some(v => v !== '');

    // Generate years from 2015 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

    return (
        <section className="hero">
            {/* Background Image */}
            <div className="hero-bg">
                <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75" 
                    alt="Students studying together"
                    fetchPriority="high"
                    decoding="async"
                    width="800"
                    height="533"
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
                    Access free study materials shared by students across Sri Lanka. 
                    Notes, past papers, and more — all in one place.
                </p>
                
                {/* Main Search Box */}
                <div className="hero-search-box">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search notes, past papers, subjects..."
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="search-divider"></div>
                    <button 
                        className="filter-toggle-btn"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        <Filter size={16} />
                        <span>Filters</span>
                        {hasActiveFilters && <span className="filter-badge">{Object.values(activeFilters).filter(v => v).length}</span>}
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="advanced-filters-panel">
                        <div className="filters-header">
                            <h4>Filter Materials</h4>
                            {hasActiveFilters && (
                                <button className="clear-filters-btn" onClick={clearAllFilters}>
                                    <X size={14} />
                                    Clear All
                                </button>
                            )}
                        </div>
                        
                        <div className="filters-grid">
                            {/* Grade Filter */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    <GraduationCap size={14} />
                                    Grade Level
                                </label>
                                <select 
                                    value={activeFilters.grade}
                                    onChange={(e) => handleFilterChange('grade', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Grades</option>
                                    <option value="Grade 1-5">Grade 1-5 (Primary)</option>
                                    <option value="Grade 6-9">Grade 6-9 (Junior Secondary)</option>
                                    <option value="Grade 10">Grade 10</option>
                                    <option value="Grade 11 (O/L)">Grade 11 - O/L (Ordinary Level)</option>
                                    <option value="Grade 12-13 (A/L)">Grade 12-13 - A/L (Advanced Level)</option>
                                </select>
                            </div>

                            {/* Medium Filter */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    <BookOpen size={14} />
                                    Medium
                                </label>
                                <select 
                                    value={activeFilters.medium}
                                    onChange={(e) => handleFilterChange('medium', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Mediums</option>
                                    <option value="Sinhala">සිංහල (Sinhala)</option>
                                    <option value="English">English</option>
                                    <option value="Tamil">தமிழ் (Tamil)</option>
                                </select>
                            </div>

                            {/* Type Filter */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    <FileText size={14} />
                                    Material Type
                                </label>
                                <select 
                                    value={activeFilters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Types</option>
                                    <option value="Note">Notes</option>
                                    <option value="Past Paper">Past Papers</option>
                                    <option value="Marking Scheme">Marking Schemes</option>
                                    <option value="Model Paper">Model Papers</option>
                                    <option value="Textbook">Textbooks</option>
                                    <option value="Revision">Revision Materials</option>
                                </select>
                            </div>

                            {/* Year Filter (for past papers) */}
                            <div className="filter-group">
                                <label className="filter-label">
                                    <TrendingUp size={14} />
                                    Year
                                </label>
                                <select 
                                    value={activeFilters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="">All Years</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Filter */}
                            {subjects.length > 0 && (
                                <div className="filter-group filter-group-wide">
                                    <label className="filter-label">
                                        <BookOpen size={14} />
                                        Subject
                                    </label>
                                    <select 
                                        value={activeFilters.subject}
                                        onChange={(e) => handleFilterChange('subject', e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Sort Options */}
                        <div className="sort-section">
                            <label className="filter-label">Sort By:</label>
                            <div className="sort-buttons">
                                <button className="sort-btn" onClick={() => onSort('newest')}>
                                    Newest First
                                </button>
                                <button className="sort-btn" onClick={() => onSort('oldest')}>
                                    Oldest First
                                </button>
                                <button className="sort-btn" onClick={() => onSort('most-downloaded')}>
                                    Most Downloaded
                                </button>
                                <button className="sort-btn" onClick={() => onSort('a-z')}>
                                    A-Z
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Filter Chips */}
                <div className="quick-filters">
                    <button 
                        className={`quick-filter-chip ${activeFilters.grade === 'Grade 11 (O/L)' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('grade', activeFilters.grade === 'Grade 11 (O/L)' ? '' : 'Grade 11 (O/L)')}
                    >
                        O/L Materials
                    </button>
                    <button 
                        className={`quick-filter-chip ${activeFilters.grade === 'Grade 12-13 (A/L)' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('grade', activeFilters.grade === 'Grade 12-13 (A/L)' ? '' : 'Grade 12-13 (A/L)')}
                    >
                        A/L Materials
                    </button>
                    <button 
                        className={`quick-filter-chip ${activeFilters.type === 'Past Paper' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('type', activeFilters.type === 'Past Paper' ? '' : 'Past Paper')}
                    >
                        Past Papers
                    </button>
                    <button 
                        className={`quick-filter-chip ${activeFilters.type === 'Note' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('type', activeFilters.type === 'Note' ? '' : 'Note')}
                    >
                        Notes
                    </button>
                </div>

                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-value">{totalDownloads.toLocaleString()}+</span>
                        <span className="stat-label">Downloads</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">{totalNotes.toLocaleString()}</span>
                        <span className="stat-label">Materials</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">100%</span>
                        <span className="stat-label">Free Forever</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
