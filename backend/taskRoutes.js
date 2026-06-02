import express from 'express';
import { authMiddleware } from './auth.js';
import { runAsync, getAsync, allAsync } from './database.js';

const router = express.Router();

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const userId = req.userId;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (title.length > 255) {
      return res.status(400).json({ error: 'Title cannot exceed 255 characters' });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const result = await runAsync(
      'INSERT INTO tasks (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [userId, title.trim(), description || '', priority || 'medium', due_date || null]
    );

    res.status(201).json({ 
      message: 'Task created',
      task: { id: result.id, title, description, priority, due_date, status: 'pending' }
    });
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await allAsync(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await getAsync(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, status, priority, due_date } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await getAsync(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    await runAsync(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title !== undefined ? title.trim() : task.title,
        description !== undefined ? description : task.description,
        status || task.status,
        priority || task.priority,
        due_date !== undefined ? due_date : task.due_date,
        id
      ]
    );

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Task update error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await getAsync(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await runAsync('DELETE FROM tasks WHERE id = ?', [id]);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
