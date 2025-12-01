import React, { useState } from 'react';
import { FileText, Download, Eye, File, BookOpen, Share2, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function NoteCard({ id, title, subject, grade, author, size, downloads, type, medium, fileUrl, onDownload }) {
    const [downloadCount, setDownloadCount] = useState(downloads || 0);
    const [copied, setCopied] = useState(false);
    
    const handleDownload = async () => {
        // Open file in new tab (triggers download for PDFs)
        window.open(fileUrl, '_blank');
        
        // Update local state immediately for UI feedback
        setDownloadCount(prev => prev + 1);

        // Update download count in database
        if (id) {
            try {
                await supabase
                    .from('notes')
                    .update({ downloads: (downloads || 0) + 1 })
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
                    </div>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-author">By {author}</p>
                </div>
            </div>

            <div className="card-footer">
                <div className="flex gap-4 text-sm text-gray-500">
                    <div className="file-size">
                        <span className="file-size-label">Size: </span>
                        <span className="file-size-value">{size}</span>
                    </div>
                    <div className="file-downloads">
                        <span className="file-size-label">Downloads: </span>
                        <span className="file-size-value">{downloadCount}</span>
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
