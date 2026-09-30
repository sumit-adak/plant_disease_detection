import React, { useState, useEffect, useMemo } from 'react';
import { 
  Inbox, Trash2, Camera, Calendar, ArrowRight, 
  CheckCircle2, ShieldAlert, Sparkles, Eye, Search,
  Filter, AlertTriangle, Clock, Layers, MessageSquare, X,
  ShieldCheck, Zap
} from 'lucide-react';
import '../styles/history.css';

const History = ({ setActiveTab }) => {
  const [historyList, setHistoryList] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'healthy' | 'moderate' | 'severe'

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('plantGuardDiagnosisHistory');
      if (saved) {
        setHistoryList(JSON.parse(saved));
      } else {
        setHistoryList([]);
      }
    } catch (e) {
      console.error(e);
      setHistoryList([]);
    }
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener('plantGuardDiagnosisAdded', handleUpdate);
    return () => window.removeEventListener('plantGuardDiagnosisAdded', handleUpdate);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently clear all scan records?')) {
      localStorage.removeItem('plantGuardDiagnosisHistory');
      setHistoryList([]);
      setSelectedScan(null);
    }
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    const updated = historyList.filter(item => item.id !== id);
    localStorage.setItem('plantGuardDiagnosisHistory', JSON.stringify(updated));
    setHistoryList(updated);
    if (selectedScan?.id === id) {
      setSelectedScan(null);
    }
  };

  // Filter and search computation
  const filteredList = useMemo(() => {
    return historyList.filter(item => {
      const matchesSearch = 
        !searchTerm ||
        item.diseaseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.crop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.scientificName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity = 
        filterSeverity === 'all' || 
        item.severity?.toLowerCase() === filterSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [historyList, searchTerm, filterSeverity]);

  // Statistics
  const totalScans = historyList.length;
  const healthyCount = historyList.filter(i => i.severity === 'healthy').length;
  const infectedCount = totalScans - healthyCount;

  return (
    <section id="history" className="history-container clay-history-wrapper">
      {/* Clay Header Banner */}
      <header className="clay-history-header">
        <div className="clay-history-header-left">
          <div className="clay-history-badge-title">
            <Layers size={13} />
            <span>Foliage Telemetry Archive</span>
          </div>
          <div className="clay-history-title-row">
            <h1>Diagnosis History</h1>
          </div>
          <p className="clay-history-subtitle">
            Catalog of historical leaf scans, pathogen lesion detections, and actionable treatment archives.
          </p>
        </div>

        {historyList.length > 0 && (
          <div className="clay-history-header-actions">
            <button 
              className="clay-btn clay-btn-danger"
              onClick={handleClearHistory}
              title="Purge all scan history"
            >
              <Trash2 size={15} /> Clear All
            </button>
            <button 
              className="clay-btn clay-btn-primary"
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={15} /> New Scan
            </button>
          </div>
        )}
      </header>

      {/* Summary Stats Strip */}
      {historyList.length > 0 && (
        <div className="clay-history-stats-strip">
          <div className="clay-history-stat-card">
            <div className="clay-stat-icon-wrap total">
              <Layers size={20} />
            </div>
            <div className="clay-history-stat-data">
              <span className="clay-stat-num">{totalScans}</span>
              <span className="clay-stat-label">Total Scans Recorded</span>
            </div>
          </div>

          <div className="clay-history-stat-card">
            <div className="clay-stat-icon-wrap healthy">
              <ShieldCheck size={20} />
            </div>
            <div className="clay-history-stat-data">
              <span className="clay-stat-num">{healthyCount}</span>
              <span className="clay-stat-label">Healthy Specimens</span>
            </div>
          </div>

          <div className="clay-history-stat-card">
            <div className="clay-stat-icon-wrap infected">
              <ShieldAlert size={20} />
            </div>
            <div className="clay-history-stat-data">
              <span className="clay-stat-num">{infectedCount}</span>
              <span className="clay-stat-label">Pathogens & Alerts</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar: Search & Severity Filters */}
      {historyList.length > 0 && (
        <div className="clay-history-controls-bar">
          <div className="clay-history-search-box">
            <Search size={16} />
            <input 
              type="text"
              className="clay-history-search-input"
              placeholder="Search by crop, disease, or pathogen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="clay-history-filter-pills">
            <button 
              className={`clay-filter-pill ${filterSeverity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('all')}
            >
              All Records ({historyList.length})
            </button>
            <button 
              className={`clay-filter-pill ${filterSeverity === 'healthy' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('healthy')}
            >
              Healthy
            </button>
            <button 
              className={`clay-filter-pill ${filterSeverity === 'moderate' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('moderate')}
            >
              Moderate
            </button>
            <button 
              className={`clay-filter-pill ${filterSeverity === 'severe' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('severe')}
            >
              Severe Alerts
            </button>
          </div>
        </div>
      )}

      {/* Main Scrollable Body */}
      <div className="clay-history-scroll-body">
        {historyList.length === 0 ? (
          <div className="clay-empty-container">
            <div className="clay-empty-icon-wrap">
              <Inbox size={42} />
            </div>
            <h3>No Scan History Yet</h3>
            <p>
              Capture or upload photos of leaves, stems, or fruits. Every deep convolutional diagnosis and remediation plan is securely stored here.
            </p>
            <button 
              className="clay-btn clay-btn-primary"
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={16} /> Launch Crop Scanner
            </button>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="clay-empty-container" style={{ padding: '3rem 1.5rem' }}>
            <div className="clay-empty-icon-wrap" style={{ width: '60px', height: '60px' }}>
              <Search size={28} />
            </div>
            <h3>No Matches Found</h3>
            <p>No scans match your search query or selected severity filter.</p>
            <button 
              className="clay-btn clay-btn-secondary"
              onClick={() => { setSearchTerm(''); setFilterSeverity('all'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="clay-history-grid">
            {filteredList.map((item) => {
              const isHealthy = item.severity === 'healthy';
              return (
                <div 
                  key={item.id} 
                  className="clay-scan-card"
                  onClick={() => setSelectedScan(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="clay-scan-visual">
                    <img 
                      src={item.image || item.previewUrl} 
                      alt={item.diseaseName}
                      className="clay-scan-img"
                    />
                    <span className={`clay-severity-pill ${item.severity || 'moderate'}`}>
                      {item.severity}
                    </span>
                    <span className="clay-date-pill">
                      <Calendar size={12} /> {item.date || 'Recent'}
                    </span>
                  </div>

                  <div className="clay-scan-content">
                    <div className="clay-scan-header-row">
                      <div className="clay-scan-title-group">
                        <h3>{item.diseaseName}</h3>
                        <div className="clay-scan-crop-tag">
                          {item.crop} {item.scientificName && <span className="clay-scan-scientific">• {item.scientificName}</span>}
                        </div>
                      </div>
                      <span className="clay-scan-confidence-badge">
                        {item.confidence}% Match
                      </span>
                    </div>

                    <div className="clay-confidence-meter">
                      <div className="clay-meter-track">
                        <div 
                          className="clay-meter-fill" 
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                    </div>

                    <p className="clay-scan-snippet">
                      {item.symptoms?.[0] || 'Pathology markers logged from high-resolution foliage scan.'}
                    </p>

                    <div className="clay-scan-actions">
                      <button 
                        className="clay-card-link-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (setActiveTab) setActiveTab('reports');
                        }}
                      >
                        <Eye size={13} /> View Full Report
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button 
                          className="clay-delete-single-btn"
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          title="Delete this scan record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Quick View of Selected Scan */}
      {selectedScan && (
        <div className="clay-modal-overlay" onClick={() => setSelectedScan(null)}>
          <div className="clay-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="clay-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className={`clay-severity-pill ${selectedScan.severity}`} style={{ position: 'static' }}>
                  {selectedScan.severity}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--clay-text-muted)' }}>
                  ID: {selectedScan.id}
                </span>
              </div>
              <button className="clay-modal-close-btn" onClick={() => setSelectedScan(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1.25rem', alignItems: 'center' }}>
              <img 
                src={selectedScan.image || selectedScan.previewUrl} 
                alt={selectedScan.diseaseName}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--clay-radius-md)', border: '2px solid rgba(255,255,255,0.95)' }}
              />
              <div>
                <h2 style={{ fontSize: '1.45rem', color: 'var(--clay-text-primary)', margin: '0 0 0.35rem' }}>
                  {selectedScan.diseaseName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginBottom: '0.65rem' }}>
                  Crop: <strong>{selectedScan.crop}</strong> | Pathogen: <em>{selectedScan.scientificName || 'Unspecified'}</em>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="clay-scan-confidence-badge" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    {selectedScan.confidence}% ML Confidence
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-muted)' }}>
                    Scanned on {selectedScan.date} at {selectedScan.time}
                  </span>
                </div>
              </div>
            </div>

            {selectedScan.symptoms && selectedScan.symptoms.length > 0 && (
              <div style={{ background: 'var(--clay-bg-inset)', padding: '1rem', borderRadius: 'var(--clay-radius-md)', boxShadow: 'var(--clay-shadow-inset)' }}>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--clay-text-primary)', margin: '0 0 0.5rem', fontWeight: 700 }}>
                  Observed Diagnostic Symptoms
                </h4>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.84rem', color: 'var(--clay-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {selectedScan.symptoms.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedScan.organicCare && (
              <div style={{ background: 'var(--clay-mint-soft)', padding: '1rem', borderRadius: 'var(--clay-radius-md)', border: '1.5px solid rgba(255,255,255,0.95)' }}>
                <h4 style={{ fontSize: '0.88rem', color: '#166534', margin: '0 0 0.4rem', fontWeight: 700 }}>
                  🌿 Organic Remediation Prescriptions
                </h4>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {selectedScan.organicCare.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                className="clay-btn clay-btn-secondary"
                onClick={() => {
                  setSelectedScan(null);
                  if (setActiveTab) setActiveTab('dashboard');
                }}
              >
                <MessageSquare size={15} /> Ask Assistant
              </button>
              <button 
                className="clay-btn clay-btn-primary"
                onClick={() => {
                  setSelectedScan(null);
                  if (setActiveTab) setActiveTab('reports');
                }}
              >
                <Eye size={15} /> Open Pathology Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default History;
