// Reusable GraphQL Service using Native JavaScript Fetch API
// Strictly satisfies Project Requirement 6 (No Apollo Client, No Axios)

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:5000/graphql';

/**
 * Core reusable function that sends GraphQL requests via native fetch()
 * @param {string} query - The GraphQL query or mutation string
 * @param {object} variables - Variables object passed to the operation
 * @returns {Promise<any>} - Resolves with data or rejects with error
 */
export const fetchGraphQL = async (query, variables = {}) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    // Check for GraphQL-level errors returned by resolvers
    if (json.errors && json.errors.length > 0) {
      const errorMsg = json.errors.map((err) => err.message).join(' | ');
      throw new Error(errorMsg);
    }

    return json.data;
  } catch (error) {
    console.error('[GraphQL Service Error]:', error.message);
    throw error;
  }
};

// -------------------------------------------------------------
// GraphQL Query Definitions
// -------------------------------------------------------------

export const GET_QUIZZES_QUERY = `
  query GetQuizzes {
    getQuizzes {
      _id
      title
      description
      questionCount
      createdAt
    }
  }
`;

export const GET_QUIZ_QUERY = `
  query GetQuiz($id: ID!) {
    getQuiz(id: $id) {
      _id
      title
      description
      questionCount
      questions {
        _id
        questionText
        options
      }
    }
  }
`;

export const GET_QUIZ_RESULT_QUERY = `
  query GetQuizResult($id: ID!) {
    getQuizResult(id: $id) {
      _id
      quizId
      quizTitle
      score
      totalQuestions
      correctAnswers
      incorrectAnswers
      percentage
      attemptedAt
      detailedResults {
        questionText
        options
        selectedOption
        correctAnswer
        isCorrect
      }
    }
  }
`;

// -------------------------------------------------------------
// GraphQL Mutation Definitions
// -------------------------------------------------------------

export const ADD_QUIZ_MUTATION = `
  mutation AddQuiz($title: String!, $description: String!, $questions: [QuestionInput!]!) {
    addQuiz(title: $title, description: $description, questions: $questions) {
      _id
      title
      description
      questionCount
      createdAt
    }
  }
`;

export const SUBMIT_QUIZ_MUTATION = `
  mutation SubmitQuiz($quizId: ID!, $answers: [AnswerInput!]!) {
    submitQuiz(quizId: $quizId, answers: $answers) {
      _id
      quizId
      quizTitle
      score
      totalQuestions
      correctAnswers
      incorrectAnswers
      percentage
      attemptedAt
      detailedResults {
        questionText
        options
        selectedOption
        correctAnswer
        isCorrect
      }
    }
  }
`;

// -------------------------------------------------------------
// Exported Convenience Service Functions
// -------------------------------------------------------------

export const getQuizzesAPI = async () => {
  const data = await fetchGraphQL(GET_QUIZZES_QUERY);
  return data.getQuizzes;
};

export const getQuizAPI = async (id) => {
  const data = await fetchGraphQL(GET_QUIZ_QUERY, { id });
  return data.getQuiz;
};

export const getQuizResultAPI = async (id) => {
  const data = await fetchGraphQL(GET_QUIZ_RESULT_QUERY, { id });
  return data.getQuizResult;
};

export const addQuizAPI = async (title, description, questions) => {
  const data = await fetchGraphQL(ADD_QUIZ_MUTATION, {
    title,
    description,
    questions
  });
  return data.addQuiz;
};

export const submitQuizAPI = async (quizId, answers) => {
  const data = await fetchGraphQL(SUBMIT_QUIZ_MUTATION, {
    quizId,
    answers
  });
  return data.submitQuiz;
};

