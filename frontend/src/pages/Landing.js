import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <div className="hero">
        <h1>📋 Welcome to TaskManager</h1>
        <p className="hero-subtitle">
          Collaborate, organize, and track your team's work in one place
        </p>
        
        <div className="hero-features">
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h3>Task Management</h3>
            <p>Create and assign tasks with priorities and due dates</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">👥</span>
            <h3>Team Collaboration</h3>
            <p>Work together with your team on projects</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Real-time Updates</h3>
            <p>See changes instantly with live collaboration</p>
          </div>
        </div>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-large btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-large btn-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-large btn-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
