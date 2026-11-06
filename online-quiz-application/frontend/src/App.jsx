import React, { useState } from 'react';
import Navbar from './components/Navbar';
import QuizDashboard from './pages/QuizDashboard';
import QuizForm from './pages/QuizForm';
import QuizAttempt from './pages/QuizAttempt';
import ResultPage from './pages/ResultPage';

/**
 * App - Main Root Application Component
 * Manages top-level navigation state between views:
 * - 'dashboard': displays quiz catalog
 * - 'attempt': interactive quiz taking session
 * - 'result': score breakdown and answer review
 * - 'create': form to create new quiz
 */
function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Navigation handlers
  const handleStartQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setActiveView('attempt');
  };

  const handleQuizSubmitted = (result) => {
    setQuizResult(result);
    setActiveView('result');
  };

  const handleBackToDashboard = () => {
    setSelectedQuizId(null);
    setQuizResult(null);
    setActiveView('dashboard');
  };

  const handleRetakeQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setQuizResult(null);
    setActiveView('attempt');
  };

  const handleQuizCreated = () => {
    setActiveView('dashboard');
  };

  return (
    <div className="app-root">
      {/* Sticky navigation header */}
      <Navbar
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'dashboard') {
            handleBackToDashboard();
          } else {
            setActiveView(view);
          }
        }}
      />

      {/* Main View Router */}
      <main>
        {activeView === 'dashboard' && (
          <QuizDashboard
            onStartQuiz={handleStartQuiz}
            onNavigateToCreate={() => setActiveView('create')}
          />
        )}

        {activeView === 'create' && (
          <QuizForm
            onQuizCreated={handleQuizCreated}
            onCancel={handleBackToDashboard}
          />
        )}

        {activeView === 'attempt' && (
          <QuizAttempt
            quizId={selectedQuizId}
            onQuizSubmitted={handleQuizSubmitted}
            onCancel={handleBackToDashboard}
          />
        )}

        {activeView === 'result' && (
          <ResultPage
            result={quizResult}
            onBackToDashboard={handleBackToDashboard}
            onRetakeQuiz={handleRetakeQuiz}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            <strong>Online Quiz Application</strong> &bull; MCA Individual Micro Project
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
            Built with React, Express, GraphQL, MongoDB &amp; Native Fetch API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

