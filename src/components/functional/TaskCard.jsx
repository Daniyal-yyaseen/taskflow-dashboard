import { memo } from 'react';
import Icon from './Icon';
export const statusLabels = { pending: 'To do', 'in-progress': 'In progress', completed: 'Completed' };
function TaskCard({ task, onStatusChange, onDelete, onEdit }) {
  const date = task.dueDate ? new Date(`${task.dueDate}T00:00:00`) : null;
  const overdue = date && date < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== 'completed';
  return <article className={`task-item ${task.status === 'completed' ? 'is-complete' : ''}`}>
    <button className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'pending' : 'completed')} aria-label={`${task.status === 'completed' ? 'Reopen' : 'Complete'} ${task.title}`} aria-pressed={task.status === 'completed'}>{task.status === 'completed' && <Icon name="check" size={14} />}</button>
    <div className="task-content"><div className="task-title-row"><h3>{task.title}</h3><span className={`priority-badge ${task.priority}`}>{task.priority === 'high' && <span aria-hidden="true">↑ </span>}{task.priority}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta"><label className={`status-label ${task.status}`}><span className="status-dot" /><select aria-label={`Status of ${task.title}`} value={task.status} onChange={event => onStatusChange(task.id, event.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{date && <span className={`due-date ${overdue ? 'overdue' : ''}`}><Icon name="clock" size={13} />{overdue ? 'Overdue · ' : ''}{date.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}</div></div>
    <div className="task-actions"><button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><Icon name="edit" size={16} /></button><button className="icon-button delete-button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}><Icon name="trash" size={16} /></button></div>
  </article>;
}
export default memo(TaskCard);
