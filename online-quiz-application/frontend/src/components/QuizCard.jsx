import React from 'react';

/**
 * QuizCard - Stateless Component
 * Demonstrates props usage and onClick event handling.
 * Displays individual quiz metadata and action button.
 */
const QuizCard = ({ quiz, onStartQuiz }) => {
  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <span className="quiz-badge">Online Quiz</span>
        <h3 className="quiz-card-title">{quiz.title}</h3>
        <p className="quiz-card-desc">{quiz.description}</p>
      </div>

      <div className="quiz-card-footer">
        <span className="quiz-meta">
          📝 {quiz.questionCount || quiz.questions?.length || 0} Questions
        </span>

        {/* onClick event handler triggering parent callback */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onStartQuiz(quiz._id)}
        >
          Start Quiz &rarr;
        </button>
      </div>
    </div>
  );
};

export default QuizCard;

