# NITTE (DEEMED TO BE UNIVERSITY)
## NMAM INSTITUTE OF TECHNOLOGY, NITTE
### DEPARTMENT OF MASTER OF COMPUTER APPLICATIONS (MCA)

---

# PROJECT REPORT
### TASK 2: INDIVIDUAL MICRO PROJECT
**Course:** Master of Computer Applications (MCA)  
**Subject:** Full Stack Web Development using MERN  
**Topic:** React Components, Event Handling, and GraphQL API Integration  
**Academic Year:** 2026-2027  

---

## 1. PROJECT TITLE
**Online Quiz Application with React Components, Event Handling, and GraphQL API Integration**

---

## 2. ABSTRACT
The Online Quiz Application is a full-stack educational web application developed as an individual micro project for the MCA degree program. The project demonstrates the modern MERN stack architecture integrated with a GraphQL API layer and native Fetch API client communication. The frontend is built using React.js (via Vite) adhering to component-driven design with stateful and stateless components, prop drilling, and comprehensive React event handling (`onClick`, `onChange`, and `onSubmit`). The backend is powered by Node.js, Express.js, and Apollo Server, exposing strongly-typed GraphQL queries and mutations that interact with MongoDB using Mongoose. The system prevents client-side cheating by masking correct answers before submission and calculating scores, metrics, and percentages securely on the server.

---

## 3. INTRODUCTION
Modern web development increasingly favors decoupled client-server architectures that emphasize reusability, performance, and declarative data fetching. While RESTful APIs have long been the standard, GraphQL provides significant improvements by enabling clients to specify the exact shape and fields of data needed, minimizing over-fetching and network overhead.

This project implements an interactive online quiz assessment platform where students can browse available technical quizzes, attempt timed multiple-choice questions one at a time, navigate between questions, change previously selected choices, and submit their responses. The backend evaluates submissions, calculates marks and percentages, stores results in MongoDB, and presents a complete question-by-question review highlighting correct answers.

---

## 4. PROBLEM STATEMENT
Traditional online assessment micro projects often suffer from:
1. **Inefficient API Design:** Rigid REST endpoints that require multiple roundtrips to retrieve quizzes, questions, and submission results.
2. **Monolithic Component Structure:** Cramming entire applications into a single bloated React file rather than following modular stateful and stateless component design.
3. **Client-Side Vulnerabilities:** Exposing answer keys directly in the browser's JavaScript memory or network payloads, enabling students to inspect answers before submission.
4. **Heavy Library Dependencies:** Relying on heavyweight third-party libraries (such as Apollo Client or Axios) for simple HTTP operations when modern browsers feature native Fetch capabilities.

This project addresses these challenges by creating a modular, secure, and lightweight full-stack application strictly fulfilling all academic constraints.

---

## 5. OBJECTIVES
1. To design and implement modular React functional components separating stateful logic from stateless presentation.
2. To demonstrate React event handling using `onClick`, `onChange`, and `onSubmit`.
3. To define a GraphQL schema consisting of custom types, queries, and mutations.
4. To implement server-side resolver functions to query and persist data in MongoDB using Mongoose.
5. To execute all frontend-to-backend GraphQL communication using the native browser Fetch API without third-party API clients.
6. To enforce server-side evaluation of student quiz attempts to ensure assessment integrity.
7. To provide an intuitive, responsive, and distraction-free educational user interface.

---

## 6. TECHNOLOGIES USED

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React.js | 18.x | Component-based user interface development |
| **Build Tool** | Vite | 6.x | Fast frontend development server and bundling |
| **Language** | JavaScript (ES6+) | Modern | Core logic across frontend and backend |
| **Styling** | CSS3 | Custom | Clean, modern light educational styling |
| **Backend Runtime** | Node.js | 24.x | Server runtime environment |
| **Web Server** | Express.js | 4.x | HTTP server middleware hosting |
| **API Architecture** | GraphQL (`@apollo/server`) | 4.x / 16.x | Strongly-typed API schema and resolvers |
| **Database** | MongoDB | 8.x | Document-oriented NoSQL persistence |
| **Object Modeling** | Mongoose | 8.x | Schema modeling and database queries |
| **API Client** | Native Fetch API | Built-in | HTTP POST requests carrying GraphQL payloads |

