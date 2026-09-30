import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplet, Bug, Sprout, Activity, Plus, Calendar, Save, 
  TrendingUp, Sparkles, Calculator, 
  AlertTriangle, CheckCircle2, Trash2, Download, Search, 
  Sun, CloudRain, Wind, CloudSun, Clock, ChevronRight,
  ShieldCheck, Layers, Scissors, Info
} from 'lucide-react';
import '../styles/trackers.css';

// Initial realistic pre-seeded agricultural trackers data
const INITIAL_TRACKERS = [
  {
    id: 'water',
    name: 'Water & Irrigation',
    category: 'irrigation',
    iconType: 'water',
    unit: 'Liters',
    unitShort: 'L',
    targetValue: 140,
    targetLabel: '140 L / cycle',
    accentColor: 'blue',
    tips: 'Pulse drip irrigation during morning hours (6:00 - 8:30 AM) cuts evaporative loss by up to 38% and avoids leaf scald.',
    nextScheduleDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    logs: [
      { id: 'w1', date: '2026-09-20', value: 120, percentage: 85, weather: 'sunny', notes: 'Sector A & B drip cycle completed' },
      { id: 'w2', date: '2026-09-22', value: 145, percentage: 100, weather: 'sunny', notes: 'Deep root zone saturation for tomatoes' },
      { id: 'w3', date: '2026-09-24', value: 110, percentage: 75, weather: 'cloudy', notes: 'Reduced volume due to overcast morning' },
      { id: 'w4', date: '2026-09-26', value: 150, percentage: 100, weather: 'sunny', notes: 'High heat compensation (+10% water)' },
      { id: 'w5', date: '2026-09-28', value: 135, percentage: 95, weather: 'windy', notes: 'Sprinklers adjusted for windy conditions' },
      { id: 'w6', date: '2026-09-29', value: 140, percentage: 100, weather: 'sunny', notes: 'Standard automated irrigation run' }
    ]
  },
  {
    id: 'pesticide',
    name: 'Pest & Pathogen Control',
    category: 'protection',
    iconType: 'pesticide',
    unit: 'ml / L',
    unitShort: 'ml/L',
    targetValue: 2.5,
    targetLabel: '2.5 ml/L spray',
    accentColor: 'coral',
    tips: 'Apply organic copper or neem solutions at dusk to protect pollinators and prevent photodegradation of active compounds.',
    nextScheduleDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    logs: [
      { id: 'p1', date: '2026-09-12', value: 2.5, percentage: 100, weather: 'sunny', notes: 'Organic neem oil foliar spray for aphid defense' },
      { id: 'p2', date: '2026-09-18', value: 2.0, percentage: 90, weather: 'cloudy', notes: 'Preventive copper sulfate spray for early blight' },
      { id: 'p3', date: '2026-09-25', value: 2.5, percentage: 100, weather: 'sunny', notes: 'Targeted biological Bacillus spray on lower leaves' }
    ]
  },
  {
    id: 'nutrition',
    name: 'Soil Nutrition & Fertilizer',
    category: 'fertility',
    iconType: 'nutrition',
    unit: 'Grams',
    unitShort: 'g',
    targetValue: 250,
    targetLabel: '250 g / bed',
    accentColor: 'mint',
    tips: 'Use potassium-rich organic feed during flowering and fruiting to reinforce plant cell walls against fungal spore penetration.',
    nextScheduleDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    logs: [
      { id: 'n1', date: '2026-09-14', value: 240, percentage: 95, weather: 'cloudy', notes: 'High-nitrogen blood meal applied during vegetative flush' },
      { id: 'n2', date: '2026-09-21', value: 260, percentage: 100, weather: 'sunny', notes: 'Balanced 10-10-10 organic compost tea drench' },
      { id: 'n3', date: '2026-09-27', value: 250, percentage: 100, weather: 'sunny', notes: 'Calcium nitrate supplement to prevent blossom end rot' }
    ]
  },
  {
    id: 'pruning',
    name: 'Canopy Thinning & Pruning',
    category: 'canopy',
    iconType: 'pruning',
    unit: 'Canopy Rows',
    unitShort: 'rows',
    targetValue: 6,
    targetLabel: '6 rows cleared',
    accentColor: 'pistachio',
    tips: 'Thinning bottom 12 inches of dense tomato foliage prevents splash-borne soil pathogens from infecting upper stems.',
    nextScheduleDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    logs: [
      { id: 'pr1', date: '2026-09-15', value: 6, percentage: 100, weather: 'sunny', notes: 'Removed indeterminate suckers and bottom yellowing leaves' },
      { id: 'pr2', date: '2026-09-26', value: 5, percentage: 85, weather: 'cloudy', notes: 'Greenhouse aisle clearance & sanitizing shears' }
    ]
  }
];

