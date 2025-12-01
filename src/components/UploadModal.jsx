import React, { useState } from 'react';
import { X, UploadCloud, File, Heart, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function UploadModal({ isOpen, onClose }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    
    // Generate years from 2015 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);
    
    const [formData, setFormData] = useState({
        subject: '',
        grade: 'Grade 6-9',
        title: '',
        type: 'Note',
        medium: 'Sinhala',
        year: '',
        chapter: '',
        tags: ''
    });

    if (!isOpen) return null;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setUploading(true);
        try {
            // 1. Upload file to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            console.log('Uploading file:', fileName);
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('study-materials')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Storage upload error:', uploadError);
                alert(`Storage Error: ${uploadError.message}`);
                throw uploadError;
            }

            console.log('File uploaded successfully:', uploadData);

            // 2. Get Public URL
            const { data: urlData } = supabase.storage
                .from('study-materials')
                .getPublicUrl(fileName);

            console.log('Public URL:', urlData.publicUrl);

            // 3. Insert into Database
            const noteData = {
                title: formData.title,
                subject: formData.subject,
                grade: formData.grade,
                type: formData.type,
                medium: formData.medium,
                file_url: urlData.publicUrl,
                file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                author: 'Community Member',
                year: formData.year ? parseInt(formData.year) : null,
                chapter: formData.chapter || null,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null
            };
            
            console.log('Inserting note:', noteData);

            const { data: dbData, error: dbError } = await supabase
                .from('notes')
                .insert([noteData])
                .select();

            if (dbError) {
                console.error('Database insert error:', dbError);
                alert(`Database Error: ${dbError.message}`);
                throw dbError;
            }

            console.log('Note inserted:', dbData);

            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setFile(null);
                setFormData({ subject: '', grade: 'Grade 6-9', title: '', type: 'Note', medium: 'Sinhala', year: '', chapter: '', tags: '' });
            }, 3000);

        } catch (error) {
            console.error('Full error object:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                {submitted ? (
                    <div className="modal-body text-center">
                        <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
                            <Heart size={48} fill="currentColor" />
                        </div>
                        <h3 className="text-3xl mb-2">Thank You!</h3>
                        <p className="text-gray-500 mb-6">
                            Thank you for your generous contribution. In this crisis situation, your support enables students across Sri Lanka to continue their education.
                        </p>
                        <button 
                            onClick={onClose}
                            className="btn-primary btn-full btn-dark"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="modal-header">
                            <h3 className="text-3xl" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Share Knowledge</h3>
                            <button onClick={onClose} className="btn-icon">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Subject *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Combined Maths, ICT, History"
                                    className="form-input"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-col">
                                    <label className="form-label">Type *</label>
                                    <select
                                        className="form-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option>Note</option>
                                        <option>Past Paper</option>
                                        <option>Marking Scheme</option>
                                        <option>Model Paper</option>
                                        <option>Textbook</option>
                                        <option>Revision</option>
                                    </select>
                                </div>
                                <div className="form-col">
                                    <label className="form-label">Grade *</label>
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
                                <div className="form-col">
                                    <label className="form-label">Medium *</label>
                                    <select
                                        className="form-select"
                                        value={formData.medium}
                                        onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                                    >
                                        <option>Sinhala</option>
                                        <option>English</option>
                                        <option>Tamil</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-col">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2023 Revision"
                                        className="form-input"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-col">
                                    <label className="form-label">Year (for papers)</label>
                                    <select
                                        className="form-select"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    >
                                        <option value="">Select Year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-col">
                                    <label className="form-label">Chapter/Unit (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Unit 5, Chapter 3"
                                        className="form-input"
                                        value={formData.chapter}
                                        onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                                    />
                                </div>
                                <div className="form-col">
                                    <label className="form-label">Tags (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. trigonometry, formulas"
                                        className="form-input"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                    <span className="form-hint">Separate with commas</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Upload File (PDF, Images) *</label>
                                <div
                                    className={`upload-area ${dragActive ? 'active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={handleAreaClick}
                                >
                                    {file ? (
                                        <div className="flex items-center justify-center gap-2 text-primary">
                                            <File size={20} />
                                            {file.name}
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                                style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                                <UploadCloud size={32} />
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                <span className="text-primary" style={{ cursor: 'pointer' }}>Choose File</span> or drag & drop
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Supported: PDF, JPG, PNG. Max 10MB.</p>
                                        </>
                                    )}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        style={{ display: 'none' }} 
                                        onChange={(e) => setFile(e.target.files[0])} 
                                        ref={fileInputRef}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="btn-primary btn-full"
                                style={{ marginTop: '1rem' }}
                            >
                                {uploading ? 'Uploading...' : 'Upload Material'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
