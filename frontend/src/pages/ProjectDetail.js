import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const response = await projectService.getProject(id);
      setProject(response.data.project);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChange = (e) => {
    setTaskFormData({
      ...taskFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await taskService.createTask({
        ...taskFormData,
        project: id
      });
      setShowTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: ''
      });
      fetchProjectData(); // Refresh tasks
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchProjectData(); // Refresh tasks
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="project-detail">
      <div className="project-header">
        <div>
          <h1>{project.name}</h1>
          <p className="project-description">{project.description || 'No description'}</p>
          <div className="project-info">
            <span>👥 {project.members?.length} members</span>
            <span className={`status ${project.status}`}>{project.status}</span>
          </div>
        </div>
        <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
          + New Task
        </button>
      </div>

      <div className="tasks-board">
        <div className="task-column">
          <div className="column-header todo">
            <h3>To Do ({todoTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {todoTasks.map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description'}</p>
                <div className="task-footer">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                </div>
                <select 
                  value={task.status} 
                  onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
            {todoTasks.length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header in-progress">
            <h3>In Progress ({inProgressTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {inProgressTasks.map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description'}</p>
                <div className="task-footer">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                </div>
                <select 
                  value={task.status} 
                  onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
            {inProgressTasks.length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header done">
            <h3>Done ({doneTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {doneTasks.map(task => (
              <div key={task._id} className="task-card completed">
                <h4>{task.title}</h4>
                <p>{task.description || 'No description'}</p>
                <div className="task-footer">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  <span className="due-date">📅 {formatDate(task.dueDate)}</span>
                </div>
                <select 
                  value={task.status} 
                  onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
            {doneTasks.length === 0 && (
              <div className="empty-column">No tasks</div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="close-btn">×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskFormData.title}
                  onChange={handleTaskChange}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={taskFormData.description}
                  onChange={handleTaskChange}
                  rows="3"
                  placeholder="Enter task description (optional)"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={taskFormData.priority}
                    onChange={handleTaskChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleTaskChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
