import React from 'react';

function TaskCard({
  task,
  isEditing,
  editData,
  onEditClick,
  onSaveEdit,
  onCancel,
  onStatusChange,
  onDelete,
  onEditDataChange,
}) {
  if (isEditing) {
    return (
      <div className="task-card" style={{ background: '#f9f9f9' }}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => onEditDataChange({ ...editData, title: e.target.value })}
            style={{ marginBottom: '10px' }}
            maxLength="255"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={editData.description}
            onChange={(e) => onEditDataChange({ ...editData, description: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={editData.status}
            onChange={(e) => onEditDataChange({ ...editData, status: e.target.value })}
            style={{
              marginBottom: '10px',
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={editData.priority}
            onChange={(e) => onEditDataChange({ ...editData, priority: e.target.value })}
            style={{
              marginBottom: '10px',
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={editData.due_date || ''}
            onChange={(e) => onEditDataChange({ ...editData, due_date: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
        </div>

        <div className="task-actions">
          <button className="btn-small btn-edit" onClick={onSaveEdit}>
            Save
          </button>
          <button className="btn-small" style={{ background: '#999', color: 'white' }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    if (status === 'pending') return 'status-pending';
    if (status === 'in-progress') return 'status-in-progress';
    if (status === 'completed') return 'status-completed';
    return 'status-pending';
  };

  const getPriorityClass = (priority) => {
    if (priority === 'low') return 'priority-low';
    if (priority === 'high') return 'priority-high';
    return 'priority-medium';
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}

      <div className="task-meta">
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status?.replace('-', ' ').toUpperCase()}
        </span>
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority?.toUpperCase()}
        </span>
      </div>

      {task.due_date && (
        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          📅 Due: {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="task-actions" style={{ marginTop: '15px' }}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{
            padding: '6px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '12px',
            flex: 1,
          }}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn-small btn-edit" onClick={onEditClick}>
          Edit
        </button>
        <button
          className="btn-small btn-delete"
          onClick={() => {
            if (window.confirm('Delete this task?')) {
              onDelete(task.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
