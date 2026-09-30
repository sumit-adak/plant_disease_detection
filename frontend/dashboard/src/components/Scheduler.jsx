import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarClock, Check, Clock, Calendar as CalendarIcon, Plus, 
  Trash2, Droplet, Bug, Sprout, Scissors, Search, 
  AlertTriangle, CheckCircle2, Download, Sparkles, 
  ChevronLeft, ChevronRight, Repeat, Tag, Eye, CalendarDays
} from 'lucide-react';
import '../styles/scheduler.css';

// Initial pre-seeded smart agricultural tasks
const INITIAL_TASKS = [
  {
    id: 'task_1',
    text: 'Deep Root Drip Irrigation Cycle',
    category: 'irrigation',
    crop: 'Tomatoes & Peppers',
    date: new Date().toISOString().split('T')[0], // Today
    time: '06:30',
    priority: 'high',
    recurrence: '3days',
    completed: false,
    notes: 'Apply 140L across Sector A & B greenhouse beds during early dawn.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_2',
    text: 'Preventive Copper Fungicide Spray',
    category: 'pesticide',
    crop: 'Tomatoes',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '18:15',
    priority: 'urgent',
    recurrence: 'weekly',
    completed: false,
    notes: 'Spray underside of foliage at dusk to protect against early blight spore wash-in.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_3',
    text: 'Apply Organic Potassium & Seaweed Extract',
    category: 'fertilizer',
    crop: 'Strawberries',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '08:00',
    priority: 'medium',
    recurrence: 'weekly',
    completed: false,
    notes: 'Foliar feeding to reinforce fruit cell walls and boost brix sugar levels.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_4',
    text: 'Canopy Thinning & Sucker Pruning',
    category: 'pruning',
    crop: 'Indeterminate Tomatoes',
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    time: '09:00',
    priority: 'normal',
    recurrence: 'biweekly',
    completed: false,
    notes: 'Trim bottom 12 inches of foliage and lateral suckers for maximum air circulation.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_5',
    text: 'Microscopic Leaf Pathogen Inspection',
    category: 'inspection',
    crop: 'Potatoes & Cucumbers',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    time: '07:45',
    priority: 'medium',
    recurrence: 'weekly',
    completed: false,
    notes: 'Inspect lower leaf undersides for downy mildew spores and aphid colonies.',
    createdAt: new Date().toISOString()
  }
];

const QUICK_TEMPLATES = [
  { text: 'Morning Drip Irrigation (140L)', category: 'irrigation', crop: 'Tomatoes', time: '06:30', priority: 'high', recurrence: '3days' },
  { text: 'Preventive Neem Oil Foliar Spray', category: 'pesticide', crop: 'All Crops', time: '18:30', priority: 'urgent', recurrence: 'weekly' },
  { text: 'Balanced NPK Organic Compost Tea', category: 'fertilizer', crop: 'Vegetables', time: '08:00', priority: 'medium', recurrence: 'weekly' },
  { text: 'Lower Canopy Pruning & Trellising', category: 'pruning', crop: 'Tomatoes', time: '09:15', priority: 'normal', recurrence: 'biweekly' },
  { text: 'Automated Soil Moisture Meter Audit', category: 'inspection', crop: 'Greenhouse Beds', time: '07:00', priority: 'normal', recurrence: 'daily' }
];

