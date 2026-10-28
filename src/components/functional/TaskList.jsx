import CardWrapper from './CardWrapper';
import TaskCard from './TaskCard';
import Icon from './Icon';
export default function TaskList({ tasks, total, status, priority, search, onFilter, onSearch, onStatusChange, onDelete, onEdit, onReset }) {
  const tabs = [['all', 'All tasks'], ['pending', 'To do'], ['in-progress', 'In progress'], ['completed', 'Completed']];
  return <CardWrapper className="task-list-card"><div className="list-heading"><div><h2>Your tasks <span className="count-badge">{total}</span></h2><p>A clear view of what’s next.</p></div><span className="small-label">{tasks.length} showing</span></div>
    <div className="filter-tabs" aria-label="Filter tasks by status">{tabs.map(([value, label]) => <button key={value} className={status === value ? 'active' : ''} aria-pressed={status === value} onClick={() => onFilter('status', value)}>{label}</button>)}</div>
    <div className="search-row"><div className="search-field"><Icon name="search" size={17} /><input aria-label="Search tasks" placeholder="Search your tasks…" value={search} onChange={event => onSearch(event.target.value)} /></div><select aria-label="Filter by priority" value={priority} onChange={event => onFilter('priority', event.target.value)}><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></div>
    <div className="task-items">{tasks.length ? tasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />) : <div className="empty-state"><span className="empty-icon"><Icon name="check" size={26} /></span><h3>{total ? 'No matching tasks' : 'A fresh start'}</h3><p>{total ? 'Try another search or change your filters.' : 'Add your first task using the form to get started.'}</p>{total > 0 && <button className="text-button" onClick={onReset}>Clear filters</button>}</div>}</div>
    <div className="list-footer"><span><span className="live-dot" /> Changes save automatically</span><span>Stored on this browser</span></div>
  </CardWrapper>;
}
