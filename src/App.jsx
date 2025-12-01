import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import NoteCard from './components/NoteCard';
import RequestBoard from './pages/RequestBoard';
import UploadModal from './components/UploadModal';
import { supabase } from './lib/supabase';

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState('');
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchDownloads();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, mediumFilter]);

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('downloads');
      
      if (error) throw error;
      
      const total = data.reduce((sum, note) => sum + (note.downloads || 0), 0);
      setTotalDownloads(total);
    } catch (error) {
      console.error('Error fetching downloads:', error);
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%,grade.ilike.%${searchQuery}%`);
      }

      if (mediumFilter) {
        query = query.eq('medium', mediumFilter);
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

  const displayedNotes = showAll || searchQuery ? notes : notes.slice(0, 6);

  return (
    <main className="min-h-screen">
      <Hero onSearch={setSearchQuery} onFilterMedium={setMediumFilter} totalDownloads={totalDownloads} />
      <div className="container py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl mb-2">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Uploads'}
            </h2>
            <p className="text-gray-500">
              {searchQuery ? `Found ${notes.length} materials` : 'Latest study materials from our community'}
            </p>
          </div>
          {!searchQuery && !showAll && notes.length > 6 && (
            <button onClick={() => setShowAll(true)} className="text-primary font-semibold hover:underline">
              View All →
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading materials...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 upload-area">
            <p className="text-3xl mb-2">
              {searchQuery ? 'No materials found' : 'No materials uploaded yet'}
            </p>
            <p className="text-gray-500">
              {searchQuery ? 'Try different keywords' : 'Be the first to share!'}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
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
                onDownload={fetchDownloads}
              />
            ))}
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
          <Route path="/requests" element={<RequestBoard onUploadClick={() => setUploadModalOpen(true)} />} />
        </Routes>

        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
        />
      </div>
    </Router>
  );
}
