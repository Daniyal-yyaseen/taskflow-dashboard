import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/functional/Header';
import Icon from './components/functional/Icon';
import ThemeToggle from './components/functional/ThemeToggle';
import MetricsSummary from './components/functional/MetricsSummary';
import TaskForm from './components/functional/TaskForm';
import TaskList from './components/functional/TaskList';
import ActivityLogger from './components/class/ActivityLogger';
import { useLocalStorage } from './hooks/useLocalStorage';

const sampleTasks = [
  { id: 'welcome-1', title: 'Plan the week ahead', description: 'Set your goals and break them into small, achievable steps.', priority: 'high', status: 'in-progress', dueDate: '' },
  { id: 'welcome-2', title: 'Review the dashboard components', description: 'Explore the task form, filters, and activity timeline.', priority: 'medium', status: 'pending', dueDate: '' },
  { id: 'welcome-3', title: 'Create your first workspace', description: 'A fresh space to focus on what matters.', priority: 'low', status: 'completed', dueDate: '' },
];
const isTaskArray = value => Array.isArray(value) && value.every(task => task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.description === 'string' && ['low', 'medium', 'high'].includes(task.priority) && ['pending', 'in-progress', 'completed'].includes(task.status) && typeof task.dueDate === 'string');
export default function App() {
  const [tasks, setTasks, storageError] = useLocalStorage('taskflow-tasks', sampleTasks, isTaskArray);
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [event, setEvent] = useState(null);
  const logActivity = useCallback((message, type = 'task') => setEvent({ id: crypto.randomUUID(), message, type, timestamp: new Date().toISOString() }), []);
  const pending = tasks.filter(task => task.status !== 'completed').length;
  useEffect(() => { document.title = `${pending} active tasks · Taskflow`; }, [pending]);
  const filteredTasks = useMemo(() => tasks.filter(task => (status === 'all' || task.status === status) && (priority === 'all' || task.priority === priority) && `${task.title} ${task.description}`.toLowerCase().includes(search.trim().toLowerCase())), [tasks, status, priority, search]);
  const saveTask = useCallback(data => {
    if (editingTask) {
      setTasks(current => current.map(task => task.id === editingTask.id ? { ...task, ...data } : task));
      logActivity(`Updated “${data.title}”`, 'edit'); setEditingTask(null);
    } else {
      setTasks(current => [{ ...data, id: crypto.randomUUID(), status: 'pending' }, ...current]);
      logActivity(`Added “${data.title}”`, 'add');
    }
  }, [editingTask, setTasks, logActivity]);
  const deleteTask = useCallback(id => {
    setTasks(current => current.filter(task => task.id !== id));
    setEditingTask(current => current?.id === id ? null : current);
    logActivity('Deleted a task', 'delete');
  }, [setTasks, logActivity]);
  const changeStatus = useCallback((id, nextStatus) => {
    setTasks(current => current.map(task => task.id === id ? { ...task, status: nextStatus } : task));
    logActivity(nextStatus === 'completed' ? 'Marked a task as completed' : `Changed task status to ${nextStatus === 'pending' ? 'to do' : 'in progress'}`, 'status');
  }, [setTasks, logActivity]);
  const changeFilter = useCallback((kind, value) => {
    if (kind === 'status') setStatus(value); else setPriority(value);
    logActivity(`Changed ${kind} filter to ${value.replace('-', ' ')}`, 'filter');
  }, [logActivity]);
  const resetFilters = useCallback(() => { setStatus('all'); setPriority('all'); setSearch(''); logActivity('Cleared task filters', 'filter'); }, [logActivity]);
  const editTask = useCallback(task => { setEditingTask(task); document.getElementById('task-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, []);
  const completed = tasks.length - pending;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  return <div className="app-shell"><aside className="sidebar"><a className="brand" href="#"><span className="brand-mark"><Icon name="check" size={23} /></span>taskflow<span className="brand-dot">.</span></a><div className="workspace-tag"><span className="workspace-icon">P</span><div><strong>Personal workspace</strong><small>Make things happen</small></div></div><div className="nav-label">WORKSPACE</div><nav><a className="nav-item selected" href="#"><Icon name="grid" /><span>Overview</span><span className="nav-indicator" /></a><a className="nav-item" href="#tasks"><Icon name="check" /><span>My tasks</span><span className="nav-count">{tasks.length}</span></a><a className="nav-item" href="#activity"><Icon name="clock" /><span>Activity log</span></a></nav><div className="sidebar-bottom"><div className="focus-note"><span className="plant">✳</span><h3>Small steps. Big progress.</h3><p>Focus on one thing.<br />Keep moving forward.</p></div><ThemeToggle onLog={logActivity} /><div className="sidebar-profile"><span className="avatar">ME</span><div><strong>My workspace</strong><small>Local & personal</small></div><span className="profile-dot" /></div></div></aside>
    <div className="main-shell"><Header /><main><div className="page-intro"><div><div className="eyebrow">A LITTLE FOCUS GOES A LONG WAY</div><h1>Let’s make things happen<span>.</span></h1><p>Your tasks, your pace. A little more organized, every day.</p></div><a className="primary-button new-task-button" href="#task-title" onClick={() => document.getElementById('task-title')?.focus()}><Icon name="plus" size={18} />New task</a></div>
    {storageError && <p className="storage-warning" role="alert">Browser storage is unavailable. Your changes will only last for this session.</p>}
    <MetricsSummary tasks={tasks} /><div className="dashboard-grid"><div className="tasks-column" id="tasks"><TaskList tasks={filteredTasks} total={tasks.length} status={status} priority={priority} search={search} onFilter={changeFilter} onSearch={setSearch} onStatusChange={changeStatus} onDelete={deleteTask} onEdit={editTask} onReset={resetFilters} /><section className="progress-card"><div className="progress-symbol"><Icon name="check" size={26} /></div><div className="progress-copy"><h3>{progress === 100 ? 'Everything is checked off. Well done!' : 'A little progress, every day.'}</h3><p>{completed} of {tasks.length} tasks complete. Keep your momentum going.</p></div><div className="progress-meter"><strong>{progress}%</strong><div className="progress-track" role="progressbar" aria-label="Task completion" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div></div></section></div><div className="right-column"><TaskForm onSave={saveTask} editingTask={editingTask} onCancel={() => setEditingTask(null)} /><div id="activity"><ActivityLogger event={event} /></div></div></div><footer className="page-footer"><span>Built for a more focused day.</span><span>Taskflow · Your personal task dashboard</span></footer></main></div></div>;
}
