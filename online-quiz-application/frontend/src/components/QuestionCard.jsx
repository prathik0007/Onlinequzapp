import React from 'react';

/**
 * QuestionCard - Stateless Component
 * Demonstrates:
 * - Props consumption from parent QuizAttempt
 * - onChange event handling for radio inputs
 * - onClick event handling for option selection containers
 */
const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption
}) => {
  if (!question) {
    return <div>No question data available.</div>;
  }

  return (
    <div className="question-card">
      <div className="question-number">
        Question {currentIndex + 1} of {totalQuestions}
      </div>

      <h3 className="question-text">{question.questionText}</h3>

      <div className="options-list">
        {question.options.map((option, optIdx) => {
          const isSelected = selectedOption === optIdx;

          return (
            <div
              key={optIdx}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              // onClick event handler to let students click anywhere on option card
              onClick={() => onSelectOption(currentIndex, optIdx)}
            >
              <input
                type="radio"
                id={`q${currentIndex}_opt${optIdx}`}
                name={`question_${currentIndex}`}
                className="option-radio"
                checked={isSelected}
                // onChange event handler on the radio input
                onChange={() => onSelectOption(currentIndex, optIdx)}
              />
              <label
                htmlFor={`q${currentIndex}_opt${optIdx}`}
                className="option-label"
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;

