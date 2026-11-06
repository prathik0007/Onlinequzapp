import React, { useState, useEffect } from 'react';
import QuizList from '../components/QuizList';
import { getQuizzesAPI } from '../services/graphql';

/**
 * QuizDashboard - Stateful Component
 * Demonstrates:
 * - useState hook for managing application data (quizzes, loading, error)
 * - useEffect hook to fetch quiz data from GraphQL API on initial load
 * - Passing data and callbacks to stateless QuizList component via props
 */
const QuizDashboard = ({ onStartQuiz, onNavigateToCreate }) => {
  // 1. State Management (useState)
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Lifecycle Effect (useEffect) to fetch quizzes on load
  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuizzesAPI();
      setQuizzes(data);
    } catch (err) {
      setError(err.message || 'Failed to load quizzes. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return (
    <div className="container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Available Quizzes</h2>
          <p>Select a subject below to test your technical concepts.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {/* onClick event handler to manually refresh */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={loadQuizzes}
            disabled={loading}
          >
            🔄 Refresh
          </button>
          {/* onClick event handler to navigate */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToCreate}
          >
            ➕ New Quiz
          </button>
        </div>
      </div>

      {/* Error state display */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️ {error}</span>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
            onClick={loadQuizzes}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state display */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching quizzes from GraphQL backend...</p>
        </div>
      ) : (
        /* Passing data to stateless child component via props */
        <QuizList quizzes={quizzes} onStartQuiz={onStartQuiz} />
      )}
    </div>
  );
};

export default QuizDashboard;

