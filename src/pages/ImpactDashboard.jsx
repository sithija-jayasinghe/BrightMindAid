import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Users, BookOpen, TrendingUp, MapPin, Calendar, Award, Heart, Target, AlertCircle, Clock, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSEO } from '../lib/useSEO';
import './ImpactDashboard.css';

export default function ImpactDashboard() {
    useSEO('impact');
    const [stats, setStats] = useState({
        totalDownloads: 0,
        totalMaterials: 0,
        totalContributors: 0,
        totalRequests: 0,
        requestsFulfilled: 0
    });
    const [materialsByGrade, setMaterialsByGrade] = useState({});
    const [, setMaterialsBySubject] = useState({});
    const [materialsByType, setMaterialsByType] = useState({});
    const [recentActivity, setRecentActivity] = useState([]);
    const [topContributors, setTopContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gapAnalysis, setGapAnalysis] = useState({ missing: [], low: [] });

    useEffect(() => {
        fetchAllStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAllStats = async () => {
        setLoading(true);
        try {
            // Fetch notes
            const { data: notes, error: notesError } = await supabase
                .from('notes')
                .select('*');

            if (notesError) throw notesError;

            // Fetch requests
            const { data: requests, error: requestsError } = await supabase
                .from('requests')
                .select('*');

            if (requestsError) throw requestsError;

            // Calculate basic stats
            const totalDownloads = notes?.reduce((sum, note) => sum + (note.downloads || 0), 0) || 0;
            const uniqueAuthors = [...new Set(notes?.map(n => n.author) || [])];
            const fulfilledRequests = requests?.filter(r => r.fulfilled).length || 0;

            setStats({
                totalDownloads,
                totalMaterials: notes?.length || 0,
                totalContributors: uniqueAuthors.length,
                totalRequests: requests?.length || 0,
                requestsFulfilled: fulfilledRequests
            });

            // Group by grade
            const byGrade = {};
            notes?.forEach(note => {
                byGrade[note.grade] = (byGrade[note.grade] || 0) + 1;
            });
            setMaterialsByGrade(byGrade);

            // Group by subject
            const bySubject = {};
            notes?.forEach(note => {
                bySubject[note.subject] = (bySubject[note.subject] || 0) + 1;
            });
            setMaterialsBySubject(bySubject);

            // Group by type
            const byType = {};
            notes?.forEach(note => {
                byType[note.type || 'Note'] = (byType[note.type || 'Note'] || 0) + 1;
            });
            setMaterialsByType(byType);

            // Recent activity (last 10 uploads)
            const recent = notes?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10) || [];
            setRecentActivity(recent);

            // Top contributors
            const contributorCounts = {};
            notes?.forEach(note => {
                contributorCounts[note.author] = (contributorCounts[note.author] || 0) + 1;
            });
            const topContrib = Object.entries(contributorCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));
            setTopContributors(topContrib);

            // Gap analysis
            analyzeGaps(notes || [], requests || []);

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzeGaps = (notes, requests) => {
        // Important subjects that should have materials
        const importantSubjects = [
            'Mathematics', 'Science', 'English', 'Sinhala', 'Tamil',
            'Combined Mathematics', 'Physics', 'Chemistry', 'Biology',
            'Economics', 'Accounting', 'ICT', 'History', 'Geography'
        ];

        const subjectCounts = {};
        notes.forEach(note => {
            const subject = note.subject?.toLowerCase();
            importantSubjects.forEach(imp => {
                if (subject?.includes(imp.toLowerCase())) {
                    subjectCounts[imp] = (subjectCounts[imp] || 0) + 1;
                }
            });
        });

        const missing = importantSubjects.filter(s => !subjectCounts[s]);
        const low = importantSubjects
            .filter(s => subjectCounts[s] && subjectCounts[s] < 3)
            .map(s => ({ subject: s, count: subjectCounts[s] }));

        // Also check unfulfilled requests
        const pendingRequests = requests.filter(r => !r.fulfilled);
        const requestedSubjects = [...new Set(pendingRequests.map(r => r.subject))];

        setGapAnalysis({ 
            missing, 
            low,
            requested: requestedSubjects.slice(0, 5)
        });
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <div className="container py-16 text-center">
                <p className="text-gray-500">Loading impact data...</p>
            </div>
        );
    }

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="page-header">
                <div className="header-title-row">
                    <Activity size={28} className="header-icon" />
                    <h1 className="text-3xl">Impact Dashboard</h1>
                </div>
                <p className="page-description">
                    See how BrightMindAid is helping Sri Lankan students affected by natural disasters.
                    Every contribution makes a difference!
                </p>
            </div>

            {/* Main Stats */}
            <div className="impact-stats-grid">
                <div className="impact-stat-card primary">
                    <div className="stat-icon">
                        <Download size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{formatNumber(stats.totalDownloads)}</span>
                        <span className="stat-label">Total Downloads</span>
                    </div>
                </div>

                <div className="impact-stat-card success">
                    <div className="stat-icon">
                        <BookOpen size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.totalMaterials}</span>
                        <span className="stat-label">Study Materials</span>
                    </div>
                </div>

                <div className="impact-stat-card warning">
                    <div className="stat-icon">
                        <Users size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.totalContributors}</span>
                        <span className="stat-label">Contributors</span>
                    </div>
                </div>

                <div className="impact-stat-card info">
                    <div className="stat-icon">
                        <Heart size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.requestsFulfilled}/{stats.totalRequests}</span>
                        <span className="stat-label">Requests Fulfilled</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Materials by Grade */}
                <div className="chart-card">
                    <h3><BookOpen size={18} /> Materials by Grade</h3>
                    <div className="bar-chart">
                        {Object.entries(materialsByGrade).map(([grade, count]) => (
                            <div key={grade} className="bar-item">
                                <div className="bar-label">{grade.replace('Grade ', 'G')}</div>
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill"
                                        style={{ width: `${(count / Math.max(...Object.values(materialsByGrade))) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="bar-value">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Materials by Type */}
                <div className="chart-card">
                    <h3><BarChart3 size={18} /> Materials by Type</h3>
                    <div className="pie-legend">
                        {Object.entries(materialsByType).map(([type, count], idx) => (
                            <div key={type} className="legend-item">
                                <span className={`legend-color color-${idx}`}></span>
                                <span className="legend-label">{type}</span>
                                <span className="legend-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gap Analysis */}
            <div className="gap-analysis-section">
                <h3><AlertCircle size={20} /> Gap Analysis - Materials Needed</h3>
                <div className="gap-cards">
                    {gapAnalysis.missing.length > 0 && (
                        <div className="gap-card danger">
                            <h4><AlertCircle size={16} /> Missing Subjects</h4>
                            <p>No materials available for:</p>
                            <div className="gap-tags">
                                {gapAnalysis.missing.map(subject => (
                                    <span key={subject} className="gap-tag">{subject}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {gapAnalysis.low.length > 0 && (
                        <div className="gap-card warning">
                            <h4><AlertCircle size={16} /> Low Coverage</h4>
                            <p>Need more materials for:</p>
                            <div className="gap-tags">
                                {gapAnalysis.low.map(item => (
                                    <span key={item.subject} className="gap-tag">
                                        {item.subject} ({item.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {gapAnalysis.requested?.length > 0 && (
                        <div className="gap-card info">
                            <h4><Target size={16} /> Requested by Students</h4>
                            <p>Students are asking for:</p>
                            <div className="gap-tags">
                                {gapAnalysis.requested.map(subject => (
                                    <span key={subject} className="gap-tag">{subject}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
                {/* Recent Activity */}
                <div className="activity-card">
                    <h3><Clock size={18} /> Recent Uploads</h3>
                    <div className="activity-list">
                        {recentActivity.map(item => (
                            <div key={item.id} className="activity-item">
                                <div className="activity-icon">
                                    <BookOpen size={16} />
                                </div>
                                <div className="activity-info">
                                    <span className="activity-title">{item.title}</span>
                                    <span className="activity-meta">{item.subject} • {item.grade}</span>
                                </div>
                                <span className="activity-time">{getTimeAgo(item.created_at)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Contributors */}
                <div className="contributors-card">
                    <h3><Award size={18} /> Top Contributors</h3>
                    <div className="contributors-list">
                        {topContributors.map((contributor, idx) => (
                            <div key={contributor.name} className="contributor-item">
                                <div className={`rank rank-${idx + 1}`}>
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                </div>
                                <div className="contributor-info">
                                    <span className="contributor-name">{contributor.name}</span>
                                    <span className="contributor-count">{contributor.count} materials</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cta-section">
                        <p>Want to be on this list?</p>
                        <a href="#/" className="text-primary">Share materials →</a>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="impact-cta">
                <div className="cta-content">
                    <h3><Heart size={20} /> Help Fill the Gaps!</h3>
                    <p>
                        Students affected by floods and landslides need your help. 
                        If you have study materials, please share them with the community.
                    </p>
                    <a href="#/" className="btn-primary">
                        <BookOpen size={18} />
                        Share Materials Now
                    </a>
                </div>
            </div>
        </div>
    );
}
