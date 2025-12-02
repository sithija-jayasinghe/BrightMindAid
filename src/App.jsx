import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import NoteCard from './components/NoteCard';
import UploadModal from './components/UploadModal';
import { supabase } from './lib/supabase';
import { useSEO } from './lib/useSEO';

// Lazy load non-critical pages for better initial load performance
const RequestBoard = lazy(() => import('./pages/RequestBoard'));
const Browse = lazy(() => import('./pages/Browse'));
const VideoTutorials = lazy(() => import('./pages/VideoTutorials'));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'));
const RevisionCards = lazy(() => import('./pages/RevisionCards'));
const ImpactDashboard = lazy(() => import('./pages/ImpactDashboard'));
const ThankYouNotes = lazy(() => import('./pages/ThankYouNotes'));

// Loading fallback component
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
    <p>Loading...</p>
  </div>
);

function Home() {
  useSEO('home');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [gradeCounts, setGradeCounts] = useState({}); // For browse cards

  useEffect(() => {
    fetchDownloads();
    fetchSubjects();
    fetchGradeCounts();

    // Subscribe to realtime changes on the notes table
    const channel = supabase
      .channel('downloads-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes'
        },
        () => {
          // Refetch downloads when any note is updated
          fetchDownloads();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes'
        },
        () => {
          // Refetch when new notes are added
          fetchDownloads();
          fetchNotes();
          fetchSubjects();
          fetchGradeCounts();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, mediumFilter, gradeFilter, typeFilter, yearFilter, subjectFilter, sortBy]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('subject');
      
      if (error) throw error;
      
      // Get unique subjects
      const uniqueSubjects = [...new Set(data.map(note => note.subject).filter(Boolean))];
      setSubjects(uniqueSubjects.sort());
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchGradeCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('grade');
      
      if (error) throw error;
      
      // Count materials per grade
      const counts = {};
      data.forEach(note => {
        if (note.grade) {
          counts[note.grade] = (counts[note.grade] || 0) + 1;
        }
      });
      setGradeCounts(counts);
    } catch (error) {
      console.error('Error fetching grade counts:', error);
    }
  };

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('downloads');
      
      if (error) throw error;
      
      const total = data.reduce((sum, note) => sum + (note.downloads || 0), 0);
      setTotalDownloads(total);
      setTotalNotes(data.length);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('notes')
        .select('*');

      // Apply search query
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,grade.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (mediumFilter) {
        query = query.eq('medium', mediumFilter);
      }

      if (gradeFilter) {
        query = query.eq('grade', gradeFilter);
      }

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }

      if (yearFilter) {
        query = query.eq('year', parseInt(yearFilter));
      }

      if (subjectFilter) {
        query = query.eq('subject', subjectFilter);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most-downloaded':
          query = query.order('downloads', { ascending: false });
          break;
        case 'a-z':
          query = query.order('title', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = searchQuery || mediumFilter || gradeFilter || typeFilter || yearFilter || subjectFilter;
  const displayedNotes = showAll || hasActiveFilters ? notes : notes.slice(0, 6);

  // Get filter summary text
  const getFilterSummary = () => {
    const filters = [];
    if (gradeFilter) filters.push(gradeFilter);
    if (mediumFilter) filters.push(mediumFilter);
    if (typeFilter) filters.push(typeFilter);
    if (yearFilter) filters.push(yearFilter);
    if (subjectFilter) filters.push(subjectFilter);
    return filters.join(' • ');
  };

  return (
    <main className="min-h-screen">
      <Hero 
        onSearch={setSearchQuery} 
        onFilterMedium={setMediumFilter} 
        onFilterGrade={setGradeFilter}
        onFilterType={setTypeFilter}
        onFilterYear={setYearFilter}
        onFilterSubject={setSubjectFilter}
        onSort={setSortBy}
        totalDownloads={totalDownloads}
        totalNotes={totalNotes}
        subjects={subjects}
      />

      {/* Browse by Grade Section */}
      <div className="container py-16">
        <div className="browse-section-header">
          <h2 className="text-3xl mb-2">Browse by Grade</h2>
          <p className="text-gray-500">Find study materials organized by grade level</p>
        </div>
        <div className="browse-grade-cards">
          {[
            { grade: 'Grade 1-5', label: 'Primary', color: '#10b981' },
            { grade: 'Grade 6-9', label: 'Junior Secondary', color: '#06b6d4' },
            { grade: 'Grade 10', label: 'Senior Secondary', color: '#3b82f6' },
            { grade: 'Grade 11 (O/L)', label: 'O/L Exam', color: '#8b5cf6' },
            { grade: 'Grade 12-13 (A/L)', label: 'A/L Exam', color: '#f59e0b' },
          ].map((item) => (
            <Link 
              key={item.grade}
              to={`/browse?grade=${encodeURIComponent(item.grade)}`}
              className="browse-grade-card"
              style={{ '--card-accent': item.color }}
            >
              <div className="grade-card-info">
                <h3>{item.grade}</h3>
                <span className="grade-card-label">{item.label}</span>
                <span className="grade-card-count">
                  {gradeCounts[item.grade] || 0} materials
                </span>
              </div>
              <div className="grade-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : hasActiveFilters ? 'Filtered Results' : 'Recent Uploads'}
            </h2>
            <p className="text-gray-500">
              {hasActiveFilters ? (
                <>Found {notes.length} materials {getFilterSummary() && <span className="filter-summary">• {getFilterSummary()}</span>}</>
              ) : (
                'Latest study materials from our community'
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button 
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="14" height="3" rx="1"/>
                  <rect x="1" y="6" width="14" height="3" rx="1"/>
                  <rect x="1" y="11" width="14" height="3" rx="1"/>
                </svg>
              </button>
            </div>
            {!hasActiveFilters && !showAll && notes.length > 6 && (
              <button onClick={() => setShowAll(true)} className="text-primary font-semibold hover:underline self-start md:self-auto">
                View All →
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-tags"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-author"></div>
                  </div>
                </div>
                <div className="skeleton-footer"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 upload-area">
            <p className="text-3xl mb-2">
              {hasActiveFilters ? 'No materials found' : 'No materials uploaded yet'}
            </p>
            <p className="text-gray-500">
              {hasActiveFilters ? 'Try different filters or search terms' : 'Be the first to share!'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}>
            {displayedNotes.map(note => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                subject={note.subject}
                grade={note.grade}
                author={note.author}
                size={note.file_size}
                type={note.type}
                medium={note.medium}
                downloads={note.downloads}
                fileUrl={note.file_url}
                year={note.year}
                createdAt={note.created_at}
                onDownload={fetchDownloads}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !showAll && !hasActiveFilters && notes.length > 6 && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll(true)} className="btn-secondary">
              Load More Materials ({notes.length - 6} more)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function App() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [liteMode, setLiteMode] = useState(false);

  const toggleLiteMode = () => {
    setLiteMode(!liteMode);
    document.body.classList.toggle('lite-mode');
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Header
          liteMode={liteMode}
          toggleLiteMode={toggleLiteMode}
          onUploadClick={() => setUploadModalOpen(true)}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/requests" element={
            <Suspense fallback={<PageLoader />}>
              <RequestBoard onUploadClick={() => setUploadModalOpen(true)} />
            </Suspense>
          } />
          <Route path="/browse" element={
            <Suspense fallback={<PageLoader />}>
              <Browse />
            </Suspense>
          } />
          <Route path="/videos" element={
            <Suspense fallback={<PageLoader />}>
              <VideoTutorials />
            </Suspense>
          } />
          <Route path="/planner" element={
            <Suspense fallback={<PageLoader />}>
              <StudyPlanner />
            </Suspense>
          } />
          <Route path="/revision" element={
            <Suspense fallback={<PageLoader />}>
              <RevisionCards />
            </Suspense>
          } />
          <Route path="/impact" element={
            <Suspense fallback={<PageLoader />}>
              <ImpactDashboard />
            </Suspense>
          } />
          <Route path="/thanks" element={
            <Suspense fallback={<PageLoader />}>
              <ThankYouNotes />
            </Suspense>
          } />
        </Routes>

        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      </div>
    </Router>
  );
}
