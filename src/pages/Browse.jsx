import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, BookOpen, FileText, GraduationCap, Folder, Download, Eye, Calendar, User, Search, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';
import './Browse.css';

// Helper to format author display name
const formatAuthorDisplay = (author) => {
    if (!author) return 'Anonymous';
    if (author.startsWith('Anon#')) {
        return 'Anonymous';
    }
    return author;
};

// Icons for different grades
const gradeIcons = {
    'Grade 1-5': '📒',
    'Grade 6-9': '📗',
    'Grade 10': '📘',
    'Grade 11 (O/L)': '📕',
    'Grade 12-13 (A/L)': '📙'
};

// Icons for different types
const typeIcons = {
    'Note': '📝',
    'Past Paper': '📄',
    'Marking Scheme': '✅',
    'Model Paper': '📋',
    'Textbook': '📚',
    'Revision': '🔄'
};

// Colors for subject cards
const subjectColors = [
    'var(--color-primary)',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#6366f1',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
    '#84cc16'
];

export default function Browse() {
    useSEO('browse');
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Navigation state
    const [currentLevel, setCurrentLevel] = useState('grades'); // grades, subjects, types, materials
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    
    // Data state
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [types, setTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search within current level
    const [searchQuery, setSearchQuery] = useState('');

    // Check for URL params on mount
    useEffect(() => {
        const gradeParam = searchParams.get('grade');
        if (gradeParam) {
            // If grade is passed via URL, go directly to subjects
            setSelectedGrade(gradeParam);
            setCurrentLevel('subjects');
            fetchSubjects(gradeParam);
        } else {
            fetchGrades();
        }
    }, []);

    // Fetch grades on mount (only if no URL param)

    // Fetch grades with counts
    const fetchGrades = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notes')
                .select('grade');
            
            if (error) throw error;

            // Count materials per grade
            const gradeCounts = {};
            data.forEach(note => {
                gradeCounts[note.grade] = (gradeCounts[note.grade] || 0) + 1;
            });

            // Convert to array and sort
            const gradeArray = Object.entries(gradeCounts).map(([grade, count]) => ({
                name: grade,
                count,
                icon: gradeIcons[grade] || '📚'
            }));

            // Sort by grade order
            const gradeOrder = ['Grade 1-5', 'Grade 6-9', 'Grade 10', 'Grade 11 (O/L)', 'Grade 12-13 (A/L)'];
            gradeArray.sort((a, b) => gradeOrder.indexOf(a.name) - gradeOrder.indexOf(b.name));

            setGrades(gradeArray);
        } catch (error) {
            console.error('Error fetching grades:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch subjects for selected grade
    const fetchSubjects = async (grade) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notes')
                .select('subject')
                .eq('grade', grade);
            
            if (error) throw error;

            // Count materials per subject (normalize by trimming and lowercase for grouping)
            const subjectCounts = {};
            const subjectOriginalNames = {}; // Store original casing for display
            
            data.forEach(note => {
                if (!note.subject) return;
                // Normalize: trim whitespace and convert to lowercase for grouping
                const normalizedSubject = note.subject.trim().toLowerCase();
                subjectCounts[normalizedSubject] = (subjectCounts[normalizedSubject] || 0) + 1;
                // Keep the first occurrence's original name (with proper casing)
                if (!subjectOriginalNames[normalizedSubject]) {
                    // Capitalize first letter of each word for display
                    subjectOriginalNames[normalizedSubject] = note.subject.trim()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                }
            });

            // Convert to array and sort alphabetically
            const subjectArray = Object.entries(subjectCounts)
                .map(([normalizedSubject, count], index) => ({
                    name: subjectOriginalNames[normalizedSubject],
                    normalizedName: normalizedSubject, // Used for filtering
                    count,
                    color: subjectColors[index % subjectColors.length]
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setSubjects(subjectArray);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch types for selected grade and subject
    const fetchTypes = async (grade, subject) => {
        setLoading(true);
        try {
            // Fetch all notes for this grade, then filter by normalized subject
            const { data, error } = await supabase
                .from('notes')
                .select('type, subject')
                .eq('grade', grade);
            
            if (error) throw error;

            // Filter by normalized subject name (case-insensitive, trimmed)
            const normalizedSelectedSubject = subject.trim().toLowerCase();
            const filteredData = data.filter(note => 
                note.subject && note.subject.trim().toLowerCase() === normalizedSelectedSubject
            );

            // Count materials per type
            const typeCounts = {};
            filteredData.forEach(note => {
                const type = note.type || 'Note';
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            });

            // Convert to array
            const typeArray = Object.entries(typeCounts).map(([type, count]) => ({
                name: type,
                count,
                icon: typeIcons[type] || '📄'
            }));

            setTypes(typeArray);
        } catch (error) {
            console.error('Error fetching types:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch materials for selected grade, subject, and type
    const fetchMaterials = async (grade, subject, type) => {
        setLoading(true);
        try {
            // Fetch all notes for this grade and type, then filter by normalized subject
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('grade', grade)
                .eq('type', type)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // Filter by normalized subject name (case-insensitive, trimmed)
            const normalizedSelectedSubject = subject.trim().toLowerCase();
            const filteredData = data.filter(note => 
                note.subject && note.subject.trim().toLowerCase() === normalizedSelectedSubject
            );
            
            setMaterials(filteredData || []);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    // Navigation handlers
    const handleGradeClick = (grade) => {
        setSelectedGrade(grade);
        setCurrentLevel('subjects');
        setSearchQuery('');
        fetchSubjects(grade);
    };

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setCurrentLevel('types');
        setSearchQuery('');
        fetchTypes(selectedGrade, subject);
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        setCurrentLevel('materials');
        setSearchQuery('');
        fetchMaterials(selectedGrade, selectedSubject, type);
    };

    const handleBack = () => {
        setSearchQuery('');
        if (currentLevel === 'subjects') {
            setCurrentLevel('grades');
            setSelectedGrade(null);
            // Clear URL params
            setSearchParams({});
            fetchGrades();
        } else if (currentLevel === 'types') {
            setCurrentLevel('subjects');
            setSelectedSubject(null);
        } else if (currentLevel === 'materials') {
            setCurrentLevel('types');
            setSelectedType(null);
        }
    };

    // Download handler
    const handleDownload = async (material) => {
        // Increment download count
        try {
            await supabase
                .from('notes')
                .update({ downloads: (material.downloads || 0) + 1 })
                .eq('id', material.id);
        } catch (error) {
            console.error('Error updating downloads:', error);
        }

        // Open file
        window.open(material.file_url, '_blank');
    };

    // Get breadcrumb
    const getBreadcrumb = () => {
        const crumbs = [];
        if (selectedGrade) crumbs.push(selectedGrade);
        if (selectedSubject) crumbs.push(selectedSubject);
        if (selectedType) crumbs.push(selectedType);
        return crumbs.join(' > ');
    };

    // Filter current items based on search
    const filterItems = (items) => {
        if (!searchQuery) return items;
        return items.filter(item => 
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Render loading state
    if (loading && grades.length === 0) {
        return (
            <div className="browse-container">
                <div className="browse-loading">
                    <div className="loader-spinner"></div>
                    <p>Loading materials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="browse-container">
            {/* Header */}
            <div className="browse-header">
                <div className="browse-header-top">
                    {currentLevel !== 'grades' && (
                        <button className="back-button" onClick={handleBack}>
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                    )}
                    <div className="browse-title-section">
                        <Layers size={24} className="browse-icon" />
                        <h1>Browse Materials</h1>
                    </div>
                </div>
                
                {currentLevel !== 'grades' && (
                    <div className="breadcrumb">
                        <span className="breadcrumb-home" onClick={() => {
                            setCurrentLevel('grades');
                            setSelectedGrade(null);
                            setSelectedSubject(null);
                            setSelectedType(null);
                        }}>
                            All Grades
                        </span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{getBreadcrumb()}</span>
                    </div>
                )}

                {/* Search within current level */}
                <div className="browse-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder={`Search ${currentLevel}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="browse-content">
                {loading ? (
                    <div className="browse-loading-inline">
                        <div className="loader-spinner-small"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Grades Level */}
                        {currentLevel === 'grades' && (
                            <div className="browse-section">
                                <h2 className="section-title">
                                    <GraduationCap size={20} />
                                    Select Grade Level
                                </h2>
                                <p className="section-subtitle">
                                    Choose your grade to explore available study materials
                                </p>
                                
                                {filterItems(grades).length === 0 ? (
                                    <div className="browse-empty">
                                        <BookOpen size={48} />
                                        <h3>No Materials Yet</h3>
                                        <p>Be the first to upload study materials!</p>
                                    </div>
                                ) : (
                                    <div className="browse-grid grades-grid">
                                        {filterItems(grades).map((grade) => (
                                            <div 
                                                key={grade.name}
                                                className="browse-card grade-card"
                                                onClick={() => handleGradeClick(grade.name)}
                                            >
                                                <div className="card-icon">{grade.icon}</div>
                                                <div className="card-info">
                                                    <h3>{grade.name}</h3>
                                                    <span className="card-count">
                                                        {grade.count} {grade.count === 1 ? 'material' : 'materials'}
                                                    </span>
                                                </div>
                                                <div className="card-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subjects Level */}
                        {currentLevel === 'subjects' && (
                            <div className="browse-section">
                                <h2 className="section-title">
                                    <BookOpen size={20} />
                                    Select Subject
                                </h2>
                                <p className="section-subtitle">
                                    Subjects available in {selectedGrade}
                                </p>
                                
                                {filterItems(subjects).length === 0 ? (
                                    <div className="browse-empty">
                                        <Folder size={48} />
                                        <h3>No Subjects Found</h3>
                                        <p>No materials uploaded for this grade yet.</p>
                                    </div>
                                ) : (
                                    <div className="browse-grid subjects-grid">
                                        {filterItems(subjects).map((subject, index) => (
                                            <div 
                                                key={subject.name}
                                                className="browse-card subject-card"
                                                onClick={() => handleSubjectClick(subject.name)}
                                                style={{ '--card-color': subject.color }}
                                            >
                                                <div className="subject-icon-wrapper" style={{ background: subject.color }}>
                                                    <BookOpen size={24} />
                                                </div>
                                                <div className="card-info">
                                                    <h3>{subject.name}</h3>
                                                    <span className="card-count">
                                                        {subject.count} {subject.count === 1 ? 'material' : 'materials'}
                                                    </span>
                                                </div>
                                                <div className="card-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Types Level */}
                        {currentLevel === 'types' && (
                            <div className="browse-section">
                                <h2 className="section-title">
                                    <FileText size={20} />
                                    Select Material Type
                                </h2>
                                <p className="section-subtitle">
                                    Types of materials available for {selectedSubject}
                                </p>
                                
                                {filterItems(types).length === 0 ? (
                                    <div className="browse-empty">
                                        <FileText size={48} />
                                        <h3>No Materials Found</h3>
                                        <p>No materials uploaded for this subject yet.</p>
                                    </div>
                                ) : (
                                    <div className="browse-grid types-grid">
                                        {filterItems(types).map((type) => (
                                            <div 
                                                key={type.name}
                                                className="browse-card type-card"
                                                onClick={() => handleTypeClick(type.name)}
                                            >
                                                <div className="type-icon">{type.icon}</div>
                                                <div className="card-info">
                                                    <h3>{type.name}</h3>
                                                    <span className="card-count">
                                                        {type.count} {type.count === 1 ? 'item' : 'items'}
                                                    </span>
                                                </div>
                                                <div className="card-arrow">→</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Materials Level */}
                        {currentLevel === 'materials' && (
                            <div className="browse-section">
                                <h2 className="section-title">
                                    <FileText size={20} />
                                    {selectedType}
                                </h2>
                                <p className="section-subtitle">
                                    {materials.length} {materials.length === 1 ? 'item' : 'items'} found
                                </p>
                                
                                {materials.length === 0 ? (
                                    <div className="browse-empty">
                                        <FileText size={48} />
                                        <h3>No Materials Found</h3>
                                        <p>No {selectedType} uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="materials-list">
                                        {materials.map((material) => (
                                            <div key={material.id} className="material-card">
                                                <div className="material-icon">
                                                    {typeIcons[material.type] || '📄'}
                                                </div>
                                                <div className="material-info">
                                                    <h3 className="material-title">{material.title}</h3>
                                                    <div className="material-meta">
                                                        {material.medium && (
                                                            <span className="meta-tag medium">{material.medium}</span>
                                                        )}
                                                        {material.year && (
                                                            <span className="meta-tag year">
                                                                <Calendar size={12} />
                                                                {material.year}
                                                            </span>
                                                        )}
                                                        {material.author && (
                                                            <span className="meta-tag author" title={material.author?.startsWith('Anon#') ? `ID: ${material.author}` : ''}>
                                                                <User size={12} />
                                                                {formatAuthorDisplay(material.author)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="material-stats">
                                                        <span className="stat">
                                                            <Download size={14} />
                                                            {material.downloads || 0} downloads
                                                        </span>
                                                        {material.file_size && (
                                                            <span className="stat">
                                                                {material.file_size}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    className="download-btn"
                                                    onClick={() => handleDownload(material)}
                                                >
                                                    <Download size={18} />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
