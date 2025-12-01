import React, { useState } from 'react';
import { Play, ExternalLink, Search, Filter, BookOpen, Youtube, Clock, ThumbsUp, Video } from 'lucide-react';
import './VideoTutorials.css';

// Curated educational video resources for Sri Lankan students
const videoResources = {
    'Grade 11 (O/L)': {
        'Mathematics': [
            { id: 1, title: 'O/L Mathematics - Algebra Complete', url: 'https://www.youtube.com/results?search_query=O+level+mathematics+algebra+sinhala', duration: '2h 30m', language: 'Sinhala' },
            { id: 2, title: 'Trigonometry Made Easy', url: 'https://www.youtube.com/results?search_query=O+level+trigonometry+sinhala', duration: '1h 45m', language: 'Sinhala' },
            { id: 3, title: 'O/L Maths Past Paper Discussion', url: 'https://www.youtube.com/results?search_query=O+level+maths+past+paper+2023', duration: '3h', language: 'Sinhala' },
            { id: 4, title: 'Geometry & Mensuration', url: 'https://www.youtube.com/results?search_query=O+level+geometry+mensuration', duration: '2h', language: 'Sinhala' },
        ],
        'Science': [
            { id: 5, title: 'O/L Science - Biology Complete', url: 'https://www.youtube.com/results?search_query=O+level+science+biology+sinhala', duration: '4h', language: 'Sinhala' },
            { id: 6, title: 'Physics Fundamentals O/L', url: 'https://www.youtube.com/results?search_query=O+level+physics+sinhala', duration: '3h', language: 'Sinhala' },
            { id: 7, title: 'Chemistry O/L Full Course', url: 'https://www.youtube.com/results?search_query=O+level+chemistry+sinhala', duration: '3h 30m', language: 'Sinhala' },
        ],
        'English': [
            { id: 8, title: 'O/L English Grammar Complete', url: 'https://www.youtube.com/results?search_query=O+level+english+grammar+sri+lanka', duration: '2h', language: 'English' },
            { id: 9, title: 'Essay Writing Tips O/L', url: 'https://www.youtube.com/results?search_query=O+level+essay+writing+sri+lanka', duration: '1h 30m', language: 'English' },
        ],
        'History': [
            { id: 10, title: 'Sri Lankan History Complete', url: 'https://www.youtube.com/results?search_query=O+level+history+sri+lanka+sinhala', duration: '5h', language: 'Sinhala' },
        ],
        'ICT': [
            { id: 11, title: 'O/L ICT Full Course', url: 'https://www.youtube.com/results?search_query=O+level+ICT+sinhala', duration: '6h', language: 'Sinhala' },
            { id: 12, title: 'Programming Basics for O/L', url: 'https://www.youtube.com/results?search_query=O+level+programming+basics', duration: '3h', language: 'Sinhala' },
        ]
    },
    'Grade 12-13 (A/L)': {
        'Combined Mathematics': [
            { id: 13, title: 'Pure Maths - Calculus Complete', url: 'https://www.youtube.com/results?search_query=A+level+pure+maths+calculus+sinhala', duration: '8h', language: 'Sinhala' },
            { id: 14, title: 'Applied Maths - Mechanics', url: 'https://www.youtube.com/results?search_query=A+level+applied+maths+mechanics+sinhala', duration: '6h', language: 'Sinhala' },
            { id: 15, title: 'Statistics for A/L', url: 'https://www.youtube.com/results?search_query=A+level+statistics+sinhala', duration: '4h', language: 'Sinhala' },
            { id: 16, title: 'Coordinate Geometry A/L', url: 'https://www.youtube.com/results?search_query=A+level+coordinate+geometry+sinhala', duration: '5h', language: 'Sinhala' },
        ],
        'Physics': [
            { id: 17, title: 'A/L Physics - Mechanics Complete', url: 'https://www.youtube.com/results?search_query=A+level+physics+mechanics+sinhala', duration: '10h', language: 'Sinhala' },
            { id: 18, title: 'Electricity & Magnetism A/L', url: 'https://www.youtube.com/results?search_query=A+level+physics+electricity+magnetism', duration: '8h', language: 'Sinhala' },
            { id: 19, title: 'Waves & Optics A/L', url: 'https://www.youtube.com/results?search_query=A+level+physics+waves+optics', duration: '6h', language: 'Sinhala' },
            { id: 20, title: 'Modern Physics & Nuclear', url: 'https://www.youtube.com/results?search_query=A+level+modern+physics+nuclear', duration: '5h', language: 'Sinhala' },
        ],
        'Chemistry': [
            { id: 21, title: 'Organic Chemistry Complete A/L', url: 'https://www.youtube.com/results?search_query=A+level+organic+chemistry+sinhala', duration: '12h', language: 'Sinhala' },
            { id: 22, title: 'Inorganic Chemistry A/L', url: 'https://www.youtube.com/results?search_query=A+level+inorganic+chemistry+sinhala', duration: '8h', language: 'Sinhala' },
            { id: 23, title: 'Physical Chemistry A/L', url: 'https://www.youtube.com/results?search_query=A+level+physical+chemistry+sinhala', duration: '10h', language: 'Sinhala' },
        ],
        'Biology': [
            { id: 24, title: 'Cell Biology & Genetics A/L', url: 'https://www.youtube.com/results?search_query=A+level+biology+genetics+sinhala', duration: '10h', language: 'Sinhala' },
            { id: 25, title: 'Human Biology A/L', url: 'https://www.youtube.com/results?search_query=A+level+human+biology+sinhala', duration: '12h', language: 'Sinhala' },
            { id: 26, title: 'Plant Biology & Ecology A/L', url: 'https://www.youtube.com/results?search_query=A+level+plant+biology+ecology', duration: '8h', language: 'Sinhala' },
        ],
        'Economics': [
            { id: 27, title: 'Microeconomics A/L Complete', url: 'https://www.youtube.com/results?search_query=A+level+microeconomics+sinhala', duration: '8h', language: 'Sinhala' },
            { id: 28, title: 'Macroeconomics A/L', url: 'https://www.youtube.com/results?search_query=A+level+macroeconomics+sinhala', duration: '8h', language: 'Sinhala' },
        ],
        'Accounting': [
            { id: 29, title: 'Financial Accounting A/L', url: 'https://www.youtube.com/results?search_query=A+level+accounting+sinhala', duration: '10h', language: 'Sinhala' },
            { id: 30, title: 'Company Accounts A/L', url: 'https://www.youtube.com/results?search_query=A+level+company+accounts+sinhala', duration: '6h', language: 'Sinhala' },
        ],
        'ICT': [
            { id: 31, title: 'Programming with Python A/L', url: 'https://www.youtube.com/results?search_query=A+level+ICT+programming+python', duration: '15h', language: 'Sinhala' },
            { id: 32, title: 'Database Management A/L', url: 'https://www.youtube.com/results?search_query=A+level+ICT+database+sinhala', duration: '8h', language: 'Sinhala' },
            { id: 33, title: 'Web Development A/L', url: 'https://www.youtube.com/results?search_query=A+level+web+development+html+css', duration: '10h', language: 'English' },
        ]
    }
};

