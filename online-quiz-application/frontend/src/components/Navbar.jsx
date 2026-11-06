import React from 'react';

/**
 * Navbar - Stateless Component
 * Provides clean navigation between Quiz Dashboard and Quiz Creation Form
 */
const Navbar = ({ activeView, onNavigate }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => onNavigate('dashboard')}>
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            <h1>QuizMaster</h1>
            <span>MCA Micro Project &bull; MERN + GraphQL</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            type="button"
            className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            📋 Quizzes
          </button>
          <button
            type="button"
            className={`nav-btn ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => onNavigate('create')}
          >
            ➕ Create Quiz
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

