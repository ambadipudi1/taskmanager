import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

function Dashboard({ setIsAuthenticated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('user');
      }
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tasksAPI.getAll();
      setTasks(response.data.tasks || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        handleLogout();
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else {
        setError('Failed to load tasks. Please try again.');
      }
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchTasks();
  };

  const handleAddTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      await fetchTasks();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create task';
      setError(errorMsg);
      console.error('Add task error:', err);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await tasksAPI.update(taskId, updates);
      await fetchTasks();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update task';
      setError(errorMsg);
      console.error('Update task error:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      await fetchTasks();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete task';
      setError(errorMsg);
      console.error('Delete task error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading your tasks...</div>;
  }

  return (
    <div className="dashboard">
      <div className="navbar">
        <div>
          <h2>Welcome, {user?.username || 'User'}! 👋</h2>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="error">
            {error}
            {error.includes('Failed to load') && (
              <button 
                className="btn-small btn-primary" 
                onClick={handleRetry}
                disabled={retrying}
                style={{ marginLeft: '10px' }}
              >
                {retrying ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        )}

        <TaskForm onAddTask={handleAddTask} />

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
          </div>
        ) : (
          <TaskList 
            tasks={tasks} 
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