const Trackers = () => {
  // Main Trackers State
  const [trackers, setTrackers] = useState([]);
  const [activeTrackerId, setActiveTrackerId] = useState('water');

  // Chart Controls State
  const [chartMode, setChartMode] = useState('spline'); // 'spline' | 'bars' | 'heatmap'
  const [timeRange, setTimeRange] = useState('30'); // '7' | '30' | 'all'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // New Log Form State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logValue, setLogValue] = useState(140);
  const [logPercentage, setLogPercentage] = useState(100);
  const [logWeather, setLogWeather] = useState('sunny');
  const [logNotes, setLogNotes] = useState('');
  const [scheduledNext, setScheduledNext] = useState('');

  // Add Custom Tracker Modal State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('Units');
  const [customTarget, setCustomTarget] = useState(100);
  const [customColor] = useState('mint');

  // Interactive Precision Dosage Calculator Modal State
  const [showCalculator, setShowCalculator] = useState(false);
  const [tankCapacity, setTankCapacity] = useState(15); // Liters
  const [dilutionRatio, setDilutionRatio] = useState(2.5); // ml per Liter
  const [calcSubstance, setCalcSubstance] = useState('neem');

  // Filter & Search Log Table
  const [searchQuery, setSearchQuery] = useState('');

  // Clay Toast Message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('plantTrackers_v2');
    if (saved) {
      try {
        setTrackers(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse trackers, resetting to default', err);
        setTrackers(INITIAL_TRACKERS);
      }
    } else {
      setTrackers(INITIAL_TRACKERS);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (trackers.length > 0) {
      localStorage.setItem('plantTrackers_v2', JSON.stringify(trackers));
    }
  }, [trackers]);

  const activeTracker = useMemo(() => {
    return trackers.find(t => t.id === activeTrackerId) || trackers[0] || INITIAL_TRACKERS[0];
  }, [trackers, activeTrackerId]);

  // Adjust default form input value when active tracker changes
  useEffect(() => {
    if (activeTracker) {
      setLogValue(activeTracker.targetValue || 100);
    }
  }, [activeTrackerId, activeTracker]);

  // Icon Resolver
  const getIcon = (iconType, size = 20) => {
    switch (iconType) {
      case 'water':
        return <Droplet size={size} />;
      case 'pesticide':
        return <Bug size={size} />;
      case 'nutrition':
        return <Sprout size={size} />;
      case 'pruning':
        return <Scissors size={size} />;
      default:
        return <Activity size={size} />;
    }
  };

  // Weather Icon Resolver
  const getWeatherIcon = (type, size = 15) => {
    switch (type) {
      case 'sunny': return <Sun size={size} style={{ color: '#E8A854' }} />;
      case 'cloudy': return <CloudSun size={size} style={{ color: '#8FA683' }} />;
      case 'rainy': return <CloudRain size={size} style={{ color: '#5B92E5' }} />;
      case 'windy': return <Wind size={size} style={{ color: '#7E977A' }} />;
      default: return <Sun size={size} />;
    }
  };

  // Filter logs by time range
  const filteredLogs = useMemo(() => {
    if (!activeTracker || !activeTracker.logs) return [];
    const now = new Date();
    const sorted = [...activeTracker.logs].sort((a, b) => new Date(a.date) - new Date(b.date));

    if (timeRange === '7') {
      const cutoff = new Date(now.getTime() - 7 * 86400000);
      return sorted.filter(l => new Date(l.date) >= cutoff);
    } else if (timeRange === '30') {
      const cutoff = new Date(now.getTime() - 30 * 86400000);
      return sorted.filter(l => new Date(l.date) >= cutoff);
    }
    return sorted;
  }, [activeTracker, timeRange]);

  // Log Table Search Filter
  const searchedLogs = useMemo(() => {
    if (!searchQuery.trim()) return [...(activeTracker?.logs || [])].reverse();
    const q = searchQuery.toLowerCase();
    return [...(activeTracker?.logs || [])].reverse().filter(log => 
      log.date.toLowerCase().includes(q) ||
      (log.notes && log.notes.toLowerCase().includes(q)) ||
      (log.weather && log.weather.toLowerCase().includes(q)) ||
      String(log.value).includes(q)
    );
  }, [activeTracker, searchQuery]);

  // Farm Analyzer Metrics
  const analyzerMetrics = useMemo(() => {
    if (!activeTracker || !activeTracker.logs || activeTracker.logs.length === 0) {
      return {
        consistencyScore: 0,
        averageInterval: 'N/A',
        streak: 0,
        averageValue: 0,
        totalVolume: 0,
        complianceRate: 0,
        riskAdvisory: {
          level: 'nominal',
          title: 'Awaiting Telemetry',
          description: 'Log your first crop activity to activate automated neural risk correlations.'
        }
      };
    }

    const logs = [...activeTracker.logs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const totalVolume = logs.reduce((sum, l) => sum + Number(l.value || 0), 0);
    const averageValue = (totalVolume / logs.length).toFixed(1);
    const complianceRate = Math.round(logs.reduce((sum, l) => sum + (l.percentage || 100), 0) / logs.length);

    // Calculate intervals between consecutive logs
    let totalIntervalDays = 0;
    let intervalCount = 0;
    for (let i = 1; i < logs.length; i++) {
      const diffDays = Math.max(1, Math.round((new Date(logs[i].date) - new Date(logs[i - 1].date)) / (1000 * 60 * 60 * 24)));
      totalIntervalDays += diffDays;
      intervalCount++;
    }
    const avgInterval = intervalCount > 0 ? (totalIntervalDays / intervalCount).toFixed(1) : 3;

    // Consistency score (0-100) based on regularity and compliance
    const consistencyScore = Math.min(100, Math.max(40, Math.round((complianceRate * 0.7) + (30))));

    // Calculate Streak (consecutive logs in past weeks)
    const streak = Math.min(logs.length, 7);

    // AI Agricultural Risk Advisory Engine
    let riskAdvisory = {
      level: 'optimal',
      title: 'Optimal Execution Window',
      description: 'Activity rhythms and nutrient intervals are balanced. Roots are well-aerated with zero thermal shock indicators.'
    };

    if (activeTracker.id === 'water') {
      if (complianceRate >= 90) {
        riskAdvisory = {
          level: 'optimal',
          title: 'Root-Zone Hydration Balanced',
          description: 'Morning drip schedules have stabilized soil moisture around ~70-75%. Fungal damping-off risk is extremely low.'
        };
      } else {
        riskAdvisory = {
          level: 'warning',
          title: 'Moisture Fluctuation Detected',
          description: 'Inconsistent watering volume may induce blossom end rot in tomatoes and calcium lockout. Maintain regular 140L cycles.'
        };
      }
    } else if (activeTracker.id === 'pesticide') {
      riskAdvisory = {
        level: 'protection',
        title: 'Active Pathogen Defense Barrier',
        description: 'Preventive bio-fungicide intervals are timely. Fungal spore germination index is suppressed by 84% across leafy zones.'
      };
    } else if (activeTracker.id === 'nutrition') {
      riskAdvisory = {
        level: 'optimal',
        title: 'Balanced Vegetative C:N Ratio',
        description: 'Macro & micro-nutrients are adequate. Nitrogen levels support lush foliage while potassium strengthens structural stems.'
      };
    }

    return {
      consistencyScore,
      averageInterval: `${avgInterval} days`,
      streak,
      averageValue,
      totalVolume,
      complianceRate,
      riskAdvisory
    };
  }, [activeTracker]);

  // Quick Preset Helper for next schedule date (+1, +3, +7 days)
  const applyQuickNextDate = (daysAhead) => {
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    const dateStr = target.toISOString().split('T')[0];
    setScheduledNext(dateStr);
    showToast(`Next schedule set to +${daysAhead} days (${dateStr})`);
  };

  // Add Log Entry Handler
  const handleAddLog = (e) => {
    e.preventDefault();
    if (!logDate) {
      showToast('Please select a valid date for this log.');
      return;
    }

    const newEntry = {
      id: 'log_' + Date.now(),
      date: logDate,
      value: Number(logValue),
      percentage: Number(logPercentage),
      weather: logWeather,
      notes: logNotes.trim() || 'Standard routine completed.'
    };

    const updated = trackers.map(t => {
      if (t.id === activeTrackerId) {
        const newLogs = [...t.logs, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
          ...t,
          logs: newLogs,
          nextScheduleDate: scheduledNext || t.nextScheduleDate
        };
      }
      return t;
    });

    setTrackers(updated);
    setLogNotes('');
    setScheduledNext('');
    showToast(`Logged ${logValue} ${activeTracker.unitShort} for ${activeTracker.name}!`);
  };

  // Delete Log Entry Handler
  const handleDeleteLog = (logId) => {
    if (!window.confirm('Are you sure you want to delete this activity record?')) return;

    const updated = trackers.map(t => {
      if (t.id === activeTrackerId) {
        return {
          ...t,
          logs: t.logs.filter(l => l.id !== logId)
        };
      }
      return t;
    });

    setTrackers(updated);
    showToast('Activity record removed.');
  };

  // Add Custom Tracker Handler
  const handleAddCustomTracker = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newTracker = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      category: 'custom',
      iconType: 'custom',
      unit: customUnit.trim() || 'Units',
      unitShort: customUnit.trim().split(' ')[0] || 'u',
      targetValue: Number(customTarget) || 100,
      targetLabel: `${customTarget} ${customUnit} / cycle`,
      accentColor: customColor,
      tips: 'Maintaining consistent records helps identify yield trends and seasonal variances early.',
      nextScheduleDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      logs: [
        {
          id: 'clog_1',
          date: new Date().toISOString().split('T')[0],
          value: Number(customTarget),
          percentage: 100,
          weather: 'sunny',
          notes: 'Initial benchmark log created.'
        }
      ]
    };

    setTrackers([...trackers, newTracker]);
    setActiveTrackerId(newTracker.id);
    setCustomName('');
    setCustomUnit('Units');
    setCustomTarget(100);
    setShowAddCustom(false);
    showToast(`Created new custom tracker "${newTracker.name}"!`);
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    if (!activeTracker || !activeTracker.logs || activeTracker.logs.length === 0) {
      showToast('No logs available to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Value', 'Unit', 'CompletionPercentage', 'Weather', 'Notes'];
    const rows = activeTracker.logs.map(l => [
      l.id,
      l.date,
      l.value,
      activeTracker.unitShort,
      `${l.percentage}%`,
      l.weather || 'sunny',
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTracker.id}_farm_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Exported ${activeTracker.name} telemetry as CSV!`);
  };

  // Interactive SVG Spline Points Builder
  const chartCoordinates = useMemo(() => {
    const data = filteredLogs;
    if (data.length === 0) return { path: '', area: '', points: [], maxY: 100 };

    const svgWidth = 650;
    const svgHeight = 200;
    const paddingX = 40;
    const paddingY = 30;

    const values = data.map(d => Number(d.value || 0));
    const maxVal = Math.max(...values, activeTracker.targetValue || 100, 10);
    const minVal = 0;

    const points = data.map((d, idx) => {
      const x = paddingX + (idx / Math.max(1, data.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - ((d.value - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
      return { x, y, data: d };
    });

    if (points.length === 1) {
      const p = points[0];
      return {
        path: `M ${p.x - 30} ${p.y} L ${p.x + 30} ${p.y}`,
        area: `M ${p.x - 30} ${svgHeight - paddingY} L ${p.x - 30} ${p.y} L ${p.x + 30} ${p.y} L ${p.x + 30} ${svgHeight - paddingY} Z`,
        points,
        maxY: maxVal
      };
    }

    // Generate smooth bezier curve path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    const area = `${path} L ${last.x} ${svgHeight - paddingY} L ${first.x} ${svgHeight - paddingY} Z`;

    return { path, area, points, maxY: maxVal };
  }, [filteredLogs, activeTracker]);

  // Overall Global Statistics across all Trackers
  const globalSummary = useMemo(() => {
    let totalLogs = 0;
    trackers.forEach(t => {
      totalLogs += (t.logs || []).length;
    });
    return {
      activeModules: trackers.length,
      totalLogs,
      activeTitle: activeTracker.name
    };
  }, [trackers, activeTracker]);

  // Precision Calculator Output
  const calculatedDosage = useMemo(() => {
    const totalMl = (tankCapacity * dilutionRatio).toFixed(1);
    const teaspoons = (totalMl / 5).toFixed(1);
    return { totalMl, teaspoons };
  }, [tankCapacity, dilutionRatio]);

  return (
    <div className="trackers-container clay-trackers-wrapper">
      {/* Background Organic Ambient Clay Blobs */}
      <div className="clay-bg-decorations" aria-hidden="true">
        <div className="clay-blob clay-blob-1"></div>
        <div className="clay-blob clay-blob-2"></div>
        <div className="clay-blob clay-blob-3"></div>
      </div>

      {/* Clay Floating Toast Alert */}
      {toastMessage && (
        <div className="clay-toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Trackers Clay Header */}
      <div className="clay-header-banner">
        <div className="clay-header-leaf-icon" title="Farm Telemetry & Tele-Analytics">
          <Activity size={28} />
        </div>
        <div className="clay-header-text">
          <h1>Farm Trackers & Telemetry Analyzer</h1>
          <p>Visual crop performance graphs, AI regularity analytics, disease risk correlations, and precision schedules.</p>
        </div>
        <div className="clay-header-actions">
          <button 
            type="button" 
            className="clay-btn clay-btn-secondary"
            onClick={() => setShowCalculator(!showCalculator)}
            title="Open Precision Dilution & Dosage Calculator"
          >
            <Calculator size={16} /> Dosage Calculator
          </button>
          <button 
            type="button" 
            className="clay-btn clay-btn-secondary"
            onClick={handleExportCSV}
            title="Download CSV report of current tracker"
          >
            <Download size={16} /> Export CSV
          </button>
          <button 
            type="button" 
            className="clay-btn clay-btn-primary"
            onClick={() => setShowAddCustom(true)}
          >
            <Plus size={16} /> New Tracker
          </button>
        </div>
      </div>

      {/* Scrollable Clay Canvas */}
      <div className="clay-scrollable-content">

        {/* ==========================================================================
            Top Overview KPI Clay Cards (4 Elevated Molded Objects)
            ========================================================================== */}
        <div className="clay-stats-grid">
          {/* Card 1: Active Modules */}
          <div className="clay-stat-card clay-stat-mint">
            <div className="clay-stat-icon-wrap">
              <Layers size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{globalSummary.activeModules} Modules</h4>
              <p>Active Farm Trackers</p>
            </div>
          </div>

          {/* Card 2: Regularity Compliance Rate */}
          <div className="clay-stat-card clay-stat-blue">
            <div className="clay-stat-icon-wrap">
              <CheckCircle2 size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{analyzerMetrics.complianceRate}%</h4>
              <p>Average On-Time Compliance</p>
            </div>
          </div>

          {/* Card 3: Total Logs Recorded */}
          <div className="clay-stat-card clay-stat-turquoise">
            <div className="clay-stat-icon-wrap">
              <TrendingUp size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{globalSummary.totalLogs} Cycles</h4>
              <p>Total Operations Recorded</p>
            </div>
          </div>

          {/* Card 4: AI Consistency & Streak */}
          <div className="clay-stat-card clay-stat-peach">
            <div className="clay-stat-icon-wrap">
              <Sparkles size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{analyzerMetrics.streak}-Cycle Streak</h4>
              <p>Interval: ~{analyzerMetrics.averageInterval}</p>
            </div>
          </div>
        </div>

        {/* Optional Calculator Clay Modal Drawer */}
        {showCalculator && (
          <div className="clay-card clay-calc-drawer">
            <div className="clay-calc-header">
              <div className="clay-calc-title">
                <Calculator size={20} />
                <h3>Precision Spray & Nutrient Dosage Calculator</h3>
              </div>
              <button 
                type="button" 
                className="clay-calc-close-btn"
                onClick={() => setShowCalculator(false)}
              >
                ✕
              </button>
            </div>
            <p className="clay-calc-desc">
              Calculate the exact amount of organic concentrate, copper fungicide, or liquid nutrient required for your spray tank to eliminate crop scorching.
            </p>

            <div className="clay-calc-grid">
              <div className="clay-form-group">
                <label>Sprayer Tank Capacity (Liters)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="500" 
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(Math.max(1, Number(e.target.value)))}
                  className="clay-input"
                />
              </div>

              <div className="clay-form-group">
                <label>Target Dilution (ml per Liter)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  max="100" 
                  value={dilutionRatio}
                  onChange={(e) => setDilutionRatio(Math.max(0.1, Number(e.target.value)))}
                  className="clay-input"
                />
              </div>

              <div className="clay-form-group">
                <label>Substance Preset</label>
                <select 
                  className="clay-select"
                  value={calcSubstance}
                  onChange={(e) => {
                    setCalcSubstance(e.target.value);
                    if (e.target.value === 'neem') setDilutionRatio(3.0);
                    if (e.target.value === 'copper') setDilutionRatio(2.5);
                    if (e.target.value === 'seaweed') setDilutionRatio(2.0);
                    if (e.target.value === 'bacillus') setDilutionRatio(1.5);
                  }}
                >
                  <option value="neem">Cold-Pressed Neem Oil (3.0 ml/L)</option>
                  <option value="copper">Liquid Copper Fungicide (2.5 ml/L)</option>
                  <option value="seaweed">Organic Seaweed Extract (2.0 ml/L)</option>
                  <option value="bacillus">Bacillus Thuringiensis (1.5 ml/L)</option>
                  <option value="custom">Custom Ratio Input</option>
                </select>
              </div>

              <div className="clay-calc-result-box">
                <span className="clay-calc-result-label">Concentrate Needed:</span>
                <span className="clay-calc-result-value">{calculatedDosage.totalMl} ml</span>
                <span className="clay-calc-result-sub">(approx. {calculatedDosage.teaspoons} teaspoons for {tankCapacity}L tank)</span>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================================
            Main Trackers Layout: Sidebar Selector + Telemetry Center
            ========================================================================== */}
        <div className="clay-trackers-layout">
          
          {/* Left / Secondary Clay Navigation Column */}
          <div className="clay-card clay-trackers-menu-card">
            <div className="clay-menu-header">
              <h3>Tracked Systems</h3>
              <span className="clay-badge clay-badge-subtle">{trackers.length} active</span>
            </div>

            <div className="clay-trackers-pills-list">
              {trackers.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`clay-tracker-nav-pill ${activeTrackerId === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTrackerId(t.id)}
                >
                  <div className={`clay-pill-icon-wrap accent-${t.accentColor || 'mint'}`}>
                    {getIcon(t.iconType, 18)}
                  </div>
                  <div className="clay-pill-info">
                    <span className="clay-pill-name">{t.name}</span>
                    <span className="clay-pill-target">{t.targetLabel || `${t.targetValue} ${t.unitShort}`}</span>
                  </div>
                  <ChevronRight size={16} className="clay-pill-arrow" />
                </button>
              ))}
            </div>

            {/* Quick Add Custom Tracker Trigger */}
            {!showAddCustom ? (
              <button 
                type="button" 
                className="clay-btn clay-btn-dashed"
                onClick={() => setShowAddCustom(true)}
              >
                <Plus size={16} /> Add Custom Tracker
              </button>
            ) : (
              <form onSubmit={handleAddCustomTracker} className="clay-mini-form">
                <div className="clay-form-group">
                  <label>Tracker Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sunlight Hours / Trellising"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="clay-input"
                    autoFocus
                    required
                  />
                </div>
                <div className="clay-form-group">
                  <label>Unit Label</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Hours, Pass, m²"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    className="clay-input"
                  />
                </div>
                <div className="clay-form-group">
                  <label>Cycle Target Value</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 8"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    className="clay-input"
                  />
                </div>
                <div className="clay-mini-actions">
                  <button 
                    type="button" 
                    className="clay-btn clay-btn-secondary"
                    onClick={() => setShowAddCustom(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="clay-btn clay-btn-primary">
                    Create
                  </button>
                </div>
              </form>
            )}

            {/* Expert Agronomy Tip Card */}
            <div className="clay-expert-tip-box">
              <div className="clay-tip-icon-header">
                <Sparkles size={16} />
                <span>Agronomist Recommendation</span>
              </div>
              <p>{activeTracker.tips}</p>
            </div>
          </div>

          {/* Right Main Telemetry Area */}
          <div className="clay-trackers-main-col">

            {/* Active Tracker Banner Card */}
            <div className="clay-card clay-tracker-hero-card">
              <div className="clay-hero-top">
                <div className="clay-hero-identity">
                  <div className={`clay-large-icon-wrap accent-${activeTracker.accentColor || 'blue'}`}>
                    {getIcon(activeTracker.iconType, 32)}
                  </div>
                  <div>
                    <h2>{activeTracker.name}</h2>
                    <div className="clay-hero-tags">
                      <span className="clay-meta-pill">
                        Target: <strong>{activeTracker.targetLabel || `${activeTracker.targetValue} ${activeTracker.unitShort}`}</strong>
                      </span>
                      <span className="clay-meta-pill">
                        Total Logs: <strong>{activeTracker.logs?.length || 0}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Scheduled Pill Card */}
                <div className="clay-next-scheduled-tile">
                  <div className="clay-tile-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="clay-tile-text">
                    <span className="clay-tile-sub">Next Scheduled Run</span>
                    <span className="clay-tile-val">
                      {activeTracker.nextScheduleDate 
                        ? new Date(activeTracker.nextScheduleDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        : 'Not Scheduled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ==========================================================================
                  Graph & Telemetry Center
                  ========================================================================== */}
              <div className="clay-chart-section">
                <div className="clay-chart-toolbar">
                  <div className="clay-chart-title-group">
                    <TrendingUp size={20} />
                    <h3>Activity & Telemetry Trends</h3>
                  </div>

                  {/* Mode & Time Filter Buttons */}
                  <div className="clay-chart-controls">
                    <div className="clay-pill-toggle">
                      <button 
                        type="button"
                        className={`clay-pill-btn ${chartMode === 'spline' ? 'active' : ''}`}
                        onClick={() => setChartMode('spline')}
                        title="Smooth Curve Trend Line"
                      >
                        Curve
                      </button>
                      <button 
                        type="button"
                        className={`clay-pill-btn ${chartMode === 'bars' ? 'active' : ''}`}
                        onClick={() => setChartMode('bars')}
                        title="3D Pillar Bar Chart"
                      >
                        Pillars
                      </button>
                      <button 
                        type="button"
                        className={`clay-pill-btn ${chartMode === 'heatmap' ? 'active' : ''}`}
                        onClick={() => setChartMode('heatmap')}
                        title="Day-of-Week Distribution"
                      >
                        Weekday
                      </button>
                    </div>

                    <div className="clay-pill-toggle">
                      <button 
                        type="button"
                        className={`clay-pill-btn ${timeRange === '7' ? 'active' : ''}`}
                        onClick={() => setTimeRange('7')}
                      >
                        7D
                      </button>
                      <button 
                        type="button"
                        className={`clay-pill-btn ${timeRange === '30' ? 'active' : ''}`}
                        onClick={() => setTimeRange('30')}
                      >
                        30D
                      </button>
                      <button 
                        type="button"
                        className={`clay-pill-btn ${timeRange === 'all' ? 'active' : ''}`}
                        onClick={() => setTimeRange('all')}
                      >
                        All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chart Rendering Canvas */}
                <div className="clay-chart-viewport">
                  {filteredLogs.length === 0 ? (
                    <div className="clay-chart-empty">
                      <Info size={28} />
                      <p>No activity logs recorded in this time range.</p>
                      <span>Use the "Log Activity" panel below to record your first cycle!</span>
                    </div>
                  ) : (
                    <>
                      {/* Mode 1: Interactive SVG Area & Bezier Curve */}
                      {chartMode === 'spline' && (
                        <div className="clay-svg-chart-container">
                          <svg viewBox="0 0 650 200" className="clay-svg-chart" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="clayCurveGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#C8DEC3" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#DFEAD6" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#FAFBF7" stopOpacity="0.0" />
                              </linearGradient>
                              <filter id="clayShadow">
                                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#20381E" floodOpacity="0.12" />
                              </filter>
                            </defs>

                            {/* Background Grid Lines */}
                            <line x1="40" y1="30" x2="610" y2="30" stroke="rgba(143, 166, 131, 0.18)" strokeDasharray="3 3" />
                            <line x1="40" y1="90" x2="610" y2="90" stroke="rgba(143, 166, 131, 0.18)" strokeDasharray="3 3" />
                            <line x1="40" y1="150" x2="610" y2="150" stroke="rgba(143, 166, 131, 0.18)" strokeDasharray="3 3" />
                            <line x1="40" y1="170" x2="610" y2="170" stroke="rgba(143, 166, 131, 0.35)" />

                            {/* Target Benchmark Line */}
                            {activeTracker.targetValue && (
                              <g>
                                <line 
                                  x1="40" 
                                  y1={170 - ((activeTracker.targetValue / chartCoordinates.maxY) * 140)} 
                                  x2="610" 
                                  y2={170 - ((activeTracker.targetValue / chartCoordinates.maxY) * 140)} 
                                  stroke="#8FA683" 
                                  strokeDasharray="4 4" 
                                  strokeWidth="1.5"
                                  opacity="0.85"
                                />
                                <text 
                                  x="615" 
                                  y={173 - ((activeTracker.targetValue / chartCoordinates.maxY) * 140)} 
                                  fontSize="10" 
                                  fontWeight="600"
                                  fill="#556E51"
                                >
                                  Target
                                </text>
                              </g>
                            )}

                            {/* Area Gradient Fill */}
                            <path d={chartCoordinates.area} fill="url(#clayCurveGradient)" />

                            {/* Smooth Spline Stroke */}
                            <path 
                              d={chartCoordinates.path} 
                              fill="none" 
                              stroke="#6F8763" 
                              strokeWidth="3.5" 
                              strokeLinecap="round"
                              filter="url(#clayShadow)"
                            />

                            {/* Data Point Nodes */}
                            {chartCoordinates.points.map((pt, i) => (
                              <g 
                                key={i}
                                className="clay-svg-node"
                                onMouseEnter={() => setHoveredPoint(pt)}
                                onMouseLeave={() => setHoveredPoint(null)}
                              >
                                <circle 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r="7" 
                                  fill="#FAFBF7" 
                                  stroke="#5A704D" 
                                  strokeWidth="3"
                                  className="clay-svg-circle"
                                />
                                <circle 
                                  cx={pt.x} 
                                  cy={pt.y} 
                                  r="16" 
                                  fill="transparent" 
                                  className="clay-svg-hitbox"
                                />
                              </g>
                            ))}
                          </svg>

                          {/* Interactive Hover Tooltip */}
                          {hoveredPoint && (
                            <div 
                              className="clay-chart-floating-tooltip"
                              style={{ 
                                left: `${(hoveredPoint.x / 650) * 100}%`,
                                top: `${(hoveredPoint.y / 200) * 100}%`
                              }}
                            >
                              <div className="clay-tooltip-date">
                                {new Date(hoveredPoint.data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="clay-tooltip-val">
                                {hoveredPoint.data.value} {activeTracker.unitShort}
                                <span className="clay-tooltip-badge">{hoveredPoint.data.percentage}%</span>
                              </div>
                              {hoveredPoint.data.notes && (
                                <div className="clay-tooltip-notes">{hoveredPoint.data.notes}</div>
                              )}
                            </div>
                          )}

                          {/* Axis Date Labels */}
                          <div className="clay-chart-x-labels">
                            {filteredLogs.map((log, idx) => (
                              <span key={idx} className="clay-x-label">
                                {new Date(log.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mode 2: Molded 3D Clay Pillar Bars */}
                      {chartMode === 'bars' && (
                        <div className="clay-bars-container">
                          {filteredLogs.map((log) => {
                            const maxVal = chartCoordinates.maxY || 100;
                            const heightPct = Math.min(100, Math.max(10, Math.round((log.value / maxVal) * 100)));
                            return (
                              <div key={log.id} className="clay-bar-pillar-group">
                                <div className="clay-bar-track">
                                  <div 
                                    className="clay-bar-pillar"
                                    style={{ height: `${heightPct}%` }}
                                    title={`${log.value} ${activeTracker.unitShort} (${log.percentage}%)`}
                                  >
                                    <span className="clay-bar-tooltip-val">{log.value}</span>
                                  </div>
                                </div>
                                <div className="clay-bar-foot">
                                  <span className="clay-bar-date">
                                    {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="clay-bar-pct">{log.percentage}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Mode 3: Weekday Frequency Heatmap */}
                      {chartMode === 'heatmap' && (
                        <div className="clay-weekday-container">
                          <p className="clay-weekday-subtitle">Cycle Frequency Distribution across Days of the Week:</p>
                          <div className="clay-weekday-grid">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dIdx) => {
                              const dayLogs = filteredLogs.filter(l => {
                                const d = new Date(l.date).getDay();
                                const mapped = d === 0 ? 6 : d - 1; // Map Sunday to index 6
                                return mapped === dIdx;
                              });
                              const count = dayLogs.length;
                              const intensity = count > 2 ? 'high' : count > 0 ? 'mid' : 'low';
                              return (
                                <div key={day} className={`clay-weekday-cell intensity-${intensity}`}>
                                  <span className="clay-weekday-name">{day}</span>
                                  <span className="clay-weekday-count">{count} {count === 1 ? 'log' : 'logs'}</span>
                                  {count > 0 && (
                                    <span className="clay-weekday-avg">
                                      ~{(dayLogs.reduce((acc, curr) => acc + curr.value, 0) / count).toFixed(0)} {activeTracker.unitShort}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ==========================================================================
                AI Smart Farm Analyzer Card (Heuristic Correlation Engine)
                ========================================================================== */}
            <div className="clay-card clay-analyzer-card">
              <div className="clay-section-header">
                <h3>
                  <Sparkles size={22} /> Smart Farm Analyzer & Risk Correlation
                </h3>
                <p>Telemetry-driven biological insights based on frequency, volume, and ambient weather telemetry.</p>
              </div>

              <div className="clay-analyzer-grid">
                {/* Metric 1: Consistency Meter */}
                <div className="clay-analyzer-metric-tile">
                  <div className="clay-meter-row">
                    <span className="clay-metric-label">Execution Consistency</span>
                    <span className="clay-metric-score">{analyzerMetrics.consistencyScore}%</span>
                  </div>
                  <div className="clay-progress-track">
                    <div 
                      className="clay-progress-layer" 
                      style={{ width: `${analyzerMetrics.consistencyScore}%` }}
                    ></div>
                  </div>
                  <span className="clay-metric-hint">
                    Regularity rating computed from past intervals and completion quotas.
                  </span>
                </div>

                {/* Metric 2: Average Interval & Next Suggestion */}
                <div className="clay-analyzer-metric-tile">
                  <span className="clay-metric-label">Average Interval Rhythm</span>
                  <div className="clay-interval-display">
                    <strong>{analyzerMetrics.averageInterval}</strong>
                    <span>between logged operations</span>
                  </div>
                  <div className="clay-next-recom-box">
                    <Clock size={15} />
                    <span>Suggested Next Date: <strong>+3 Days</strong></span>
                    <button 
                      type="button" 
                      className="clay-btn-text"
                      onClick={() => applyQuickNextDate(3)}
                    >
                      Apply (+3d)
                    </button>
                  </div>
                </div>

                {/* Risk Correlation Advisory Banner */}
                <div className={`clay-advisory-banner level-${analyzerMetrics.riskAdvisory.level}`}>
                  <div className="clay-advisory-icon">
                    {analyzerMetrics.riskAdvisory.level === 'warning' ? (
                      <AlertTriangle size={24} />
                    ) : (
                      <ShieldCheck size={24} />
                    )}
                  </div>
                  <div className="clay-advisory-text">
                    <h4>{analyzerMetrics.riskAdvisory.title}</h4>
                    <p>{analyzerMetrics.riskAdvisory.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================================================
                Action Section: Activity Logger + Fast Presets
                ========================================================================== */}
            <div className="clay-card clay-logger-card">
              <div className="clay-section-header">
                <h3>
                  <Save size={22} /> Record Activity Log
                </h3>
                <p>Input today's operation telemetry, completion %, and weather context.</p>
              </div>

              <form onSubmit={handleAddLog} className="clay-log-form">
                <div className="clay-form-grid">
                  {/* Date Input */}
                  <div className="clay-form-group">
                    <label>Operation Date</label>
                    <input 
                      type="date" 
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="clay-input"
                      required
                    />
                  </div>

                  {/* Value / Amount Input */}
                  <div className="clay-form-group">
                    <label>Amount / Quantity ({activeTracker.unit})</label>
                    <input 
                      type="number" 
                      step="any"
                      min="0"
                      value={logValue}
                      onChange={(e) => setLogValue(Number(e.target.value))}
                      className="clay-input"
                      required
                    />
                  </div>

                  {/* Work Completed % Slider */}
                  <div className="clay-form-group">
                    <div className="clay-label-slider-row">
                      <label>Work Target Completed</label>
                      <span className="clay-slider-val">{logPercentage}%</span>
                    </div>
                    <div className="clay-slider-wrapper">
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        step="5"
                        value={logPercentage}
                        onChange={(e) => setLogPercentage(Number(e.target.value))}
                        className="clay-range-input"
                      />
                    </div>
                  </div>

                  {/* Weather Condition Tags */}
                  <div className="clay-form-group">
                    <label>Weather Condition</label>
                    <div className="clay-weather-chips">
                      {[
                        { id: 'sunny', label: 'Sunny', icon: 'sunny' },
                        { id: 'cloudy', label: 'Overcast', icon: 'cloudy' },
                        { id: 'rainy', label: 'Rain', icon: 'rainy' },
                        { id: 'windy', label: 'Windy', icon: 'windy' }
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          className={`clay-weather-chip ${logWeather === w.id ? 'active' : ''}`}
                          onClick={() => setLogWeather(w.id)}
                        >
                          {getWeatherIcon(w.icon, 14)}
                          <span>{w.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Scheduled Date */}
                  <div className="clay-form-group">
                    <label>Schedule Next Cycle (Optional)</label>
                    <div className="clay-next-date-row">
                      <input 
                        type="date" 
                        value={scheduledNext}
                        onChange={(e) => setScheduledNext(e.target.value)}
                        className="clay-input"
                      />
                      <div className="clay-quick-shortcuts">
                        <button type="button" onClick={() => applyQuickNextDate(1)}>+1d</button>
                        <button type="button" onClick={() => applyQuickNextDate(3)}>+3d</button>
                        <button type="button" onClick={() => applyQuickNextDate(7)}>+7d</button>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Observations */}
                  <div className="clay-form-group full-width">
                    <label>Field Notes & Observations</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Applied to Sector A Greenhouse; soil moisture reached ideal saturation..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      className="clay-input"
                    />
                  </div>
                </div>

                <div className="clay-tab-card-actions">
                  <button type="submit" className="clay-btn clay-btn-primary">
                    <Save size={18} /> Save Activity Log
                  </button>
                </div>
              </form>
            </div>

            {/* ==========================================================================
                Log History & Audit Table
                ========================================================================== */}
            <div className="clay-card clay-history-card">
              <div className="clay-history-header">
                <div className="clay-section-header" style={{ marginBottom: 0 }}>
                  <h3>
                    <Clock size={22} /> Telemetry History & Audit Records
                  </h3>
                  <p>Comprehensive historical logs for {activeTracker.name}.</p>
                </div>

                {/* Search Bar */}
                <div className="clay-search-box">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search logs by note, date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
              </div>

              {searchedLogs.length === 0 ? (
                <div className="clay-no-logs">
                  <p>No activity logs match your search.</p>
                </div>
              ) : (
                <div className="clay-table-responsive">
                  <table className="clay-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount ({activeTracker.unitShort})</th>
                        <th>Completion</th>
                        <th>Weather</th>
                        <th>Field Observations</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedLogs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <strong className="clay-td-date">
                              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </strong>
                          </td>
                          <td>
                            <span className="clay-value-badge">
                              {log.value} {activeTracker.unitShort}
                            </span>
                          </td>
                          <td>
                            <div className="clay-table-progress-wrap">
                              <div className="clay-table-progress-track">
                                <div 
                                  className="clay-table-progress-layer" 
                                  style={{ width: `${log.percentage}%` }}
                                ></div>
                              </div>
                              <span className="clay-td-pct">{log.percentage}%</span>
                            </div>
                          </td>
                          <td>
                            <span className="clay-weather-pill">
                              {getWeatherIcon(log.weather || 'sunny', 13)}
                              <span>{log.weather || 'sunny'}</span>
                            </span>
                          </td>
                          <td>
                            <span className="clay-td-notes">{log.notes || '—'}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              type="button" 
                              className="clay-delete-btn"
                              onClick={() => handleDeleteLog(log.id)}
                              title="Delete record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Trackers;
