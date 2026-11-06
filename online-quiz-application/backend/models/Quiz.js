import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: (val) => Array.isArray(val) && val.length === 4,
      message: 'Each question must have exactly 4 options'
    },
    required: true
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: (val) => Array.isArray(val) && val.length > 0,
      message: 'A quiz must contain at least one question'
    },
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;

