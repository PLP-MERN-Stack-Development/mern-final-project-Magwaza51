import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    totalProjects: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects()
      ]);

      setTasks(tasksRes.data.tasks);
      setProjects(projectsRes.data.projects);

      // Calculate stats
      const todoCount = tasksRes.data.tasks.filter(t => t.status === 'todo').length;
      const inProgressCount = tasksRes.data.tasks.filter(t => t.status === 'in-progress').length;
      const completedCount = tasksRes.data.tasks.filter(t => t.status === 'done').length;

      setStats({
        totalTasks: tasksRes.data.tasks.length,
        todoTasks: todoCount,
        inProgressTasks: inProgressCount,
        completedTasks: completedCount,
        totalProjects: projectsRes.data.projects.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Here's what's happening with your projects and tasks</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/projects" className="btn btn-primary">View All</Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Create your first project!</p>
              <Link to="/projects" className="btn btn-primary">Create Project</Link>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.slice(0, 3).map(project => (
                <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
                  <h3>{project.name}</h3>
                  <p>{project.description || 'No description'}</p>
                  <div className="project-meta">
                    <span>👥 {project.members?.length} members</span>
                    <span className={`status ${project.status}`}>{project.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Your Tasks</h2>
          </div>
          
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.slice(0, 5).map(task => (
                <div key={task._id} className="task-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <p className="task-project">{task.project?.name}</p>
                  </div>
                  <div className="task-meta">
                    <span 
                      className="priority-badge" 
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span className={`status-badge ${task.status}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
