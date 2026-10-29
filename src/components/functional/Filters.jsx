function Filters({ status, priority, onStatusChange, onPriorityChange }) {
  return (
    <div className="filters">
      <label>
        Status:{' '}
        <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <label>
        Priority:{' '}
        <select value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>
    </div>
  );
}

export default Filters;