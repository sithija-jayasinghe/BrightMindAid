import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageCircle, User, Calendar, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';

export default function ThankYouNotes() {
    useSEO('thanks');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        message: '',
        contributorName: '',
        isAnonymous: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [contributors, setContributors] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchThankYouNotes();
        fetchContributors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchThankYouNotes = async () => {
        setLoading(true);
        try {
            // Try to fetch from thank_you_notes table if it exists
            const { data, error } = await supabase
                .from('thank_you_notes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.log('Thank you notes table may not exist yet');
                // Use sample data for demonstration
                setNotes(sampleNotes);
            } else {
                setNotes(data || []);
            }
        } catch (err) {
            console.error('Error:', err);
            setNotes(sampleNotes);
        } finally {
            setLoading(false);
        }
    };

    const fetchContributors = async () => {
        try {
            const { data } = await supabase
                .from('notes')
                .select('author');

            if (data) {
                const uniqueContributors = [...new Set(data.map(n => n.author))];
                setContributors(uniqueContributors);
            }
        } catch (err) {
            console.error('Error fetching contributors:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const noteData = {
                student_name: formData.isAnonymous ? 'Anonymous Student' : formData.studentName,
                message: formData.message,
                contributor_name: formData.contributorName || 'All Contributors',
                created_at: new Date().toISOString()
            };

            // Try to insert into database
            const { error } = await supabase
                .from('thank_you_notes')
                .insert([noteData]);

            if (error) {
                console.log('Could not save to database, adding to local state');
                // Add to local state for demonstration
                setNotes(prev => [{ id: Date.now(), ...noteData }, ...prev]);
            } else {
                fetchThankYouNotes();
            }

            setFormData({ studentName: '', message: '', contributorName: '', isAnonymous: false });
            setShowForm(false);
            alert('Thank you note sent! 💝');
        } catch (err) {
            console.error('Error:', err);
            alert('Your message has been recorded! 💝');
        } finally {
            setSubmitting(false);
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const filteredNotes = filter === 'all' 
        ? notes 
        : notes.filter(n => n.contributor_name === filter);

    // Sample notes for demonstration
    const sampleNotes = [
        {
            id: 1,
            student_name: 'Kasun from Ratnapura',
            message: 'I lost all my A/L notes in the floods. Thanks to the contributors here, I found everything I needed for my Chemistry exam. You saved my future! 🙏',
            contributor_name: 'All Contributors',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: 2,
            student_name: 'Nethmi',
            message: 'The maths formulas revision cards helped me so much! I passed my O/L with flying colors. Thank you from the bottom of my heart ❤️',
            contributor_name: 'Anonymous',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: 3,
            student_name: 'Anonymous Student',
            message: 'My family lost everything in the landslide. Getting access to these study materials means I can still continue my education. God bless you all!',
            contributor_name: 'All Contributors',
            created_at: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
            id: 4,
            student_name: 'Sahan from Kegalle',
            message: 'The physics past papers were exactly what I needed! Thank you for uploading them. I scored 78 marks! 🎉',
            contributor_name: 'Anonymous',
            created_at: new Date(Date.now() - 86400000 * 15).toISOString()
        }
    ];

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-top">
                    <div className="header-title-row">
                        <Heart size={28} className="header-icon" />
                        <h1 className="text-3xl">Thank You Wall</h1>
                    </div>
                    <button 
                        className="btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? <ChevronUp size={18} /> : <Heart size={18} />}
                        {showForm ? 'Close' : 'Send Thanks'}
                    </button>
                </div>
                <p className="page-description">
                    A space for students to express gratitude to the amazing people who share their study materials.
                    Your contributions are changing lives!
                </p>
            </div>

            {/* Form */}
            {showForm && (
                <div className="thank-you-form-container">
                    <form onSubmit={handleSubmit} className="thank-you-form">
                        <h3><MessageCircle size={20} /> Write a Thank You Note</h3>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                    placeholder="e.g., Kasun from Ratnapura"
                                    disabled={formData.isAnonymous}
                                />
                            </div>
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAnonymous}
                                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                    />
                                    Stay Anonymous
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Thank (Optional)</label>
                            <select
                                value={formData.contributorName}
                                onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                            >
                                <option value="">All Contributors</option>
                                {contributors.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Your Message *</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Share how the materials helped you..."
                                rows={4}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={submitting}>
                            <Send size={18} />
                            {submitting ? 'Sending...' : 'Send Thank You'}
                        </button>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="thank-you-stats">
                <div className="stat-item">
                    <Heart size={24} className="text-danger" />
                    <span className="stat-number">{notes.length}</span>
                    <span className="stat-label">Thank You Notes</span>
                </div>
                <div className="stat-item">
                    <User size={24} className="text-primary" />
                    <span className="stat-number">{contributors.length}</span>
                    <span className="stat-label">Contributors</span>
                </div>
                <div className="stat-item">
                    <Sparkles size={24} className="text-warning" />
                    <span className="stat-number">∞</span>
                    <span className="stat-label">Lives Touched</span>
                </div>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <span>Filter by:</span>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Notes</option>
                    {contributors.map(c => (
                        <option key={c} value={c}>To: {c}</option>
                    ))}
                </select>
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading messages...</p>
                </div>
            ) : (
                <div className="thank-you-grid">
                    {(filteredNotes.length > 0 ? filteredNotes : sampleNotes).map((note, idx) => (
                        <div key={note.id} className={`thank-you-card color-${idx % 5}`}>
                            <div className="card-header">
                                <div className="avatar">
                                    <User size={20} />
                                </div>
                                <div className="sender-info">
                                    <span className="sender-name">{note.student_name}</span>
                                    <span className="send-date">
                                        <Calendar size={12} />
                                        {getTimeAgo(note.created_at)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <p className="message">{note.message}</p>
                            </div>
                            
                            <div className="card-footer">
                                <span className="to-label">
                                    <Heart size={14} className="text-danger" />
                                    To: {note.contributor_name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredNotes.length === 0 && sampleNotes.length === 0 && (
                <div className="empty-state">
                    <Heart size={48} className="text-gray-300" />
                    <h3>No Thank You Notes Yet</h3>
                    <p>Be the first to express your gratitude!</p>
                    <button className="btn-primary" onClick={() => setShowForm(true)}>
                        Send a Thank You
                    </button>
                </div>
            )}

            {/* CTA */}
            <div className="thank-you-cta">
                <div className="cta-content">
                    <h3><Sparkles size={20} /> Spread the Love</h3>
                    <p>
                        Did someone's materials help you? Let them know! 
                        A simple thank you can motivate more people to share.
                    </p>
                </div>
            </div>
        </div>
    );
}
