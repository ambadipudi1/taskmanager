import React, { useState } from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });
  };

  const handleSaveEdit = async (taskId) => {
    await onUpdate(taskId, editData);
    setEditingId(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    onUpdate(taskId, { status: newStatus });
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          editData={editData}
          onEditClick={() => handleEditClick(task)}
          onSaveEdit={() => handleSaveEdit(task.id)}
          onCancel={() => setEditingId(null)}
          onStatusChange={handleStatusChange}
          onDelete={onDelete}
          onEditDataChange={setEditData}
        />
      ))}
    </div>
  );
}

export default TaskList;
