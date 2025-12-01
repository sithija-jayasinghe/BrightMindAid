import React, { useState, useEffect } from 'react';
import { MessageSquare, Upload, ThumbsUp, CheckCircle, Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RequestBoard({ onUploadClick }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        grade: 'Grade 6-9',
        note_content: '',
        student_name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (id, currentUpvotes) => {
        setRequests(requests.map(req =>
            req.id === id ? { ...req, upvotes: currentUpvotes + 1 } : req
        ));

        try {
            const { error } = await supabase
                .from('requests')
                .update({ upvotes: currentUpvotes + 1 })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error upvoting:', error);
        }
    };

    const handlePostRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('requests')
                .insert([{
                    student_name: formData.student_name,
                    subject: formData.subject,
                    grade: formData.grade,
                    note_content: formData.note_content
                }])
                .select();

            if (error) throw error;
            if (data) setRequests([data[0], ...requests]);
            
            // Reset form and close modal
            setFormData({ subject: '', grade: 'Grade 6-9', note_content: '', student_name: '' });
            setShowRequestModal(false);
        } catch (error) {
            console.error('Error posting request:', error);
            alert('Failed to post request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-16">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl mb-2">Community Requests</h2>
                    <p className="text-gray-500">
                        Can't find what you need? Post a request and let the community help you out.
                    </p>
                </div>
            <div>
                <button onClick={() => setShowRequestModal(true)} className="btn-primary">
                    <MessageSquare size={20} />
                    Post a Request
                </button>
            </div>
            </div>

            {loading ? (
                <div className="text-center py-16">
                    <p className="text-gray-500">Loading community requests...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 upload-area">
                    <p className="text-gray-500 text-lg">No requests yet. Be the first to ask!</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {requests.map(req => (
                        <div key={req.id} className="request-card">

                            <div className="request-header">
                                <div className="flex gap-2">
                                    <span className="tag tag-grade">
                                        {req.grade}
                                    </span>
                                    <span className="tag tag-grade">
                                        {req.subject}
                                    </span>
                                </div>
                                {req.fulfilled ? (
                                    <span className="status-badge status-fulfilled">
                                        <CheckCircle size={14} /> Fulfilled
                                    </span>
                                ) : (
                                    <span className="status-badge status-open">
                                        <Clock size={14} /> Open
                                    </span>
                                )}
                            </div>

                            <h3 className="card-title mb-4">
                                {req.note_content}
                            </h3>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="logo-icon" style={{ width: '24px', height: '24px', padding: 0, justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>
                                    {req.student_name.charAt(0)}
                                </div>
                                <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>Requested by {req.student_name}</span>
                            </div>

                            <div className="card-footer">
                                <button
                                    onClick={() => handleUpvote(req.id, req.upvotes)}
                                    className="btn-icon"
                                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: 'auto' }}
                                >
                                    <ThumbsUp size={18} />
                                    <span>{req.upvotes} Boosts</span>
                                </button>

                                {!req.fulfilled && (
                                    <button
                                        onClick={onUploadClick}
                                        className="text-primary"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}
                                    >
                                        <Upload size={16} />
                                        I have this
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Request Modal */}
            {showRequestModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="text-3xl" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Request Study Material</h3>
                            <button onClick={() => setShowRequestModal(false)} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handlePostRequest} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Kasun Perera"
                                    className="form-input"
                                    required
                                    value={formData.student_name}
                                    onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-col">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Combined Maths"
                                        className="form-input"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div className="form-col">
                                    <label className="form-label">Grade</label>
                                    <select
                                        className="form-select"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    >
                                        <option>Grade 1-5</option>
                                        <option>Grade 6-9</option>
                                        <option>Grade 10</option>
                                        <option>Grade 11 (O/L)</option>
                                        <option>Grade 12-13 (A/L)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">What do you need?</label>
                                <textarea
                                    placeholder="e.g. I need Unit 5 Trigonometry notes with worked examples..."
                                    className="form-input"
                                    required
                                    rows={4}
                                    style={{ resize: 'vertical', minHeight: '100px' }}
                                    value={formData.note_content}
                                    onChange={(e) => setFormData({ ...formData, note_content: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary btn-full"
                                style={{ marginTop: '1rem' }}
                            >
                                {submitting ? 'Posting...' : 'Post Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
