const typeDefs = `#graphql
  type Question {
    _id: ID
    questionText: String!
    options: [String!]!
    correctAnswer: Int
  }

  type Quiz {
    _id: ID!
    title: String!
    description: String!
    questions: [Question!]!
    questionCount: Int
    createdAt: String
  }

  type DetailedReview {
    questionText: String!
    options: [String!]!
    selectedOption: Int
    correctAnswer: Int!
    isCorrect: Boolean!
  }

  type QuizResult {
    _id: ID!
    quizId: ID!
    quizTitle: String!
    score: Int!
    totalQuestions: Int!
    correctAnswers: Int!
    incorrectAnswers: Int!
    percentage: Float!
    detailedResults: [DetailedReview!]!
    attemptedAt: String
  }

  input QuestionInput {
    questionText: String!
    options: [String!]!
    correctAnswer: Int!
  }

  input AnswerInput {
    questionIndex: Int!
    selectedOption: Int!
  }

  type Query {
    getQuizzes: [Quiz!]!
    getQuiz(id: ID!): Quiz
    getQuizResult(id: ID!): QuizResult
  }

  type Mutation {
    addQuiz(
      title: String!
      description: String!
      questions: [QuestionInput!]!
    ): Quiz!

    submitQuiz(
      quizId: ID!
      answers: [AnswerInput!]!
    ): QuizResult!
  }
`;

export default typeDefs;

