import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import ConfirmationModal from '../components/ConfirmationModal';
import { getQuizAPI, submitQuizAPI } from '../services/graphql';

/**
 * QuizAttempt - Stateful Component
 * Demonstrates:
 * - useState for managing current question index, user answers map, and submission state
 * - useEffect to load quiz data securely without exposing answers
 * - Passing data & event callbacks to stateless QuestionCard via props
 * - Event handling:
 *    * onClick: Next, Previous, Submit, Modal confirmation
 *    * onChange: Selecting and changing options
 */
const QuizAttempt = ({ quizId, onQuizSubmitted, onCancel }) => {
  // 1. State Management
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // userAnswers maps questionIndex -> selectedOptionIndex (e.g. { 0: 2, 1: 0 })
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 2. Fetch Quiz Details on mount (useEffect)
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getQuizAPI(quizId);
        setQuiz(data);
      } catch (err) {
        setError(err.message || 'Failed to load quiz details.');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // 3. Option Selection Handler (passed to QuestionCard)
  const handleSelectOption = (qIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex
    }));
  };

  // 4. Navigation Handlers (demonstrating onClick)
  const handleNext = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 5. Submit Quiz Handler (opens confirmation modal)
  const handleOpenSubmitModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError(null);

    try {
      // Prepare answer array for GraphQL mutation: [{ questionIndex, selectedOption }]
      const formattedAnswers = quiz.questions.map((_, idx) => ({
        questionIndex: idx,
        selectedOption: userAnswers[idx] !== undefined ? userAnswers[idx] : -1
      }));

      // Call GraphQL mutation via native fetch API
      const result = await submitQuizAPI(quizId, formattedAnswers);

      // Pass result to parent component to navigate to ResultPage
      onQuizSubmitted(result);
    } catch (err) {
      setError(err.message || 'Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading quiz questions securely...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !quiz) {
    return (
      <div className="container">
        <div className="alert alert-error">⚠️ {error}</div>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="container">
        <div className="alert alert-info">No questions found in this quiz.</div>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="container">
      <div className="attempt-container">
        {/* Attempt Header */}
        <div className="attempt-header">
          <div>
            <h3>{quiz.title}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Answered: {answeredCount} of {totalQuestions}
            </span>
          </div>
          <div className="progress-pill">
            Question {currentIndex + 1} / {totalQuestions}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <br />

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {/* QuestionCard - Stateless Component rendered with props */}
        <QuestionCard
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          selectedOption={userAnswers[currentIndex]}
          onSelectOption={handleSelectOption}
        />

        {/* Action Buttons with onClick Handlers */}
        <div className="attempt-actions">
          {/* Previous Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || submitting}
          >
            &larr; Previous
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {/* Next Button */}
            {!isLastQuestion && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={submitting}
              >
                Next &rarr;
              </button>
            )}

            {/* Submit Quiz Button */}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleOpenSubmitModal}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : '✓ Submit Quiz'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Final Submission */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Submit Quiz Confirmation"
        message={`You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finish and submit?`}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirmModal(false)}
        confirmText="Yes, Submit"
        cancelText="Review Answers"
      />
    </div>
  );
};

export default QuizAttempt;

