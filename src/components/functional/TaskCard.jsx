import { memo } from 'react';

function TaskCard({ task, onToggle, onDelete }) {
  return (
    <li className={`task-card ${task.completed ? 'done' : ''}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, task.title)}
        />
        <span className="task-title">{task.title}</span>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        {task.priority === 'high' && !task.completed && (
          <span className="urgent">🔥 Urgent</span>
        )}
      </div>
      <div className="task-meta">
        <small>
          {task.completed ? '✅ Completed' : '⏳ Pending'} ·{' '}
          {new Date(task.createdAt).toLocaleDateString()}
        </small>
        <button className="btn btn-danger" onClick={() => onDelete(task.id, task.title)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default memo(TaskCard);