// Official educational channels
const officialChannels = [
    { name: 'NIE Sri Lanka', url: 'https://www.youtube.com/@ChannelNIE', description: 'Official National Institute of Education channel', language: 'Sinhala/Tamil/English' },
    { name: 'e-thaksalawa', url: 'https://www.youtube.com/@ethaksalawa-Official', description: 'Government e-learning platform', language: 'Sinhala/Tamil/English' },
    { name: 'DP Education', url: 'https://www.youtube.com/results?search_query=dp+education', description: 'Free educational videos', language: 'Sinhala/English' },
];

export default function VideoTutorials() {
    const [selectedGrade, setSelectedGrade] = useState('Grade 11 (O/L)');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [languageFilter, setLanguageFilter] = useState('');

    const subjects = Object.keys(videoResources[selectedGrade] || {});
    
    const getFilteredVideos = () => {
        let videos = [];
        
        if (selectedSubject) {
            videos = videoResources[selectedGrade]?.[selectedSubject] || [];
        } else {
            // Get all videos for the grade
            Object.values(videoResources[selectedGrade] || {}).forEach(subjectVideos => {
                videos = [...videos, ...subjectVideos];
            });
        }

        // Apply search filter
        if (searchQuery) {
            videos = videos.filter(v => 
                v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.channel.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply language filter
        if (languageFilter) {
            videos = videos.filter(v => v.language === languageFilter);
        }

        return videos;
    };

    const filteredVideos = getFilteredVideos();

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="page-header">
                <div className="header-title-row">
                    <Video size={28} className="header-icon" />
                    <h1 className="text-3xl">Video Tutorials</h1>
                </div>
                <p className="page-description">
                    Free educational videos curated for O/L and A/L students. 
                    Learn from the best Sri Lankan educators!
                </p>
            </div>

            {/* Official Channels */}
            <div className="official-channels">
                <h3>Official Educational Channels</h3>
                <div className="channels-grid">
                    {officialChannels.map((channel, idx) => (
                        <a 
                            key={idx}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="channel-card"
                        >
                            <div className="channel-icon">
                                <Youtube size={24} />
                            </div>
                            <div className="channel-info">
                                <h4>{channel.name}</h4>
                                <p>{channel.description}</p>
                                <span className="channel-lang">{channel.language}</span>
                            </div>
                            <ExternalLink size={16} className="external-icon" />
                        </a>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="video-filters">
                <div className="filter-row">
                    {/* Grade Tabs */}
                    <div className="grade-tabs">
                        {Object.keys(videoResources).map(grade => (
                            <button
                                key={grade}
                                className={`grade-tab ${selectedGrade === grade ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedGrade(grade);
                                    setSelectedSubject('');
                                }}
                            >
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-row">
                    {/* Search */}
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Subject Filter */}
                    <select 
                        className="filter-select-light"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>

                    {/* Language Filter */}
                    <select
                        className="filter-select-light"
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                    >
                        <option value="">All Languages</option>
                        <option value="Sinhala">සිංහල</option>
                        <option value="English">English</option>
                        <option value="Tamil">தமிழ்</option>
                    </select>
                </div>
            </div>

            {/* Subject Pills */}
            <div className="subject-pills">
                <button 
                    className={`subject-pill ${selectedSubject === '' ? 'active' : ''}`}
                    onClick={() => setSelectedSubject('')}
                >
                    All
                </button>
                {subjects.map(subject => (
                    <button
                        key={subject}
                        className={`subject-pill ${selectedSubject === subject ? 'active' : ''}`}
                        onClick={() => setSelectedSubject(subject)}
                    >
                        {subject}
                    </button>
                ))}
            </div>

            {/* Video Grid */}
            <div className="resource-grid">
                {filteredVideos.length === 0 ? (
                    <div className="no-videos">
                        <BookOpen size={48} />
                        <p>No resources found. Try different filters.</p>
                    </div>
                ) : (
                    filteredVideos.map(video => (
                        <a 
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card"
                        >
                            <div className="resource-icon">
                                <Youtube size={24} />
                            </div>
                            <div className="resource-content">
                                <h4>{video.title}</h4>
                                <p className="resource-channel">{video.channel}</p>
                                <div className="resource-meta">
                                    <span className="resource-duration">
                                        <Clock size={14} />
                                        {video.duration}
                                    </span>
                                    <span className={`lang-badge ${video.language.toLowerCase()}`}>
                                        {video.language}
                                    </span>
                                </div>
                            </div>
                            <div className="resource-action">
                                <ExternalLink size={18} />
                            </div>
                        </a>
                    ))
                )}
            </div>

            {/* YouTube Search Tip */}
            <div className="search-tip">
                <h3>🔍 Can't find what you need?</h3>
                <p>Search directly on YouTube for more resources:</p>
                <div className="search-suggestions">
                    <a href="https://www.youtube.com/results?search_query=O+level+past+paper+discussion+sinhala" target="_blank" rel="noopener noreferrer">
                        O/L Past Papers
                    </a>
                    <a href="https://www.youtube.com/results?search_query=A+level+2024+revision+sinhala" target="_blank" rel="noopener noreferrer">
                        A/L Revision 2024
                    </a>
                    <a href="https://www.youtube.com/results?search_query=e+thaksalawa+lessons" target="_blank" rel="noopener noreferrer">
                        e-Thaksalawa Lessons
                    </a>
                </div>
            </div>
        </div>
    );
}
