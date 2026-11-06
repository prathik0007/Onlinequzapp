import React from 'react';
import QuizCard from './QuizCard';

/**
 * QuizList - Stateless Component
 * Receives quizzes array and onStartQuiz function via props.
 * Renders a grid of QuizCard components or an empty-state message.
 */
const QuizList = ({ quizzes, onStartQuiz }) => {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="alert alert-info">
        No quizzes available right now. You can create a new quiz using the "Create Quiz" tab!
      </div>
    );
  }

  return (
    <div className="quiz-grid">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          onStartQuiz={onStartQuiz}
        />
      ))}
    </div>
  );
};

export default QuizList;