---

## 7. SYSTEM ARCHITECTURE

```
+--------------------------------------------------------------------------+
|                            REACT FRONTEND (Vite)                         |
|                                                                          |
|   +-------------------+  props   +------------------------------------+  |
|   | Stateful Pages    | -------->| Stateless Components               |  |
|   | - QuizDashboard   |          | - QuizList, QuizCard               |  |
|   | - QuizAttempt     |          | - QuestionCard                     |  |
|   | - QuizForm        |          | - ConfirmationModal, ResultPage    |  |
|   +-------------------+          +------------------------------------+  |
+--------------------------------------------------------------------------+
                                    |
                Native Fetch API (POST /graphql)
                JSON: { query, variables }
                                    v
+--------------------------------------------------------------------------+
|                            EXPRESS BACKEND                               |
|                                                                          |
|   +-----------------------+           +------------------------------+   |
|   | GraphQL Schema        | --------> | GraphQL Resolvers            |   |
|   | Types, Query, Mutation|           | Queries: getQuizzes, getQuiz |   |
|   |                       |           | Mutation: addQuiz, submitQuiz|   |
|   +-----------------------+           +------------------------------+   |
+--------------------------------------------------------------------------+
                                    |
                             Mongoose ODM
                                    v
+--------------------------------------------------------------------------+
|                             MONGODB DATABASE                             |
|                                                                          |
|   +-------------------------------+   +------------------------------+   |
|   | "quizzes" Collection          |   | "quizresults" Collection     |   |
|   | Embedded questions & options  |   | Score, answers & breakdown   |   |
|   +-------------------------------+   +------------------------------+   |
+--------------------------------------------------------------------------+
```

---

## 8. REACT COMPONENT STRUCTURE

The frontend application follows a clean modular hierarchy:

- **`App.jsx`**: Root container managing top-level application state and screen navigation.
  - **`Navbar.jsx`**: Top navigation header displaying application branding and view tabs.
  - **`QuizDashboard.jsx`** (Page): Stateful catalog view displaying available quizzes.
    - **`QuizList.jsx`**: Stateless container iterating through quiz cards.
      - **`QuizCard.jsx`**: Stateless presentation card with quiz metadata and "Start Quiz" button.
  - **`QuizForm.jsx`** (Page): Stateful form for creating new quizzes and questions.
  - **`QuizAttempt.jsx`** (Page): Stateful quiz-taking session controlling progress and selection.
    - **`QuestionCard.jsx`**: Stateless card displaying current question and options.
    - **`ConfirmationModal.jsx`**: Stateless dialog prompt confirming submission.
  - **`ResultPage.jsx`** (Page): Summary report displaying final score, metrics, and answer key review.

---

## 9. STATEFUL AND STATELESS COMPONENTS

### A. Stateful Components
Stateful components own and mutate local state using the `useState` hook:

1. **`QuizDashboard` (`pages/QuizDashboard.jsx`)**:
   - Manages `quizzes` (array of available tests), `loading` indicator, and `error` status.
   - Triggers `useEffect` to fetch data from the GraphQL endpoint when the page mounts.
2. **`QuizAttempt` (`pages/QuizAttempt.jsx`)**:
   - Manages `currentIndex` (current active question index, displaying one at a time).
   - Manages `userAnswers` (dictionary mapping question indices to student selections).
   - Manages `showConfirmModal` and `submitting` boolean flags.
3. **`QuizForm` (`pages/QuizForm.jsx`)**:
   - Manages form inputs: `title`, `description`, dynamic array of `questions` (with text, 4 options, and correct answer index).
   - Manages validation errors and submission feedback.

### B. Stateless Components
Stateless (presentational) components receive all required data and event callbacks strictly via `props`:

1. **`QuizCard` (`components/QuizCard.jsx`)**:
   - Pure UI component receiving `{ quiz, onStartQuiz }` via props.
2. **`QuizList` (`components/QuizList.jsx`)**:
   - Renders the grid of `QuizCard` elements or an empty banner.
