import { useEffect, useRef, useState } from 'react';
import CardWrapper from './CardWrapper';
import Icon from './Icon';
export default function TaskForm({ onSave, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    setTitle(editingTask?.title || '');
    setDescription(editingTask?.description || '');
    setPriority(editingTask?.priority || 'medium');
    setDueDate(editingTask?.dueDate || '');
    setError('');
    inputRef.current?.focus();
  }, [editingTask]);
  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) { setError('Please enter a task title.'); inputRef.current.focus(); return; }
    onSave({ title: title.trim(), description: description.trim(), priority, dueDate });
    setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); setError('');
    inputRef.current.focus();
  }
  return <CardWrapper className="task-form-card"><div className="section-heading"><div className="heading-icon"><Icon name={editingTask ? 'edit' : 'plus'} /></div><div><h2>{editingTask ? 'Edit task' : 'Create a task'}</h2><p>{editingTask ? 'Make a few adjustments.' : 'Make room for your next idea.'}</p></div></div><form onSubmit={handleSubmit}>
    <label htmlFor="task-title">Task title <span className="required">*</span></label><input ref={inputRef} id="task-title" value={title} onChange={event => { setTitle(event.target.value); setError(''); }} maxLength={120} placeholder="What needs to get done?" aria-required="true" aria-invalid={!!error} aria-describedby={error ? 'title-error' : undefined} />
    {error && <p className="form-error" id="title-error" role="alert">{error}</p>}
    <label htmlFor="description">Description <span className="optional">optional</span></label><textarea id="description" value={description} onChange={event => setDescription(event.target.value)} maxLength={600} placeholder="Add a little more detail…" rows={3} />
    <div className="form-row"><div><label htmlFor="priority">Priority</label><select id="priority" value={priority} onChange={event => setPriority(event.target.value)}><option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option></select></div><div><label htmlFor="due-date">Due date</label><input type="date" id="due-date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></div></div>
    <button className="primary-button add-button" type="submit"><Icon name={editingTask ? 'check' : 'plus'} size={18} />{editingTask ? 'Save changes' : 'Add task'}</button>{editingTask && <button type="button" className="cancel-button" onClick={onCancel}>Cancel editing</button>}
    <p className="form-footnote">One task at a time. You’ve got this.</p>
  </form></CardWrapper>;
}
