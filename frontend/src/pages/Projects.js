import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await projectService.createProject(formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project to get started!</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p className="project-description">
                {project.description || 'No description'}
              </p>
              <div className="project-footer">
                <div className="project-meta">
                  <span>👥 {project.members?.length} members</span>
                </div>
                <span className={`status ${project.status}`}>
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter project description (optional)"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