3. **`QuestionCard` (`components/QuestionCard.jsx`)**:
   - Pure UI component receiving `{ question, currentIndex, totalQuestions, selectedOption, onSelectOption }`.
4. **`ConfirmationModal` (`components/ConfirmationModal.jsx`)**:
   - Controlled modal displaying title, confirmation message, and action buttons.
5. **`ResultPage` (`pages/ResultPage.jsx`)**:
   - Displays evaluation metrics (`score`, `totalQuestions`, `percentage`, `detailedResults`) received from parent state.

---

## 10. PROPS IMPLEMENTATION

Props establish unidirectional data flow from parent to child components.

### Example 1: Passing Quiz Data from `QuizList` to `QuizCard`
```jsx
// QuizList.jsx (Parent)
<div className="quiz-grid">
  {quizzes.map((quiz) => (
    <QuizCard
      key={quiz._id}
      quiz={quiz}
      onStartQuiz={onStartQuiz}
    />
  ))}
</div>

// QuizCard.jsx (Child)
const QuizCard = ({ quiz, onStartQuiz }) => {
  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>
      <p>{quiz.description}</p>
      <button onClick={() => onStartQuiz(quiz._id)}>Start Quiz</button>
    </div>
  );
};
```

### Example 2: Passing Current Question and Callback to `QuestionCard`
```jsx
// QuizAttempt.jsx (Parent)
<QuestionCard
  question={currentQuestion}
  currentIndex={currentIndex}
  totalQuestions={totalQuestions}
  selectedOption={userAnswers[currentIndex]}
  onSelectOption={handleSelectOption}
/>
```

---

## 11. EVENT HANDLING (onClick, onChange, onSubmit)

The application strictly implements all three required React event handlers:

### A. `onClick` Event Handlers
1. **Start Quiz Button:**
   ```jsx
   <button type="button" className="btn btn-primary" onClick={() => onStartQuiz(quiz._id)}>
     Start Quiz →
   </button>
   ```
2. **Next & Previous Navigation:**
   ```jsx
   <button type="button" className="btn btn-secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
     ← Previous
   </button>
   <button type="button" className="btn btn-primary" onClick={handleNext}>
     Next →
   </button>
   ```
3. **Submit Quiz Button:**
   ```jsx
   <button type="button" className="btn btn-success" onClick={handleOpenSubmitModal}>
     ✓ Submit Quiz
   </button>
   ```
4. **Add / Remove Dynamic Questions in Form:**
   ```jsx
   <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
     ➕ Add Question
   </button>
   ```

### B. `onChange` Event Handlers
1. **Quiz Metadata Inputs:**
   ```jsx
   <input
     type="text"
     value={title}
     onChange={(e) => setTitle(e.target.value)}
     required
   />
   ```
2. **Option Text Inputs:**
   ```jsx
   <input
     type="text"
     value={opt}
     onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
     required
   />
   ```
3. **Radio Button Answer Selection in Quiz Attempt:**
   ```jsx
   <input
     type="radio"
     checked={selectedOption === optIdx}
     onChange={() => onSelectOption(currentIndex, optIdx)}
   />
   ```

### C. `onSubmit` Event Handler
Form submission in `QuizForm` prevents page reload and executes client-side validation:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents browser page reload
  if (!title.trim()) {
    setError('Quiz Title is required.');
    return;
  }
  await addQuizAPI(title, description, questions);
};

