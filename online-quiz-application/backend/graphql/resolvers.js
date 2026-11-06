import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';

const resolvers = {
  Query: {
    // 1. Retrieve all available quizzes
    getQuizzes: async () => {
      try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        return quizzes.map((quiz) => ({
          _id: quiz._id.toString(),
          title: quiz.title,
          description: quiz.description,
          questionCount: quiz.questions.length,
          createdAt: quiz.createdAt ? quiz.createdAt.toISOString() : null,
          // Mask correct answers when browsing quizzes
          questions: quiz.questions.map((q) => ({
            _id: q._id ? q._id.toString() : null,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: null // Hidden before submission
          }))
        }));
      } catch (error) {
        throw new Error(`Failed to fetch quizzes: ${error.message}`);
      }
    },

    // 2. Retrieve one quiz and its questions for taking the quiz
    getQuiz: async (_, { id }) => {
      try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
          throw new Error('Quiz not found');
        }

        return {
          _id: quiz._id.toString(),
          title: quiz.title,
          description: quiz.description,
          questionCount: quiz.questions.length,
          createdAt: quiz.createdAt ? quiz.createdAt.toISOString() : null,
          // Security: Do NOT expose correct answers to students during the attempt!
          questions: quiz.questions.map((q) => ({
            _id: q._id ? q._id.toString() : null,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: null // Securely hidden
          }))
        };
      } catch (error) {
        throw new Error(`Failed to fetch quiz: ${error.message}`);
      }
    },

    // 3. Retrieve a submitted quiz result by result ID
    getQuizResult: async (_, { id }) => {
      try {
        const result = await QuizResult.findById(id);
        if (!result) {
          throw new Error('Quiz result not found');
        }

        return {
          _id: result._id.toString(),
          quizId: result.quizId.toString(),
          quizTitle: result.quizTitle,
          score: result.score,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          incorrectAnswers: result.incorrectAnswers,
          percentage: result.percentage,
          detailedResults: result.detailedResults,
          attemptedAt: result.attemptedAt ? result.attemptedAt.toISOString() : null
        };
      } catch (error) {
        throw new Error(`Failed to fetch quiz result: ${error.message}`);
      }
    }
  },

  Mutation: {
    // 1. Save a new quiz with its questions
    addQuiz: async (_, { title, description, questions }) => {
      try {
        // Basic validations
        if (!title || !title.trim()) {
          throw new Error('Quiz title is required');
        }
        if (!description || !description.trim()) {
          throw new Error('Quiz description is required');
        }
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
          throw new Error('At least one question is required');
        }

        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.questionText || !q.questionText.trim()) {
            throw new Error(`Question ${i + 1} text is required`);
          }
          if (!q.options || q.options.length !== 4) {
            throw new Error(`Question ${i + 1} must have exactly 4 options`);
          }
          for (let optIdx = 0; optIdx < 4; optIdx++) {
            if (!q.options[optIdx] || !q.options[optIdx].trim()) {
              throw new Error(`Question ${i + 1}, Option ${optIdx + 1} cannot be empty`);
            }
          }
          if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
            throw new Error(`Question ${i + 1} must have a valid correct answer option (1-4)`);
          }
        }

        const newQuiz = new Quiz({
          title: title.trim(),
          description: description.trim(),
          questions: questions.map((q) => ({
            questionText: q.questionText.trim(),
            options: q.options.map((opt) => opt.trim()),
            correctAnswer: q.correctAnswer
          }))
        });

        const savedQuiz = await newQuiz.save();

        return {
          _id: savedQuiz._id.toString(),
          title: savedQuiz.title,
          description: savedQuiz.description,
          questionCount: savedQuiz.questions.length,
          createdAt: savedQuiz.createdAt.toISOString(),
          questions: savedQuiz.questions.map((q) => ({
            _id: q._id.toString(),
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        };
      } catch (error) {
        throw new Error(`Failed to create quiz: ${error.message}`);
      }
    },

    // 2. Submit student answers, calculate score on backend, save result to MongoDB
    submitQuiz: async (_, { quizId, answers }) => {
      try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
          throw new Error('Quiz not found');
        }

        const totalQuestions = quiz.questions.length;
        let correctAnswers = 0;
        const detailedResults = [];

        // Build a lookup map of submitted answers: questionIndex -> selectedOption
        const answerMap = new Map();
        if (Array.isArray(answers)) {
          answers.forEach((ans) => {
            answerMap.set(ans.questionIndex, ans.selectedOption);
          });
        }

        quiz.questions.forEach((question, index) => {
          const selectedOption = answerMap.has(index) ? answerMap.get(index) : -1;
          const isCorrect = selectedOption === question.correctAnswer;

          if (isCorrect) {
            correctAnswers++;
          }

          detailedResults.push({
            questionText: question.questionText,
            options: question.options,
            selectedOption,
            correctAnswer: question.correctAnswer,
            isCorrect
          });
        });

        const incorrectAnswers = totalQuestions - correctAnswers;
        const score = correctAnswers; // 1 mark per question
        const percentage = totalQuestions > 0
          ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2))
          : 0;

        const quizResult = new QuizResult({
          quizId: quiz._id,
          quizTitle: quiz.title,
          answers: answers || [],
          score,
          totalQuestions,
          correctAnswers,
          incorrectAnswers,
          percentage,
          detailedResults,
          attemptedAt: new Date()
        });

        const savedResult = await quizResult.save();

        return {
          _id: savedResult._id.toString(),
          quizId: savedResult.quizId.toString(),
          quizTitle: savedResult.quizTitle,
          score: savedResult.score,
          totalQuestions: savedResult.totalQuestions,
          correctAnswers: savedResult.correctAnswers,
          incorrectAnswers: savedResult.incorrectAnswers,
          percentage: savedResult.percentage,
          detailedResults: savedResult.detailedResults,
          attemptedAt: savedResult.attemptedAt.toISOString()
        };
      } catch (error) {
        throw new Error(`Failed to submit quiz: ${error.message}`);
      }
    }
  }
};

export default resolvers;

