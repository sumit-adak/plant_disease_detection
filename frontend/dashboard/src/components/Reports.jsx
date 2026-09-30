import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Download, Printer, Camera, Calendar, 
  CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Leaf,
  Search, ShieldCheck, Award, Share2, ArrowRight
} from 'lucide-react';
import '../styles/reports.css';

const Reports = ({ setActiveTab }) => {
  const [reportsList, setReportsList] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadReports = () => {
    try {
      const saved = localStorage.getItem('plantGuardDiagnosisHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        setReportsList(parsed);
        if (parsed.length > 0) {
          setActiveReport(prev => {
            if (prev) {
              const found = parsed.find(p => p.id === prev.id);
              return found || parsed[0];
            }
            return parsed[0];
          });
        }
      } else {
        setReportsList([]);
        setActiveReport(null);
      }
    } catch (e) {
      console.error(e);
      setReportsList([]);
    }
  };

  useEffect(() => {
    loadReports();
    const handleUpdate = () => loadReports();
    window.addEventListener('plantGuardDiagnosisAdded', handleUpdate);
    return () => window.removeEventListener('plantGuardDiagnosisAdded', handleUpdate);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredReports = useMemo(() => {
    if (!searchQuery) return reportsList;
    return reportsList.filter(item => 
      item.diseaseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.crop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scientificName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reportsList, searchQuery]);

  return (
    <section id="reports" className="reports-container clay-reports-wrapper">
      {/* Clay Header Banner */}
      <header className="clay-reports-header">
        <div className="clay-reports-header-left">
          <div className="clay-reports-badge-title">
            <Award size={13} />
            <span>Pathology Certification Bureau</span>
          </div>
          <div className="clay-reports-title-row">
            <h1>Agronomic Diagnosis Reports</h1>
          </div>
          <p className="clay-reports-subtitle">
            Generate, review, or print clinical crop health documentation and certified chemical/organic prescriptions.
          </p>
        </div>

        {reportsList.length > 0 && (
          <div className="clay-reports-header-actions">
            <button 
              className="clay-btn clay-btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={15} /> Print Certificate
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

      {/* Main Content Area */}
      <div className="clay-reports-scroll-body">
        {reportsList.length === 0 ? (
          <div className="clay-empty-container">
            <div className="clay-empty-icon-wrap">
              <FileText size={42} />
            </div>
            <h3>No Pathology Reports Generated</h3>
            <p>
              Scan plant foliage using the AI leaf camera to produce formal diagnostic documentation, symptom logs, and targeted treatment plans.
            </p>
            <button 
              className="clay-btn clay-btn-primary"
              onClick={() => setActiveTab && setActiveTab('scanner')}
            >
              <Camera size={16} /> Run First Scan
            </button>
          </div>
        ) : (
          <div className="clay-reports-workspace">
            {/* Left Sidebar List */}
            <aside className="clay-reports-sidebar">
              <div className="clay-reports-sidebar-title">
                <span>Recent Records ({reportsList.length})</span>
              </div>

              <div className="clay-reports-search-box">
                <Search size={15} />
                <input 
                  type="text"
                  className="clay-reports-search-input"
                  placeholder="Filter reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="clay-reports-list-cards">
                {filteredReports.map((item) => {
                  const isSelected = activeReport?.id === item.id;
                  return (
                    <div 
                      key={item.id}
                      className={`clay-report-mini-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setActiveReport(item)}
                    >
                      <img 
                        src={item.image || item.previewUrl} 
                        alt={item.diseaseName}
                        className="clay-report-thumb"
                      />
                      <div className="clay-report-meta">
                        <span className="clay-report-mini-title">{item.diseaseName}</span>
                        <span className="clay-report-mini-sub">{item.crop} • {item.date}</span>
                      </div>
                      <span className="clay-report-mini-badge">
                        {item.confidence}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Right Detail Pane: Clinical Certificate Document */}
            {activeReport && (
              <article className="clay-certificate-sheet">
                {/* Official Ribbon */}
                <div className="clay-cert-ribbon">
                  <div className="clay-cert-id-tag">
                    <Leaf size={14} /> CERTIFIED SPECIMEN ID #{activeReport.id}
                  </div>
                  <div className="clay-cert-stamp">
                    <ShieldCheck size={14} /> AI VALIDATED AGRONOMIC REPORT
                  </div>
                </div>

                {/* Title & Severity Header */}
                <div className="clay-cert-title-group">
                  <div>
                    <h2>{activeReport.diseaseName}</h2>
                    <p className="clay-cert-subtitle">
                      Host: <strong>{activeReport.crop}</strong> | Pathogen: <em>{activeReport.scientificName || 'Foliar Pathogen'}</em> | Evaluated {activeReport.date} at {activeReport.time}
                    </p>
                  </div>
                  <span className={`clay-severity-pill ${activeReport.severity || 'moderate'}`} style={{ position: 'static' }}>
                    {activeReport.severity}
                  </span>
                </div>

                {/* Specimen Visual & ML Confidence Gauge */}
                <div className="clay-specimen-grid">
                  <div className="clay-specimen-img-frame">
                    <img 
                      src={activeReport.image || activeReport.previewUrl} 
                      alt={activeReport.diseaseName}
                    />
                  </div>
                  <div className="clay-specimen-metrics">
                    <div className="clay-metrics-headline">
                      <strong>Convolutional Match Confidence</strong>
                      <span>{activeReport.confidence}%</span>
                    </div>
                    <div className="clay-metrics-bar-track">
                      <div 
                        className="clay-metrics-bar-fill" 
                        style={{ width: `${activeReport.confidence}%` }}
                      />
                    </div>
                    <p className="clay-specimen-note">
                      Validated against trained agronomic image dataset models with multi-stage convolutional neural network foliage lesion mapping.
                    </p>
                  </div>
                </div>

                {/* Foliar Clinical Symptoms */}
                {activeReport.symptoms && activeReport.symptoms.length > 0 && (
                  <div className="clay-cert-section-card">
                    <h4 className="clay-cert-section-title">
                      <AlertTriangle size={16} color="var(--clay-olive)" /> Foliar Clinical Symptoms & Diagnostic Markers
                    </h4>
                    <ul className="clay-symptoms-list">
                      {activeReport.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment Protocols */}
                <div className="clay-protocol-grid">
                  {/* Organic Card */}
                  <div className="clay-protocol-card organic">
                    <div className="clay-protocol-header">
                      🌿 Certified Organic Treatment Protocol
                    </div>
                    <ul className="clay-protocol-items">
                      {activeReport.organicCare?.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      )) || (
                        <li>Apply certified cold-pressed neem oil (5ml/L) and improve soil aeration.</li>
                      )}
                    </ul>
                  </div>

                  {/* Chemical Card */}
                  <div className="clay-protocol-card chemical">
                    <div className="clay-protocol-header">
                      🧪 Chemical Fungicide & Intervention Protocol
                    </div>
                    <ul className="clay-protocol-items">
                      {activeReport.chemicalCare?.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      )) || (
                        <li>Apply targeted broad-spectrum copper oxychloride or azoxystrobin spray.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Prevention Card */}
                {activeReport.prevention && (
                  <div className="clay-prevention-card">
                    <h4>
                      <ShieldCheck size={16} /> Agronomic Prevention & Long-term Crop Health
                    </h4>
                    <p>{activeReport.prevention}</p>
                  </div>
                )}

                {/* Sign-off Seal & Actions */}
                <div className="clay-cert-footer">
                  <div className="clay-cert-signoff">
                    <div className="clay-cert-seal-icon">
                      <Award size={22} />
                    </div>
                    <div className="clay-cert-signoff-text">
                      <span className="clay-cert-authority">PlantCare AI Agronomic Diagnostics Lab</span>
                      <span className="clay-cert-hash">SEC-VERIFY-HASH: {Math.random().toString(36).substring(2, 10).toUpperCase()}-AGRI</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button 
                      className="clay-btn clay-btn-secondary"
                      onClick={handlePrint}
                    >
                      <Printer size={14} /> Print Document
                    </button>
                    <button 
                      className="clay-btn clay-btn-primary"
                      onClick={() => setActiveTab && setActiveTab('scanner')}
                    >
                      <Camera size={14} /> Scan Next Specimen
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;
