import { Component } from 'react';

const STORAGE_KEY = 'activity-logs';

class ActivityLogger extends Component {
  state = {
    logs: [],
    toast: null,
  };

  toastTimer = null;

  // 1) MOUNT: load saved logs + subscribe to a global event
  componentDidMount() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      this.setState({ logs: saved });
    } catch {
      this.setState({ logs: [] });
    }
    window.addEventListener('storage', this.handleStorageChange);
  }

  // 2) UPDATE: add new log from props, persist, show toast
  componentDidUpdate(prevProps, prevState) {
    const event = this.props.latestEvent;

    if (event && event !== prevProps.latestEvent) {
      this.setState((state) => ({
        logs: [event, ...state.logs].slice(0, 50),
        toast: event.message,
      }));
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.setState({ toast: null }), 2500);
    }

    if (prevState.logs !== this.state.logs) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.logs));
    }
  }

  // 3) UNMOUNT: cleanup timers and listeners
  componentWillUnmount() {
    clearTimeout(this.toastTimer);
    window.removeEventListener('storage', this.handleStorageChange);
  }

  // Sync logs if another browser tab changes them
  handleStorageChange = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      this.setState({ logs: JSON.parse(e.newValue) });
    }
  };

  clearLogs = () => {
    this.setState({ logs: [] });
  };

  render() {
    const { logs, toast } = this.state;

    return (
      <div>
        <div className="log-header">
          <span>{logs.length} entries</span>
          <button className="btn btn-danger" onClick={this.clearLogs}>
            Clear Logs
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="empty">No activity yet.</p>
        ) : (
          <ul className="log-list">
            {logs.map((log) => (
              <li key={log.id}>
                <small>{new Date(log.time).toLocaleTimeString()}</small> {log.message}
              </li>
            ))}
          </ul>
        )}

        {toast && <div className="toast">🔔 {toast}</div>}
      </div>
    );
  }
}

export default ActivityLogger;