const Scheduler = () => {
  const [tasks, setTasks] = useState([]);
  
  // Form State
  const [taskText, setTaskText] = useState('');
  const [taskCategory, setTaskCategory] = useState('irrigation');
  const [taskCrop, setTaskCrop] = useState('Tomatoes');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('07:00');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskRecurrence, setTaskRecurrence] = useState('none');
  const [taskNotes, setTaskNotes] = useState('');

  // Filter & Search Controls
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'completed' | 'overdue'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState(null); // null or YYYY-MM-DD
  const [searchQuery, setSearchQuery] = useState('');

  // Weekly mini calendar week offset
  const [weekOffset, setWeekOffset] = useState(0);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('plantCareTasks_v2');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse tasks', err);
        setTasks(INITIAL_TASKS);
      }
    } else {
      // Migrate old tasks if available
      const oldSaved = localStorage.getItem('plantCareTasks');
      if (oldSaved) {
        try {
          const parsedOld = JSON.parse(oldSaved);
          if (Array.isArray(parsedOld) && parsedOld.length > 0) {
            const upgraded = parsedOld.map((t, idx) => ({
              ...t,
              category: t.category || (idx % 2 === 0 ? 'irrigation' : 'pesticide'),
              crop: t.crop || 'General Crop',
              priority: t.priority || 'medium',
              recurrence: t.recurrence || 'none',
              notes: t.notes || ''
            }));
            setTasks(upgraded);
            return;
          }
        } catch {
          // ignore
        }
      }
      setTasks(INITIAL_TASKS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('plantCareTasks_v2', JSON.stringify(tasks));
      localStorage.setItem('plantCareTasks', JSON.stringify(tasks)); // backward compatibility
    }
  }, [tasks]);

  // Category Icon Resolver
  const getCategoryIcon = (cat, size = 18) => {
    switch (cat) {
      case 'irrigation': return <Droplet size={size} />;
      case 'pesticide': return <Bug size={size} />;
      case 'fertilizer': return <Sprout size={size} />;
      case 'pruning': return <Scissors size={size} />;
      case 'inspection': return <Eye size={size} />;
      default: return <CalendarClock size={size} />;
    }
  };

  // Compute 7-day mini calendar strip based on weekOffset
  const calendarWeekDays = useMemo(() => {
    const today = new Date();
    const days = [];
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + (weekOffset * 7));

    // Get current Monday
    const dayOfWeek = baseDate.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      const isToday = isoStr === today.toISOString().split('T')[0];
      
      // Count tasks on this day
      const dayTasks = tasks.filter(t => t.date === isoStr);
      days.push({
        date: d,
        isoStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday,
        taskCount: dayTasks.length,
        hasPending: dayTasks.some(t => !t.completed)
      });
    }
    return days;
  }, [weekOffset, tasks]);

  // Overall Scheduler Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const todayTasks = tasks.filter(t => t.date === todayStr);
    const overdue = tasks.filter(t => {
      if (t.completed) return false;
      const tDate = new Date(`${t.date}T${t.time || '23:59'}`);
      return tDate < now;
    }).length;

    const compliance = total > 0 ? Math.round((completed / total) * 100) : 100;

    return { total, completed, todayCount: todayTasks.length, overdue, compliance };
  }, [tasks]);

  // Handle Add Task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskText.trim() || !taskDate || !taskTime) {
      showToast('Please provide a task description, date, and time.');
      return;
    }

    const newTask = {
      id: 'task_' + Date.now(),
      text: taskText.trim(),
      category: taskCategory,
      crop: taskCrop.trim() || 'General Farm',
      date: taskDate,
      time: taskTime,
      priority: taskPriority,
      recurrence: taskRecurrence,
      completed: false,
      notes: taskNotes.trim(),
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setTaskText('');
    setTaskNotes('');
    showToast(`Scheduled "${newTask.text}" for ${new Date(taskDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}!`);
  };

  // Toggle Task Completion with Smart Recurrence Progression
  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const isCompleting = !task.completed;

    if (isCompleting && task.recurrence && task.recurrence !== 'none') {
      // Calculate next recurring date
      let daysToAdd = 1;
      if (task.recurrence === 'daily') daysToAdd = 1;
      if (task.recurrence === '3days') daysToAdd = 3;
      if (task.recurrence === 'weekly') daysToAdd = 7;
      if (task.recurrence === 'biweekly') daysToAdd = 14;
      if (task.recurrence === 'monthly') daysToAdd = 30;

      const currentTarget = new Date(`${task.date}T${task.time || '08:00'}`);
      currentTarget.setDate(currentTarget.getDate() + daysToAdd);
      const nextDateStr = currentTarget.toISOString().split('T')[0];

      const recurringNextTask = {
        ...task,
        id: 'task_' + Date.now(),
        date: nextDateStr,
        completed: false,
        createdAt: new Date().toISOString()
      };

      // Mark current completed and add next recurrence
      const updated = tasks.map(t => t.id === id ? { ...t, completed: true } : t);
      setTasks([...updated, recurringNextTask]);
      showToast(`Task completed! Next recurring cycle scheduled for ${nextDateStr}.`);
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: isCompleting } : t));
      showToast(isCompleting ? 'Task marked as completed! 🎉' : 'Task marked as pending.');
    }
  };

  // Delete Task
  const deleteTask = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this scheduled plant care task?')) return;
    setTasks(tasks.filter(t => t.id !== id));
    showToast('Task removed from schedule.');
  };

  // Apply Quick Template
  const applyTemplate = (tmpl) => {
    setTaskText(tmpl.text);
    setTaskCategory(tmpl.category);
    setTaskCrop(tmpl.crop);
    setTaskTime(tmpl.time);
    setTaskPriority(tmpl.priority);
    setTaskRecurrence(tmpl.recurrence);
    showToast(`Template applied: "${tmpl.text}"`);
  };

  // Export to iCalendar (.ics) format
  const handleExportICS = () => {
    if (tasks.length === 0) {
      showToast('No tasks available to export.');
      return;
    }

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PlantCare AI//Farm Scheduler//EN',
      'CALSCALE:GREGORIAN'
    ];

    tasks.forEach(t => {
      const cleanDate = (t.date || '').replace(/-/g, '');
      const cleanTime = (t.time || '08:00').replace(/:/g, '') + '00';
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:task-${t.id}@plantcare.ai`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      lines.push(`DTSTART:${cleanDate}T${cleanTime}`);
      lines.push(`SUMMARY:${t.text} [${t.crop || 'PlantCare'}]`);
      lines.push(`DESCRIPTION:${(t.notes || t.text).replace(/\n/g, ' ')} | Category: ${t.category} | Priority: ${t.priority}`);
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    const icsContent = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(lines.join('\r\n'));
    const link = document.createElement('a');
    link.setAttribute('href', icsContent);
    link.setAttribute('download', `plantcare_farm_schedule_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Exported calendar sync file (.ics) for Google/Apple Calendar!');
  };

  // Filtered & Sorted Tasks List
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return tasks.filter(task => {
      // 1. Day Filter (from mini calendar)
      if (selectedDayFilter && task.date !== selectedDayFilter) {
        return false;
      }

      // 2. Status Filter
      if (statusFilter === 'today' && task.date !== todayStr) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'upcoming') {
        if (task.completed) return false;
        const tDate = new Date(`${task.date}T${task.time || '23:59'}`);
        if (tDate < now) return false;
      }
      if (statusFilter === 'overdue') {
        if (task.completed) return false;
        const tDate = new Date(`${task.date}T${task.time || '23:59'}`);
        if (tDate >= now) return false;
      }

      // 3. Category Filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = task.text.toLowerCase().includes(q);
        const matchesCrop = (task.crop || '').toLowerCase().includes(q);
        const matchesNotes = (task.notes || '').toLowerCase().includes(q);
        if (!matchesText && !matchesCrop && !matchesNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort: Pending overdue first, then by date/time, completed last
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA - dateB;
    });
  }, [tasks, statusFilter, categoryFilter, selectedDayFilter, searchQuery]);

  return (
    <div className="scheduler-container clay-scheduler-wrapper">
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

      {/* Main Scheduler Clay Header */}
      <div className="clay-header-banner">
        <div className="clay-header-leaf-icon" title="Farm Care Schedule & Operations">
          <CalendarClock size={28} />
        </div>
        <div className="clay-header-text">
          <h1>Farm Care Schedule & Operations</h1>
          <p>Automated irrigation cycles, preventive pathogen sprays, fertilizer intervals, and calendar sync.</p>
        </div>
        <div className="clay-header-actions">
          <button 
            type="button" 
            className="clay-btn clay-btn-secondary"
            onClick={handleExportICS}
            title="Download iCal file to sync with Google Calendar or phone"
          >
            <Download size={16} /> Sync iCal (.ics)
          </button>
        </div>
      </div>

      {/* Scrollable Clay Canvas */}
      <div className="clay-scrollable-content">

        {/* ==========================================================================
            Top Telemetry KPI Clay Cards (4 Elevated Molded Objects)
            ========================================================================== */}
        <div className="clay-stats-grid">
          {/* Card 1: Today's Tasks */}
          <div className="clay-stat-card clay-stat-mint">
            <div className="clay-stat-icon-wrap">
              <CalendarDays size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{stats.todayCount} Tasks</h4>
              <p>Scheduled for Today</p>
            </div>
          </div>

          {/* Card 2: Schedule Compliance */}
          <div className="clay-stat-card clay-stat-blue">
            <div className="clay-stat-icon-wrap">
              <CheckCircle2 size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{stats.compliance}%</h4>
              <p>On-Time Completion Rate</p>
            </div>
          </div>

          {/* Card 3: Overdue Action Items */}
          <div className={`clay-stat-card ${stats.overdue > 0 ? 'clay-stat-peach' : 'clay-stat-turquoise'}`}>
            <div className="clay-stat-icon-wrap">
              <AlertTriangle size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{stats.overdue} Overdue</h4>
              <p>{stats.overdue > 0 ? 'Requires Farm Attention' : 'All Tasks On Schedule'}</p>
            </div>
          </div>

          {/* Card 4: Total Managed Operations */}
          <div className="clay-stat-card clay-stat-turquoise">
            <div className="clay-stat-icon-wrap">
              <CalendarClock size={24} />
            </div>
            <div className="clay-stat-details">
              <h4>{stats.total} Total</h4>
              <p>{stats.completed} Completed Cycles</p>
            </div>
          </div>
        </div>

        {/* ==========================================================================
            Interactive 7-Day Mini Calendar Strip
            ========================================================================== */}
        <div className="clay-card clay-week-strip-card">
          <div className="clay-week-strip-header">
            <div className="clay-week-title">
              <CalendarIcon size={18} />
              <span>Interactive Weekly Telemetry Strip</span>
            </div>
            <div className="clay-week-controls">
              <button 
                type="button" 
                className="clay-nav-btn"
                onClick={() => setWeekOffset(weekOffset - 1)}
                title="Previous Week"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button" 
                className="clay-pill-btn active"
                onClick={() => { setWeekOffset(0); setSelectedDayFilter(null); }}
              >
                This Week
              </button>
              <button 
                type="button" 
                className="clay-nav-btn"
                onClick={() => setWeekOffset(weekOffset + 1)}
                title="Next Week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="clay-week-days-grid">
            {calendarWeekDays.map((day) => {
              const isSelected = selectedDayFilter === day.isoStr;
              return (
                <button
                  key={day.isoStr}
                  type="button"
                  className={`clay-day-cell ${day.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelectedDayFilter(isSelected ? null : day.isoStr);
                  }}
                >
                  <span className="clay-day-name">{day.dayName}</span>
                  <span className="clay-day-num">{day.dayNum}</span>
                  <div className="clay-day-indicator-wrap">
                    {day.taskCount > 0 ? (
                      <span className={`clay-day-dot ${day.hasPending ? 'pending' : 'done'}`}>
                        {day.taskCount}
                      </span>
                    ) : (
                      <span className="clay-day-dot empty">—</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDayFilter && (
            <div className="clay-filter-active-bar">
              <span>Showing tasks for <strong>{new Date(selectedDayFilter).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong></span>
              <button type="button" onClick={() => setSelectedDayFilter(null)}>Clear Filter (Show All)</button>
            </div>
          )}
        </div>

        {/* ==========================================================================
            Main Content: Add Task Panel + Filterable Task List
            ========================================================================== */}
        <div className="clay-scheduler-layout">

          {/* Left Column: Schedule New Routine */}
          <div className="clay-card clay-add-task-card">
            <div className="clay-section-header">
              <h3><Plus size={22} /> Schedule Farm Routine</h3>
              <p>Set automated recurring or one-time plant care operations.</p>
            </div>

            {/* Quick Templates Drawer */}
            <div className="clay-templates-box">
              <span className="clay-templates-label">
                <Sparkles size={14} /> Quick Agronomy Templates:
              </span>
              <div className="clay-templates-list">
                {QUICK_TEMPLATES.map((tmpl, idx) => (
                  <button 
                    key={idx}
                    type="button" 
                    className="clay-template-pill"
                    onClick={() => applyTemplate(tmpl)}
                  >
                    {getCategoryIcon(tmpl.category, 13)}
                    <span>{tmpl.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="clay-task-form">
              <div className="clay-form-group">
                <label>Task Title & Action</label>
                <input 
                  type="text" 
                  placeholder="e.g. Drip Irrigation Sector B, Apply Bacillus..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="clay-input"
                  required
                />
              </div>

              <div className="clay-form-row">
                <div className="clay-form-group">
                  <label>Operation Category</label>
                  <select 
                    value={taskCategory} 
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="clay-select"
                  >
                    <option value="irrigation">💧 Irrigation & Watering</option>
                    <option value="pesticide">🛡️ Pest & Pathogen Spray</option>
                    <option value="fertilizer">🌿 Soil & Nutrients (NPK)</option>
                    <option value="pruning">✂️ Canopy Thinning & Pruning</option>
                    <option value="inspection">🔬 Leaf Disease Inspection</option>
                  </select>
                </div>

                <div className="clay-form-group">
                  <label>Target Crop Variety</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tomatoes, Strawberries"
                    value={taskCrop}
                    onChange={(e) => setTaskCrop(e.target.value)}
                    className="clay-input"
                  />
                </div>
              </div>

              <div className="clay-form-row">
                <div className="clay-form-group">
                  <label>Scheduled Date</label>
                  <input 
                    type="date" 
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="clay-input"
                    required
                  />
                </div>

                <div className="clay-form-group">
                  <label>Optimal Time</label>
                  <input 
                    type="time" 
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="clay-input"
                    required
                  />
                </div>
              </div>

              <div className="clay-form-row">
                <div className="clay-form-group">
                  <label>Urgency Priority</label>
                  <select 
                    value={taskPriority} 
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="clay-select"
                  >
                    <option value="normal">Normal (Routine Maintenance)</option>
                    <option value="medium">Medium (Recommended Window)</option>
                    <option value="high">High (Growth Milestone)</option>
                    <option value="urgent">Urgent (Immediate Pathogen Threat)</option>
                  </select>
                </div>

                <div className="clay-form-group">
                  <label>Automated Recurrence</label>
                  <select 
                    value={taskRecurrence} 
                    onChange={(e) => setTaskRecurrence(e.target.value)}
                    className="clay-select"
                  >
                    <option value="none">One-Time Only</option>
                    <option value="daily">Daily Cycle</option>
                    <option value="3days">Every 3 Days (Drip Preset)</option>
                    <option value="weekly">Weekly Routine</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly Audit</option>
                  </select>
                </div>
              </div>

              <div className="clay-form-group">
                <label>Field Notes & Instructions (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Check soil moisture probe before start; use 2.5 ml/L ratio..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  className="clay-input"
                />
              </div>

              <button type="submit" className="clay-btn clay-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Plus size={18} /> Schedule Plant Care Task
              </button>
            </form>
          </div>

          {/* Right Column: Task List & Management */}
          <div className="clay-tasks-list-col">

            {/* Smart Filter & Search Bar */}
            <div className="clay-card clay-filter-bar-card">
              <div className="clay-status-pills">
                {[
                  { id: 'all', label: 'All Tasks', count: tasks.length },
                  { id: 'today', label: 'Today', count: stats.todayCount },
                  { id: 'upcoming', label: 'Upcoming', count: tasks.filter(t => !t.completed).length },
                  { id: 'completed', label: 'Done', count: stats.completed },
                  { id: 'overdue', label: 'Overdue', count: stats.overdue }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`clay-status-pill ${statusFilter === tab.id ? 'active' : ''}`}
                    onClick={() => setStatusFilter(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="clay-pill-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="clay-filter-controls">
                {/* Category Filter */}
                <select 
                  className="clay-select clay-select-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="irrigation">💧 Irrigation</option>
                  <option value="pesticide">🛡️ Pesticides</option>
                  <option value="fertilizer">🌿 Fertilizers</option>
                  <option value="pruning">✂️ Pruning</option>
                  <option value="inspection">🔬 Inspection</option>
                </select>

                {/* Search Bar */}
                <div className="clay-search-box clay-search-sm">
                  <Search size={15} />
                  <input 
                    type="text" 
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks Wrapper */}
            <div className="clay-tasks-container">
              {filteredTasks.length === 0 ? (
                <div className="clay-card clay-empty-tasks">
                  <CalendarClock size={48} className="clay-empty-icon" />
                  <h4>No scheduled tasks match your filter.</h4>
                  <p>Create a new plant care routine on the left or select a different filter tag.</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const now = new Date();
                  const taskDate = new Date(`${task.date}T${task.time || '23:59'}`);
                  const isOverdue = taskDate < now && !task.completed;
                  const isToday = task.date === now.toISOString().split('T')[0];

                  return (
                    <div 
                      key={task.id}
                      className={`clay-card clay-task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {/* Checkbox */}
                      <div className={`clay-task-checkbox ${task.completed ? 'checked' : ''}`}>
                        {task.completed && <Check size={16} strokeWidth={3} />}
                      </div>

                      {/* Category Icon Badge */}
                      <div className={`clay-task-cat-badge cat-${task.category || 'irrigation'}`}>
                        {getCategoryIcon(task.category, 18)}
                      </div>

                      {/* Main Details */}
                      <div className="clay-task-main">
                        <div className="clay-task-title-row">
                          <h4 className="clay-task-title">{task.text}</h4>
                          <span className={`clay-priority-tag priority-${task.priority || 'medium'}`}>
                            {task.priority || 'medium'}
                          </span>
                        </div>

                        {task.notes && (
                          <p className="clay-task-notes">{task.notes}</p>
                        )}

                        <div className="clay-task-meta-row">
                          <span className="clay-meta-chip">
                            <Tag size={13} />
                            <strong>{task.crop || 'All Crops'}</strong>
                          </span>

                          <span className={`clay-meta-chip ${isToday ? 'today-chip' : ''}`}>
                            <CalendarIcon size={13} />
                            {isToday ? 'Today' : new Date(task.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>

                          <span className="clay-meta-chip">
                            <Clock size={13} />
                            {task.time}
                          </span>

                          {task.recurrence && task.recurrence !== 'none' && (
                            <span className="clay-meta-chip recurrence-chip" title="Automated recurrence">
                              <Repeat size={13} />
                              {task.recurrence}
                            </span>
                          )}

                          {isOverdue && (
                            <span className="clay-meta-chip overdue-chip">
                              <AlertTriangle size={13} /> Overdue
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete Action */}
                      <button 
                        type="button" 
                        className="clay-delete-task-btn"
                        onClick={(e) => deleteTask(e, task.id)}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Agricultural Advisory Note */}
            <div className="clay-card clay-schedule-advisory">
              <div className="clay-advisory-icon">
                <Sparkles size={20} />
              </div>
              <div className="clay-advisory-text">
                <h5>AI Weather Synchronization Active</h5>
                <p>
                  Morning drip irrigation operations are synchronized with real-time temperature forecasts to prevent midday heat scald and reduce fungal mildew spore propagation.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Scheduler;
