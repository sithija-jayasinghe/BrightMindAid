import React, { useState, useEffect } from 'react';
import { Copy, Share2, BookOpen, Bookmark, ChevronLeft, ChevronRight, Lightbulb, Download, Layers, Grid } from 'lucide-react';

// Quick revision cards data
const revisionCards = {
    'Mathematics': {
        'O/L': [
            { id: 1, title: 'Quadratic Formula', content: 'x = (-b ± √(b² - 4ac)) / 2a', category: 'Algebra' },
            { id: 2, title: 'Pythagoras Theorem', content: 'a² + b² = c²\n\nIn a right triangle, the square of hypotenuse equals sum of squares of other two sides', category: 'Geometry' },
            { id: 3, title: 'Area Formulas', content: '• Circle: πr²\n• Triangle: ½ × base × height\n• Rectangle: length × width\n• Trapezium: ½(a+b) × h', category: 'Mensuration' },
            { id: 4, title: 'Trigonometry Ratios', content: 'sin θ = Opposite / Hypotenuse\ncos θ = Adjacent / Hypotenuse\ntan θ = Opposite / Adjacent\n\nSOH CAH TOA', category: 'Trigonometry' },
            { id: 5, title: 'Probability', content: 'P(Event) = Favorable Outcomes / Total Outcomes\n\n0 ≤ P(E) ≤ 1\nP(E) + P(E\') = 1', category: 'Statistics' },
            { id: 6, title: 'Percentage Change', content: '% Change = ((New - Old) / Old) × 100\n\n% Increase → Positive\n% Decrease → Negative', category: 'Numbers' },
        ],
        'A/L': [
            { id: 7, title: 'Derivatives', content: 'd/dx (xⁿ) = nxⁿ⁻¹\nd/dx (sin x) = cos x\nd/dx (cos x) = -sin x\nd/dx (eˣ) = eˣ\nd/dx (ln x) = 1/x', category: 'Calculus' },
            { id: 8, title: 'Integration Rules', content: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n∫sin x dx = -cos x + C\n∫cos x dx = sin x + C\n∫eˣ dx = eˣ + C', category: 'Calculus' },
            { id: 9, title: 'Equations of Motion', content: 'v = u + at\ns = ut + ½at²\nv² = u² + 2as\ns = ½(u + v)t', category: 'Mechanics' },
            { id: 10, title: 'Complex Numbers', content: 'i² = -1\n|z| = √(a² + b²)\narg(z) = tan⁻¹(b/a)\nz* = a - bi (conjugate)', category: 'Algebra' },
        ]
    },
    'Physics': {
        'O/L': [
            { id: 11, title: 'Newton\'s Laws', content: '1st: Object at rest stays at rest\n2nd: F = ma\n3rd: Every action has equal & opposite reaction', category: 'Mechanics' },
            { id: 12, title: 'Ohm\'s Law', content: 'V = IR\n\nV = Voltage (V)\nI = Current (A)\nR = Resistance (Ω)', category: 'Electricity' },
            { id: 13, title: 'Wave Equation', content: 'v = fλ\n\nv = velocity\nf = frequency\nλ = wavelength', category: 'Waves' },
        ],
        'A/L': [
            { id: 14, title: 'Coulomb\'s Law', content: 'F = kq₁q₂/r²\n\nk = 9 × 10⁹ Nm²/C²', category: 'Electrostatics' },
            { id: 15, title: 'Capacitance', content: 'C = Q/V\nC = ε₀A/d (parallel plate)\n\nSeries: 1/C = 1/C₁ + 1/C₂\nParallel: C = C₁ + C₂', category: 'Electricity' },
            { id: 16, title: 'Photoelectric Effect', content: 'E = hf = hc/λ\nKE = hf - φ\n\nh = 6.63 × 10⁻³⁴ Js', category: 'Modern Physics' },
            { id: 17, title: 'E = mc²', content: 'Energy-Mass Equivalence\n\nE = mc²\nc = 3 × 10⁸ m/s', category: 'Modern Physics' },
        ]
    },
    'Chemistry': {
        'O/L': [
            { id: 18, title: 'pH Scale', content: 'pH = -log[H⁺]\n\npH < 7: Acid\npH = 7: Neutral\npH > 7: Base', category: 'Acids & Bases' },
            { id: 19, title: 'Periodic Table Groups', content: 'Group 1: Alkali Metals\nGroup 2: Alkaline Earth\nGroup 17: Halogens\nGroup 18: Noble Gases', category: 'Periodic Table' },
        ],
        'A/L': [
            { id: 20, title: 'Ideal Gas Law', content: 'PV = nRT\n\nR = 8.314 J/mol·K\n\nAt STP:\nT = 273K, P = 101.3 kPa', category: 'Physical Chemistry' },
            { id: 21, title: 'Organic Homologous Series', content: 'Alkanes: CₙH₂ₙ₊₂\nAlkenes: CₙH₂ₙ\nAlkynes: CₙH₂ₙ₋₂\nAlcohols: CₙH₂ₙ₊₁OH', category: 'Organic Chemistry' },
            { id: 22, title: 'Electrochemical Series', content: 'K > Na > Ca > Mg > Al > Zn > Fe > H > Cu > Ag > Au\n\nMore reactive → Better reducing agent', category: 'Electrochemistry' },
        ]
    },
    'Biology': {
        'O/L': [
            { id: 23, title: 'Photosynthesis', content: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nLight + Chlorophyll required\nOccurs in chloroplasts', category: 'Plant Biology' },
            { id: 24, title: 'Respiration', content: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy\n\nAerobic: With oxygen\nAnaerobic: Without oxygen', category: 'Cell Biology' },
        ],
        'A/L': [
            { id: 25, title: 'DNA Structure', content: 'A-T (2 H-bonds)\nG-C (3 H-bonds)\n\nAntiparallel strands\n5\' to 3\' direction', category: 'Genetics' },
            { id: 26, title: 'Mendelian Ratios', content: 'Monohybrid: 3:1\nDihybrid: 9:3:3:1\nTest Cross: 1:1\nCodominance: 1:2:1', category: 'Genetics' },
            { id: 27, title: 'Krebs Cycle', content: 'Location: Mitochondria\n\nProducts per cycle:\n• 3 NADH\n• 1 FADH₂\n• 1 ATP\n• 2 CO₂', category: 'Biochemistry' },
        ]
    },
    'Economics': {
        'A/L': [
            { id: 28, title: 'GDP Formula', content: 'GDP = C + I + G + (X - M)\n\nC = Consumption\nI = Investment\nG = Government\nX = Exports\nM = Imports', category: 'Macroeconomics' },
            { id: 29, title: 'Price Elasticity', content: 'Ed = (% Change in Qd) / (% Change in P)\n\nEd > 1: Elastic\nEd < 1: Inelastic\nEd = 1: Unit elastic', category: 'Microeconomics' },
            { id: 30, title: 'Inflation Types', content: '• Demand-Pull: Too much money\n• Cost-Push: Rising production costs\n• Built-in: Wage-price spiral', category: 'Macroeconomics' },
        ]
    }
};

export default function RevisionCards() {
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedLevel, setSelectedLevel] = useState('O/L');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [savedCards, setSavedCards] = useState(() => {
        try {
            const saved = localStorage.getItem('savedRevisionCards');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [showAnswer, setShowAnswer] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    // Save cards to localStorage
    useEffect(() => {
        localStorage.setItem('savedRevisionCards', JSON.stringify(savedCards));
    }, [savedCards]);

    const cards = revisionCards[selectedSubject]?.[selectedLevel] || [];
    const currentCard = cards[currentCardIndex];

    const nextCard = () => {
        setCurrentCardIndex((prev) => (prev + 1) % cards.length);
        setShowAnswer(true);
    };

    const prevCard = () => {
        setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
        setShowAnswer(true);
    };

    const toggleSaveCard = (card) => {
        if (savedCards.find(c => c.id === card.id)) {
            setSavedCards(savedCards.filter(c => c.id !== card.id));
        } else {
            setSavedCards([...savedCards, card]);
        }
    };

    const isCardSaved = (cardId) => savedCards.some(c => c.id === cardId);

    const copyToClipboard = (card) => {
        const text = `📝 ${card.title}\n\n${card.content}\n\n- ${selectedSubject} (${selectedLevel})`;
        navigator.clipboard.writeText(text);
        setCopiedId(card.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const shareToWhatsApp = (card) => {
        const text = `📝 *${card.title}*\n\n${card.content}\n\n_${selectedSubject} - ${selectedLevel}_\n\n📚 Get more at BrightMindAid`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareAllSaved = () => {
        if (savedCards.length === 0) {
            alert('No saved cards to share');
            return;
        }
        let text = `📚 *My Saved Revision Cards*\n\n`;
        savedCards.forEach((card, idx) => {
            text += `${idx + 1}. *${card.title}*\n${card.content}\n\n`;
        });
        text += `_Generated from BrightMindAid_`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="revision-header">
                <div className="header-content">
                    <div className="header-title-row">
                        <Layers size={28} className="header-icon" />
                        <h1 className="text-3xl">Quick Revision Cards</h1>
                    </div>
                    <p className="text-gray-500">
                        Bite-sized revision cards with key formulas and concepts.
                        Save, share, and study on the go!
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="revision-filters">
                <div className="filter-group-inline">
                    <label>Subject:</label>
                    <select 
                        value={selectedSubject}
                        onChange={(e) => {
                            setSelectedSubject(e.target.value);
                            setCurrentCardIndex(0);
                        }}
                        className="filter-select-light"
                    >
                        {Object.keys(revisionCards).map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                </div>

                <div className="level-toggle">
                    <button 
                        className={`level-btn ${selectedLevel === 'O/L' ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedLevel('O/L');
                            setCurrentCardIndex(0);
                        }}
                    >
                        O/L
                    </button>
                    <button 
                        className={`level-btn ${selectedLevel === 'A/L' ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedLevel('A/L');
                            setCurrentCardIndex(0);
                        }}
                    >
                        A/L
                    </button>
                </div>
            </div>

            {/* Card Display */}
            {cards.length > 0 ? (
                <div className="card-viewer">
                    <button className="nav-arrow left" onClick={prevCard}>
                        <ChevronLeft size={24} />
                    </button>

                    <div className="revision-card-container">
                        <div className={`revision-card ${showAnswer ? 'show' : ''}`}>
                            <div className="card-category">{currentCard.category}</div>
                            <h3 className="card-title-big">{currentCard.title}</h3>
                            <div className="card-content-box">
                                <pre>{currentCard.content}</pre>
                            </div>
                            <div className="card-actions-row">
                                <button 
                                    className={`card-action-btn ${isCardSaved(currentCard.id) ? 'saved' : ''}`}
                                    onClick={() => toggleSaveCard(currentCard)}
                                    title={isCardSaved(currentCard.id) ? 'Remove from saved' : 'Save card'}
                                >
                                    <Bookmark size={18} fill={isCardSaved(currentCard.id) ? 'currentColor' : 'none'} />
                                </button>
                                <button 
                                    className={`card-action-btn ${copiedId === currentCard.id ? 'copied' : ''}`}
                                    onClick={() => copyToClipboard(currentCard)}
                                    title="Copy to clipboard"
                                >
                                    <Copy size={18} />
                                </button>
                                <button 
                                    className="card-action-btn whatsapp"
                                    onClick={() => shareToWhatsApp(currentCard)}
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="card-counter">
                            {currentCardIndex + 1} / {cards.length}
                        </div>
                    </div>

                    <button className="nav-arrow right" onClick={nextCard}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            ) : (
                <div className="no-cards">
                    <Lightbulb size={48} />
                    <p>No revision cards available for this selection.</p>
                </div>
            )}

            {/* Card Grid for browsing */}
            <div className="cards-grid-section">
                <h3><Grid size={18} /> All Cards - {selectedSubject} ({selectedLevel})</h3>
                <div className="revision-cards-grid">
                    {cards.map((card, idx) => (
                        <div 
                            key={card.id} 
                            className={`revision-card-mini ${currentCardIndex === idx ? 'active' : ''}`}
                            onClick={() => setCurrentCardIndex(idx)}
                        >
                            <span className="mini-category">{card.category}</span>
                            <h4>{card.title}</h4>
                            {isCardSaved(card.id) && <Bookmark size={14} className="saved-indicator" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Saved Cards */}
            {savedCards.length > 0 && (
                <div className="saved-cards-section">
                    <div className="saved-header">
                        <h3><Bookmark size={18} /> Saved Cards ({savedCards.length})</h3>
                        <button className="btn-secondary btn-sm" onClick={shareAllSaved}>
                            <Share2 size={14} />
                            Share All
                        </button>
                    </div>
                    <div className="saved-cards-list">
                        {savedCards.map(card => (
                            <div key={card.id} className="saved-card-item">
                                <div className="saved-card-info">
                                    <h4>{card.title}</h4>
                                    <span>{card.category}</span>
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => toggleSaveCard(card)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