return <form onSubmit={handleSubmit}>...</form>;
```

---

## 12. GRAPHQL SCHEMA

Located at `backend/graphql/schema.js`:

```graphql
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
```

---

## 13. RESOLVER FUNCTIONS

Located at `backend/graphql/resolvers.js`:

### 1. `getQuizzes` (Query)
Retrieves all quizzes from MongoDB and masks `correctAnswer` to protect answer keys:
```javascript
getQuizzes: async () => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  return quizzes.map(quiz => ({
    _id: quiz._id.toString(),
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    questions: quiz.questions.map(q => ({
      _id: q._id?.toString(),
      questionText: q.questionText,
      options: q.options,
      correctAnswer: null // Masked before submission
    }))
  }));
}
```

### 2. `getQuiz(id)` (Query)
Retrieves single quiz and its questions for the student's test session:
```javascript
getQuiz: async (_, { id }) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new Error('Quiz not found');
  return {
    _id: quiz._id.toString(),
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    questions: quiz.questions.map(q => ({
      _id: q._id?.toString(),
      questionText: q.questionText,
      options: q.options,
      correctAnswer: null // Securely masked
    }))
  };
}
```

### 3. `submitQuiz(quizId, answers)` (Mutation)
Calculates score entirely on the server and persists result to MongoDB:
```javascript
submitQuiz: async (_, { quizId, answers }) => {
  const quiz = await Quiz.findById(quizId);
  const totalQuestions = quiz.questions.length;
  let correctAnswers = 0;
  const detailedResults = [];

  const answerMap = new Map();
  answers.forEach(a => answerMap.set(a.questionIndex, a.selectedOption));

  quiz.questions.forEach((q, idx) => {
    const selected = answerMap.has(idx) ? answerMap.get(idx) : -1;
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctAnswers++;

    detailedResults.push({
      questionText: q.questionText,
      options: q.options,
      selectedOption: selected,
      correctAnswer: q.correctAnswer,
      isCorrect
    });
  });

  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = correctAnswers;
  const percentage = parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2));

  const result = new QuizResult({
    quizId: quiz._id,
    quizTitle: quiz.title,
    answers,
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    detailedResults
  });

  return await result.save();
}
```

---

## 14. GRAPHQL QUERIES

### Query 1: Retrieve All Quizzes (`getQuizzes`)
```graphql
query GetQuizzes {
  getQuizzes {
    _id
    title
    description
    questionCount
    createdAt
  }
}
```

### Query 2: Retrieve Single Quiz by ID (`getQuiz`)
```graphql
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
```

### Query 3: Retrieve Quiz Result by ID (`getQuizResult`)
```graphql
query GetQuizResult($id: ID!) {
  getQuizResult(id: $id) {
    _id
    quizTitle
    score
    totalQuestions
    correctAnswers
    incorrectAnswers
    percentage
    detailedResults {
      questionText
      options
      selectedOption
      correctAnswer
      isCorrect
    }
  }
}
```

---

## 15. GRAPHQL MUTATIONS

### Mutation 1: Create New Quiz (`addQuiz`)
```graphql
mutation AddQuiz($title: String!, $description: String!, $questions: [QuestionInput!]!) {
  addQuiz(title: $title, description: $description, questions: $questions) {
    _id
    title
    description
    questionCount
  }
}
```

### Mutation 2: Submit Quiz Attempt (`submitQuiz`)
```graphql
mutation SubmitQuiz($quizId: ID!, $answers: [AnswerInput!]!) {
  submitQuiz(quizId: $quizId, answers: $answers) {
    _id
    score
    totalQuestions
    correctAnswers
    incorrectAnswers
    percentage
    detailedResults {
      questionText
      selectedOption
      correctAnswer
      isCorrect
    }
  }
}
```

---

## 16. FETCH API INTEGRATION

Implemented in `frontend/src/services/graphql.js` without Axios or Apollo Client:

```javascript
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

export const fetchGraphQL = async (query, variables = {}) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map(err => err.message).join(' | '));
  }

  return json.data;
};
```

---

## 17. DATABASE DESIGN

### A. Quiz Collection (`models/Quiz.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated primary key |
| `title` | String | Title of the quiz (e.g. Python Programming) |
| `description` | String | Overview of topics covered |
| `questions` | Array of Question Subdocs | Embedded list of MCQs |
| `questions.questionText` | String | Statement of question |
| `questions.options` | Array of 4 Strings | The four choices (A, B, C, D) |
| `questions.correctAnswer` | Number (0-3) | Index of the correct answer |
| `createdAt` | Date | Timestamp of quiz creation |

