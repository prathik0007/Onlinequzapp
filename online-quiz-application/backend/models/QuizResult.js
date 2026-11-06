import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  selectedOption: {
    type: Number, // 0, 1, 2, 3 or -1 if unselected
    default: -1
  }
}, { _id: false });

const detailedReviewSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  selectedOption: { type: Number, default: -1 },
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const quizResultSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  answers: [answerSchema],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  incorrectAnswers: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  detailedResults: [detailedReviewSchema],
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;

