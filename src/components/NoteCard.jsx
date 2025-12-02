import React, { useState } from 'react';
import { FileText, Download, Eye, File, BookOpen, Share2, Check, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper to format author display name
const formatAuthorDisplay = (author) => {
    if (!author) return 'Anonymous';
    if (author.startsWith('Anon#')) {
        return 'Anonymous';
    }
    return author;
};

export default function NoteCard({ 
    id, 
    title, 
    subject, 
    grade, 
    author, 
    size, 
    downloads, 
    type, 
    medium, 
    fileUrl, 
    year,
    createdAt,
    onDownload,
    viewMode = 'grid'
}) {
    const [downloadCount, setDownloadCount] = useState(downloads || 0);
    const [copied, setCopied] = useState(false);
    
    const handleDownload = async () => {
        // Open file in new tab (triggers download for PDFs)
        window.open(fileUrl, '_blank');
        
        // Update local state immediately for UI feedback
        const newCount = downloadCount + 1;
        setDownloadCount(newCount);

        // Update download count in database
        if (id) {
            try {
                await supabase
                    .from('notes')
                    .update({ downloads: newCount })
                    .eq('id', id);
                
                // Notify parent to update total counts
                if (onDownload) onDownload();
            } catch (error) {
                console.error('Error updating download count:', error);
            }
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: title,
            text: `Check out this ${subject} note on BrightMindAid!`,
            url: fileUrl
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(fileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePreview = () => {
        // Open file in new tab for preview
        window.open(fileUrl, '_blank');
    };

    // Choose icon based on type
    const getIcon = () => {
        switch(type?.toLowerCase()) {
            case 'past paper':
                return <File size={24} strokeWidth={1.5} />;
            case 'note':
                return <BookOpen size={24} strokeWidth={1.5} />;
            default:
                return <FileText size={24} strokeWidth={1.5} />;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // List view layout
    if (viewMode === 'list') {
        return (
            <div className="note-card note-card-list">
                <div className="card-header">
                    <div className="file-icon">
                        {getIcon()}
                    </div>
                    <div className="card-content">
                        <div className="card-tags">
                            <span className="tag tag-grade">{grade}</span>
                            <span className="tag tag-subject">{subject}</span>
                            {type && <span className="tag tag-type">{type}</span>}
                            {medium && <span className="tag" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>{medium}</span>}
                            {year && <span className="tag tag-year">{year}</span>}
                        </div>
                        <h3 className="card-title">{title}</h3>
                        <div className="card-meta">
                            <span className="card-author" title={author?.startsWith('Anon#') ? `ID: ${author}` : ''}>By {formatAuthorDisplay(author)}</span>
                            {createdAt && (
                                <span className="card-date">
                                    <Clock size={12} />
                                    {formatDate(createdAt)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-list-stats">
                    <div className="stat-item-small">
                        <Download size={14} />
                        <span>{downloadCount}</span>
                    </div>
                    <div className="stat-item-small">
                        <span>{size}</span>
                    </div>
                </div>

                <div className="card-actions">
                    <button className="btn-icon" title={copied ? "Copied!" : "Share"} onClick={handleShare}>
                        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                    </button>
                    <button className="btn-icon" title="Preview" onClick={handlePreview}>
                        <Eye size={18} />
                    </button>
                    <button className="btn-primary btn-sm" title="Download" onClick={handleDownload}>
                        <Download size={16} />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        );
    }

    // Grid view layout (default)
    return (
        <div className="note-card">
            <div className="card-header">
                <div className="file-icon">
                    {getIcon()}
                </div>
                <div className="card-content">
                    <div className="card-tags">
                        <span className="tag tag-grade">{grade}</span>
                        <span className="tag tag-subject">{subject}</span>
                        {type && <span className="tag tag-type">{type}</span>}
                        {medium && <span className="tag" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>{medium}</span>}
                        {year && <span className="tag tag-year">{year}</span>}
                    </div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-author" title={author?.startsWith('Anon#') ? `ID: ${author}` : ''}>By {formatAuthorDisplay(author)}</p>
                </div>
            </div>

            <div className="card-footer">
                <div className="card-stats">
                    <div className="file-size">
                        <span className="file-size-label">Size: </span>
                        <span className="file-size-value">{size}</span>
                    </div>
                    <div className="download-count">
                        <Download size={14} />
                        <span>{downloadCount}</span>
                    </div>
                </div>
                <div className="card-actions">
                    <button className="btn-icon" title={copied ? "Copied!" : "Share"} onClick={handleShare}>
                        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                    </button>
                    <button className="btn-icon" title="Preview" onClick={handlePreview}>
                        <Eye size={18} />
                    </button>
                    <button className="btn-primary btn-sm" title="Download" onClick={handleDownload}>
                        <Download size={16} />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
