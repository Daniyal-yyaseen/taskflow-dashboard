import { Component } from 'react';
import CardWrapper from '../functional/CardWrapper';
import Icon from '../functional/Icon';
import { readStored } from '../../hooks/useLocalStorage';

export default class ActivityLogger extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], toast: null, storageError: false };
    this.toastTimer = null;
  }
  componentDidMount() {
    const logs = readStored('taskflow-activity', [], value => Array.isArray(value) && value.every(log => typeof log.id === 'string' && typeof log.message === 'string' && typeof log.timestamp === 'string'));
    this.setState({ logs: logs.slice(0, 50) });
  }
  componentDidUpdate(previousProps, previousState) {
    if (this.props.event && this.props.event.id !== previousProps.event?.id) {
      const event = this.props.event;
      this.setState(state => ({ logs: [event, ...state.logs].slice(0, 50), toast: event.message }));
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.setState({ toast: null }), 3200);
    }
    if (previousState.logs !== this.state.logs) {
      try { localStorage.setItem('taskflow-activity', JSON.stringify(this.state.logs)); if (this.state.storageError) this.setState({ storageError: false }); }
      catch { if (!this.state.storageError) this.setState({ storageError: true }); }
    }
  }
  componentWillUnmount() { clearTimeout(this.toastTimer); }
  render() {
    const { logs, toast, storageError } = this.state;
    return <><CardWrapper className="activity-card"><div className="activity-heading"><div><h2>Recent activity</h2><p>The little steps add up.</p></div><span className="activity-icon"><Icon name="clock" size={20} /></span></div>{storageError && <p className="form-error">Activity could not be saved in this browser.</p>}<div className="activity-list">{logs.length ? logs.slice(0, 6).map(log => <div className="activity-entry" key={log.id}><span className={`activity-point ${log.type}`} /><div><p>{log.message}</p><time dateTime={log.timestamp}>{new Date(log.timestamp).toLocaleString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</time></div></div>) : <p className="activity-empty">Your activity will appear here as you add and organize tasks.</p>}</div><div className="activity-footer">{logs.length} recorded {logs.length === 1 ? 'activity' : 'activities'} · latest 50 kept</div></CardWrapper><div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast && <><Icon name="check" size={18} /><span>{toast}</span></>}</div></>;
  }
}
