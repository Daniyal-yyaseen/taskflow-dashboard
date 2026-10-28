import CardWrapper from './CardWrapper';
import Icon from './Icon';
export default function MetricsSummary({ tasks }) {
  const completed = tasks.filter(task => task.status === 'completed').length;
  const items = [
    { label: 'Total tasks', value: tasks.length, note: 'Everything in your workspace', icon: 'grid', tone: 'green' },
    { label: 'In progress', value: tasks.filter(task => task.status === 'in-progress').length, note: 'A little closer to done', icon: 'clock', tone: 'amber' },
    { label: 'Completed', value: completed, note: `${tasks.length ? Math.round(completed / tasks.length * 100) : 0}% of your tasks finished`, icon: 'check', tone: 'blue' },
    { label: 'High priority', value: tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length, note: 'Need your attention', icon: 'flag', tone: 'rose' },
  ];
  return <div className="metrics">{items.map(item => <CardWrapper className="metric" key={item.label}><div className="metric-top"><span>{item.label}</span><span className={`metric-icon ${item.tone}`}><Icon name={item.icon} /></span></div><strong className="metric-number">{item.value.toString().padStart(2, '0')}</strong><small>{item.note}</small></CardWrapper>)}</div>;
}