### B. QuizResult Collection (`models/QuizResult.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated primary key |
| `quizId` | ObjectId (Ref: Quiz) | Reference to attempted Quiz |
| `quizTitle` | String | Snapshot of quiz title |
| `score` | Number | Total marks obtained (1 mark per correct question) |
| `totalQuestions` | Number | Total number of questions in quiz |
| `correctAnswers` | Number | Count of correctly answered questions |
| `incorrectAnswers` | Number | Count of incorrectly answered questions |
| `percentage` | Number | Computed percentage score (0.00% - 100.00%) |
| `detailedResults` | Array of Review Subdocs | Full question review with selected & correct answers |
| `attemptedAt` | Date | Timestamp of submission |

---

## 18. SCREENSHOTS OF APPLICATION OUTPUT

> *Note: Place your actual application screenshots into the designated placeholders below.*

### Screenshot 1: Quiz Dashboard
*(Displays available quizzes: Python Programming, Database Management Systems, Web Development)*
```
+-----------------------------------------------------------------------+
|  [ PLACEHOLDER: SCREENSHOT OF QUIZ DASHBOARD (http://localhost:3000) ]|
|  Caption: Quiz catalog displaying 3 pre-seeded cards with metadata   |
+-----------------------------------------------------------------------+
```

### Screenshot 2: Create Quiz Form
*(Form with Quiz Title, Description, Question Statement, 4 options, and Correct Answer radio buttons)*
```
+-----------------------------------------------------------------------+
|  [ PLACEHOLDER: SCREENSHOT OF CREATE QUIZ FORM ]                      |
|  Caption: Interactive form demonstrating onChange and onSubmit        |
+-----------------------------------------------------------------------+
```

### Screenshot 3: Interactive Quiz Attempt
*(Displays one question at a time with radio button selection and Previous/Next buttons)*
```
+-----------------------------------------------------------------------+
|  [ PLACEHOLDER: SCREENSHOT OF QUIZ ATTEMPT INTERFACE ]                |
|  Caption: Student attempting question 1 of 5 with radio selection    |
+-----------------------------------------------------------------------+
```

### Screenshot 4: Submission Confirmation Dialog
*(Confirmation modal before submitting answers)*
```
+-----------------------------------------------------------------------+
|  [ PLACEHOLDER: SCREENSHOT OF CONFIRMATION MODAL ]                    |
|  Caption: Prompt asking student to confirm before grading             |
+-----------------------------------------------------------------------+
```

### Screenshot 5: Quiz Result & Answer Review
*(Displays marks obtained, percentage badge, correct/incorrect counters, and detailed answer review)*
```
+-----------------------------------------------------------------------+
|  [ PLACEHOLDER: SCREENSHOT OF QUIZ RESULT PAGE ]                      |
|  Caption: Score breakdown (80%) and detailed question-by-question key|
+-----------------------------------------------------------------------+
```

---

## 19. TESTING

The project underwent comprehensive end-to-end testing:

1. **Frontend Component Build Testing:** Executed `npm run build` using Vite. All 37 JSX modules compiled cleanly with zero errors or warnings.
2. **GraphQL Schema & Resolvers Verification:** An automated script (`backend/test-api.js`) tested:
   - Database connection and seeding of 3 sample quizzes.
   - Execution of `getQuizzes` query returning 3 items.
   - Execution of `getQuiz(id)` verifying questions are returned and `correctAnswer` is masked.
   - Execution of `submitQuiz` mutation verifying exact server-side scoring (e.g. 4/5 = 80%).
   - Verification of `QuizResult` persistence in MongoDB.
   - Creation of new quiz via `addQuiz` mutation and verifying quiz list length updates to 4.
3. **Event Handling Verification:**
   - `onClick`: Tested button navigation and modal opening.
   - `onChange`: Tested text typing and real-time state updates in forms and radio selections.
   - `onSubmit`: Tested validation for empty fields and successful submission.

---

## 20. CONCLUSION
The Online Quiz Application successfully meets all academic requirements specified for the MCA Task 2 Micro Project. The project demonstrates a well-engineered full-stack architecture that blends React component modularity, unidirectional prop data flow, and responsive event handling with the declarative power of GraphQL. By leveraging native browser Fetch capabilities instead of external libraries, the codebase remains lightweight, beginner-friendly, and simple to explain during college demonstration and viva voce examinations.

