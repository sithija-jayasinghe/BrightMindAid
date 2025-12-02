import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Target, Plus, Trash2, CheckCircle, AlertCircle, Download, Bell, Settings, BarChart3, ListChecks, Lightbulb } from 'lucide-react';
import { useSEO } from '../lib/useSEO';
import './StudyPlanner.css';

// Helper to load saved data from localStorage
const loadSavedData = () => {
    try {
        const saved = localStorage.getItem('studyPlannerData');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
    return null;
};

export default function StudyPlanner() {
    useSEO('planner');
    const savedData = loadSavedData();
    const [examDate, setExamDate] = useState(savedData?.examDate || '');
    const [subjects, setSubjects] = useState(savedData?.subjects || []);
    const [newSubject, setNewSubject] = useState('');
    const [hoursPerDay, setHoursPerDay] = useState(4);
    const [schedule, setSchedule] = useState(savedData?.schedule || null);
    const [completedTopics, setCompletedTopics] = useState(savedData?.completedTopics || {});

    // Save data to localStorage
    useEffect(() => {
        const data = { examDate, subjects, schedule, completedTopics };
        localStorage.setItem('studyPlannerData', JSON.stringify(data));
    }, [examDate, subjects, schedule, completedTopics]);

    const addSubject = () => {
        if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
            setSubjects([...subjects, newSubject.trim()]);
            setNewSubject('');
        }
    };

    const removeSubject = (subject) => {
        setSubjects(subjects.filter(s => s !== subject));
    };

    const getDaysUntilExam = () => {
        if (!examDate) return 0;
        const today = new Date();
        const exam = new Date(examDate);
        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const generateSchedule = () => {
        if (!examDate || subjects.length === 0) {
            alert('Please set exam date and add at least one subject');
            return;
        }

        const daysLeft = getDaysUntilExam();
        if (daysLeft <= 0) {
            alert('Exam date must be in the future');
            return;
        }

        // Generate a balanced schedule
        const daysPerSubject = Math.floor(daysLeft / subjects.length);

        const schedule = [];
        const today = new Date();

        let currentDay = 0;
        subjects.forEach((subject, idx) => {
            const subjectDays = idx === subjects.length - 1 
                ? daysLeft - currentDay 
                : daysPerSubject;

            for (let d = 0; d < subjectDays; d++) {
                const date = new Date(today);
                date.setDate(date.getDate() + currentDay + d);

                schedule.push({
                    date: date.toISOString().split('T')[0],
                    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    subject: subject,
                    hours: hoursPerDay,
                    topic: `${subject} - Day ${d + 1}`,
                    id: `${subject}-${d}`
                });
            }
            currentDay += subjectDays;
        });

        setSchedule(schedule);
    };

    const toggleComplete = (id) => {
        setCompletedTopics(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getProgress = () => {
        if (!schedule || schedule.length === 0) return 0;
        const completed = Object.values(completedTopics).filter(Boolean).length;
        return Math.round((completed / schedule.length) * 100);
    };

    const exportSchedule = () => {
        if (!schedule) return;

        let text = `📚 My Study Schedule\n`;
        text += `📅 Exam Date: ${new Date(examDate).toLocaleDateString()}\n`;
        text += `📖 Subjects: ${subjects.join(', ')}\n`;
        text += `⏰ Hours per day: ${hoursPerDay}\n\n`;
        text += `--- Schedule ---\n\n`;

        schedule.forEach(item => {
            const status = completedTopics[item.id] ? '✅' : '⬜';
            text += `${status} ${item.date} (${item.day}) - ${item.subject} (${item.hours}h)\n`;
        });

        // Create and download file
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'study-schedule.txt';
        a.click();
    };

    const shareToWhatsApp = () => {
        if (!schedule) return;

        const daysLeft = getDaysUntilExam();
        let text = `📚 *My Study Plan*\n\n`;
        text += `📅 Exam in *${daysLeft} days*\n`;
        text += `📖 Subjects: ${subjects.join(', ')}\n`;
        text += `⏰ ${hoursPerDay} hours/day\n`;
        text += `📊 Progress: ${getProgress()}%\n\n`;
        text += `Generated using BrightMindAid 💪`;

        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const daysLeft = getDaysUntilExam();
    const progress = getProgress();

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="page-header">
                <div className="header-title-row">
                    <Calendar size={28} className="header-icon" />
                    <h1 className="text-3xl">Study Planner</h1>
                </div>
                <p className="page-description">
                    Create a personalized study schedule based on your exam date.
                    Track your progress and stay on track!
                </p>
            </div>

            <div className="planner-grid">
                {/* Setup Panel */}
                <div className="setup-panel">
                    <h3><Settings size={18} /> Setup Your Plan</h3>
                    
                    {/* Exam Date */}
                    <div className="form-group">
                        <label className="form-label">
                            <Calendar size={16} />
                            Exam Date
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {examDate && (
                            <div className={`countdown ${daysLeft < 30 ? 'urgent' : ''}`}>
                                <Clock size={16} />
                                <span>{daysLeft} days until exam</span>
                            </div>
                        )}
                    </div>

                    {/* Hours Per Day */}
                    <div className="form-group">
                        <label className="form-label">
                            <Clock size={16} />
                            Study Hours Per Day
                        </label>
                        <div className="hours-selector">
                            {[2, 3, 4, 5, 6, 8].map(h => (
                                <button
                                    key={h}
                                    className={`hour-btn ${hoursPerDay === h ? 'active' : ''}`}
                                    onClick={() => setHoursPerDay(h)}
                                >
                                    {h}h
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="form-group">
                        <label className="form-label">
                            <BookOpen size={16} />
                            Subjects to Study
                        </label>
                        <div className="subject-input">
                            <input
                                type="text"
                                placeholder="Add a subject..."
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                            />
                            <button onClick={addSubject} className="add-btn">
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="subject-list">
                            {subjects.map(subject => (
                                <div key={subject} className="subject-chip">
                                    <span>{subject}</span>
                                    <button onClick={() => removeSubject(subject)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {subjects.length === 0 && (
                            <p className="hint-text">Add subjects you need to study</p>
                        )}
                    </div>

                    {/* Generate Button */}
                    <button 
                        className="btn-primary btn-full"
                        onClick={generateSchedule}
                        disabled={!examDate || subjects.length === 0}
                    >
                        <Target size={18} />
                        Generate Study Schedule
                    </button>
                </div>

                {/* Schedule Panel */}
                <div className="schedule-panel">
                    {schedule ? (
                        <>
                            {/* Progress Bar */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <h3><BarChart3 size={18} /> Your Progress</h3>
                                    <span className="progress-percent">{progress}%</span>
                                </div>
                                <div className="progress-bar-container">
                                    <div 
                                        className="progress-bar-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-stats">
                                    <span>{Object.values(completedTopics).filter(Boolean).length} of {schedule.length} days completed</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="schedule-actions">
                                <button className="action-btn" onClick={exportSchedule}>
                                    <Download size={16} />
                                    Download
                                </button>
                                <button className="action-btn whatsapp" onClick={shareToWhatsApp}>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                    Share
                                </button>
                            </div>

                            {/* Schedule List */}
                            <div className="schedule-list">
                                <h3><ListChecks size={18} /> Daily Schedule</h3>
                                {schedule.map((item) => {
                                    const isToday = item.date === new Date().toISOString().split('T')[0];
                                    const isPast = new Date(item.date) < new Date(new Date().toISOString().split('T')[0]);
                                    
                                    return (
                                        <div 
                                            key={item.id}
                                            className={`schedule-item ${completedTopics[item.id] ? 'completed' : ''} ${isToday ? 'today' : ''} ${isPast && !completedTopics[item.id] ? 'missed' : ''}`}
                                            onClick={() => toggleComplete(item.id)}
                                        >
                                            <div className="schedule-check">
                                                {completedTopics[item.id] ? (
                                                    <CheckCircle size={20} className="check-icon" />
                                                ) : (
                                                    <div className="check-empty"></div>
                                                )}
                                            </div>
                                            <div className="schedule-date">
                                                <span className="date-day">{item.day}</span>
                                                <span className="date-full">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="schedule-subject">
                                                <span className="subject-name">{item.subject}</span>
                                                <span className="subject-hours">{item.hours} hours</span>
                                            </div>
                                            {isToday && <span className="today-badge">Today</span>}
                                            {isPast && !completedTopics[item.id] && (
                                                <AlertCircle size={16} className="missed-icon" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="empty-schedule">
                            <Calendar size={64} strokeWidth={1} />
                            <h3>No Schedule Yet</h3>
                            <p>Set your exam date and subjects, then generate your personalized study schedule.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Study Tips */}
            <div className="study-tips">
                <h3><Lightbulb size={18} /> Study Tips</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <Target size={24} className="tip-icon" />
                        <p>Focus on one subject at a time for better retention</p>
                    </div>
                    <div className="tip-card">
                        <Clock size={24} className="tip-icon" />
                        <p>Take a 10-minute break every 50 minutes of study</p>
                    </div>
                    <div className="tip-card">
                        <BookOpen size={24} className="tip-icon" />
                        <p>Review previous day's material before starting new topics</p>
                    </div>
                    <div className="tip-card">
                        <Bell size={24} className="tip-icon" />
                        <p>Get 7-8 hours of sleep for better memory consolidation</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
