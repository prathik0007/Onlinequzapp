import React, { useState } from 'react';
import { addQuizAPI } from '../services/graphql';

/**
 * QuizForm - Stateful Component
 * Demonstrates:
 * - State management using useState for complex form state
 * - Event handling:
 *    * onChange for text inputs, textareas, and radio buttons
 *    * onClick for adding/removing question blocks
 *    * onSubmit for handling form submission to GraphQL mutation
 * - Comprehensive client-side validation
 */
const QuizForm = ({ onQuizCreated, onCancel }) => {
  // 1. Form state management using useState
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 2. Handlers for updating question state (demonstrating onChange)
  const handleQuestionTextChange = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  // 3. Handlers for dynamic question list (demonstrating onClick)
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length <= 1) {
      setError('A quiz must contain at least one question.');
      return;
    }
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated);
  };

  // 4. Form Submission handler (demonstrating onSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent standard browser page reload
    setError(null);
    setSuccess(null);

    // Form Validations
    if (!title.trim()) {
      setError('Quiz Title is required.');
      return;
    }

    if (!description.trim()) {
      setError('Quiz Description is required.');
      return;
    }

    if (questions.length === 0) {
      setError('Please add at least one question.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text cannot be empty.`);
        return;
      }

      for (let j = 0; j < 4; j++) {
        if (!q.options[j] || !q.options[j].trim()) {
          setError(`Option ${j + 1} in Question ${i + 1} cannot be empty.`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Execute GraphQL Mutation through native fetch API service
      const newQuiz = await addQuizAPI(title.trim(), description.trim(), questions);
      setSuccess(`Quiz "${newQuiz.title}" created successfully! Redirecting to dashboard...`);

      // Reset form
      setTitle('');
      setDescription('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);

      setTimeout(() => {
        onQuizCreated();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h2>Create New Quiz</h2>
          <p>Define quiz information and multiple-choice questions with correct answers.</p>
        </div>

        {/* Feedback messages */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* onSubmit Event Handler */}
        <form onSubmit={handleSubmit}>
          {/* Quiz Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="quizTitle">
              Quiz Title *
            </label>
            <input
              id="quizTitle"
              type="text"
              className="form-input"
              placeholder="e.g. Advanced Operating Systems"
              value={title}
              // onChange event handler
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Quiz Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="quizDesc">
              Quiz Description *
            </label>
            <textarea
              id="quizDesc"
              rows={3}
              className="form-textarea"
              placeholder="Brief overview of what topics this quiz evaluates..."
              value={description}
              // onChange event handler
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>
              Quiz Questions ({questions.length})
            </h3>
            {/* onClick event handler to add a new question */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddQuestion}
              disabled={loading}
            >
              ➕ Add Question
            </button>
          </div>

          {/* Dynamic list of Question Blocks */}
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="question-block">
              <div className="question-block-header">
                <h4>Question {qIdx + 1}</h4>
                {questions.length > 1 && (
                  // onClick event handler to remove question
                  <button
                    type="button"
                    className="btn-remove-q"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div className="form-group">
                <label className="form-label">Question Text *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter the question statement here..."
                  value={q.questionText}
                  // onChange event handler
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Four Multiple-Choice Options */}
              <div className="form-group">
                <label className="form-label">
                  Options (Select radio button for the Correct Answer) *
                </label>
                <div className="options-grid">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="option-input-wrapper">
                      {/* onChange event handler for radio button */}
                      <input
                        type="radio"
                        id={`q_${qIdx}_opt_${optIdx}`}
                        name={`correctAnswer_${qIdx}`}
                        checked={q.correctAnswer === optIdx}
                        onChange={() => handleCorrectAnswerChange(qIdx, optIdx)}
                        title="Mark as correct answer"
                        disabled={loading}
                      />
                      {/* onChange event handler for option text input */}
                      <input
                        type="text"
                        className="form-input"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving Quiz...' : '💾 Save Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;

