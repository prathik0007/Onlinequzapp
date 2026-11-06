import React from 'react';

/**
 * ResultPage - Component
 * Displays the evaluated quiz score, percentage, statistics,
 * and a full question-by-question answer review with correct answers.
 */
const ResultPage = ({ result, onBackToDashboard, onRetakeQuiz }) => {
  if (!result) {
    return (
      <div className="container">
        <div className="alert alert-error">No result data found.</div>
        <button type="button" className="btn btn-secondary" onClick={onBackToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const {
    quizTitle,
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    detailedResults = []
  } = result;

  // Feedback message based on percentage
  const getFeedbackMessage = (pct) => {
    if (pct >= 80) return '🎉 Outstanding performance! Excellent knowledge demonstrated.';
    if (pct >= 60) return '👍 Good job! You passed with a solid score.';
    if (pct >= 40) return '💡 Satisfactory attempt! Keep revising the core topics.';
    return '📚 Needs improvement. Please review the subject concepts and try again.';
  };

  return (
    <div className="container">
      <div className="result-card">
        <span className="quiz-badge">Quiz Result Summary</span>
        <h2 style={{ fontSize: '1.8rem', marginTop: '0.5rem', color: '#0f172a' }}>
          {quizTitle}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {getFeedbackMessage(percentage)}
        </p>

        {/* Circular Score Badge */}
        <div className="score-badge">
          <span className="score-number">{score}</span>
          <span className="score-total">out of {totalQuestions}</span>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{totalQuestions}</div>
            <div className="stat-label">Total Questions</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-green">{correctAnswers}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-red">{incorrectAnswers}</div>
            <div className="stat-label">Incorrect Answers</div>
          </div>
          <div className="stat-box">
            <div className="stat-value text-blue">{percentage}%</div>
            <div className="stat-label">Percentage</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          {onRetakeQuiz && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onRetakeQuiz(result.quizId)}
            >
              🔄 Retake Quiz
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBackToDashboard}
          >
            📋 Back to Dashboard
          </button>
        </div>
      </div>

      {/* Detailed Question Review Section */}
      <div className="review-section">
        <h3 className="review-title">Detailed Question Review</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Review each question along with your chosen answer and the verified correct answer.
        </p>

        {detailedResults.map((item, index) => {
          const isCorrect = item.isCorrect;
          const statusBadge = isCorrect ? '✅ Correct (+1)' : '❌ Incorrect (0)';

          return (
            <div
              key={index}
              className={`review-item ${isCorrect ? 'review-correct' : 'review-incorrect'}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Question {index + 1}
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: isCorrect ? 'var(--success)' : 'var(--danger)'
                  }}
                >
                  {statusBadge}
                </span>
              </div>

              <h4 className="review-question">{item.questionText}</h4>

              <div className="review-options">
                {item.options.map((opt, optIdx) => {
                  const isUserSelection = item.selectedOption === optIdx;
                  const isAnswer = item.correctAnswer === optIdx;

                  let optClass = 'review-opt';
                  let labelSuffix = '';

                  if (isAnswer) {
                    optClass += ' opt-correct';
                    labelSuffix = ' ✔ (Correct Answer)';
                  } else if (isUserSelection && !isAnswer) {
                    optClass += ' opt-wrong';
                    labelSuffix = ' ✘ (Your Selection)';
                  }

                  return (
                    <div key={optIdx} className={optClass}>
                      <span>
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      {labelSuffix && <span>{labelSuffix}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPage;

