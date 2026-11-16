# NITTE (DEEMED TO BE UNIVERSITY)
## NMAM INSTITUTE OF TECHNOLOGY, NITTE
### DEPARTMENT OF MASTER OF COMPUTER APPLICATIONS (MCA)

---

# COMPREHENSIVE PROJECT REPORT
## TASK 2: INDIVIDUAL MICRO PROJECT
**Course:** Master of Computer Applications (MCA)  
**Subject:** Full Stack Web Development using MERN  
**Topic:** React Components, Event Handling, and GraphQL API Integration  
**Total Marks:** 10 Marks  
**Submission Date:** 16/11/2026  

---

## 1. PROJECT TITLE
**QuizMaster – Online Quiz Application with React Components, Event Handling, and GraphQL API Integration**

---

## 2. ABSTRACT
The **QuizMaster – Online Quiz Application** is a complete, full-stack educational web application designed and developed to fulfill the requirements of the MCA Task 2 Micro Project. The project demonstrates the architecture of the **MERN** stack integrated with a strongly-typed **GraphQL API** layer and browser-native **Fetch API** communication. 

The frontend is constructed using React 18 (bundled with Vite) following strict modular component-driven development. It cleanly separates **Stateful Components** (`QuizDashboard`, `QuizForm`, `QuizAttempt`) that manage application lifecycle and user interaction from **Stateless Components** (`QuizCard`, `QuestionCard`, `QuizList`, `ConfirmationModal`, `ResultPage`) that receive data and callbacks via props. All three mandatory React event handlers—`onClick`, `onChange`, and `onSubmit`—are implemented with input validation and state synchronizations.

On the backend, Node.js and Express host an Apollo Server exposing a GraphQL schema with queries (`getQuizzes`, `getQuiz`, `getQuizResult`) and mutations (`addQuiz`, `submitQuiz`). All persistent data is modeled and managed in MongoDB using Mongoose ODM. To enforce academic assessment integrity, answer keys are masked on the server during test sessions, and evaluation (score, correct/incorrect counters, and percentage) is computed server-side in MongoDB.

---

## 3. INTRODUCTION
In contemporary web development, modern single-page applications (SPAs) demand high responsiveness, modularity, and declarative data retrieval. While traditional REST APIs expose fixed endpoints that often cause either over-fetching (retrieving unneeded fields) or under-fetching (requiring chained network requests), GraphQL provides an efficient alternative by allowing clients to request the exact shape and properties of data needed in a single round-trip.

This project implements an interactive online quiz assessment platform where students can:
1. Browse pre-seeded subject quizzes (*Python Programming*, *Database Management Systems*, *Web Development*) and custom quizzes.
2. Attempt questions sequentially (one question at a time) with radio button selections and navigation.
3. Review and revise choices before final submission with a confirmation dialog.
4. View an instant evaluated score breakdown with percentages and question-by-question review showing the correct answers.
5. Create custom technical quizzes via an interactive form that dynamically accepts questions and options, persisting them to MongoDB via GraphQL mutations.

---

## 4. PROBLEM STATEMENT
Conventional student micro projects frequently suffer from architectural and security shortcomings:
1. **Monolithic Component Structure:** Implementing the entire application in a single file, violating React's component reusability principles.
2. **Client-Side Security Flaws:** Shipping correct answers to the browser state or network tab during quiz attempts, allowing users to inspect answers before submission.
3. **Over-reliance on Heavy Libraries:** Using bulky third-party libraries (such as Apollo Client or Axios) for standard HTTP communication when modern browsers natively provide the Fetch API.
4. **Rigid REST Endpoints:** Needing separate endpoints for fetching quizzes, retrieving individual questions, submitting answers, and fetching results.

This project resolves these challenges by building a modular, secure, and lightweight application adhering strictly to the university's technical guidelines.

---

## 5. OBJECTIVES
- **Objective 1:** Implement modular React functional components separating stateful logic from stateless presentation.
- **Objective 2:** Demonstrate event-driven architecture utilizing `onClick`, `onChange`, and `onSubmit` handlers.
- **Objective 3:** Construct a strongly-typed GraphQL schema (`typeDefs`) with queries and mutations.
- **Objective 4:** Implement server-side resolver functions to perform CRUD operations on MongoDB using Mongoose ODM.
- **Objective 5:** Establish client-server communication using the native browser Fetch API without external API client libraries.
- **Objective 6:** Ensure academic security by calculating quiz marks on the server and masking answers before submission.
- **Objective 7:** Deliver a full-screen, responsive, and user-friendly educational UI.

---

## 6. TECHNOLOGIES USED

| Category | Technology | Version | Purpose in Project |
| :--- | :--- | :--- | :--- |
| **Frontend Library** | React.js | 18.3.1 | Functional component-based UI with hooks |
| **Build Tool** | Vite | 6.1.0 | Fast HMR development server and optimized bundler |
| **Language** | JavaScript (ES6+) | Modern ES | Asynchronous logic, promises, and modular code |
| **Styling** | CSS3 | Custom | Clean, modern responsive educational theme |
| **Backend Runtime** | Node.js | 24.x | Asynchronous JavaScript runtime environment |
| **Web Server Framework**| Express.js | 4.21.2 | HTTP server hosting and middleware pipeline |
| **API Architecture** | GraphQL (`@apollo/server`)| 4.11.3 | Strongly-typed API schema and resolver engine |
| **Database** | MongoDB | 8.x / Atlas | Scalable document-oriented NoSQL database |
| **Object Data Modeling** | Mongoose | 8.10.0 | Schema validation and MongoDB query abstraction |
| **API Communication** | Native Fetch API | Built-in | Native HTTP POST requests for GraphQL operations |

---

## 7. SYSTEM ARCHITECTURE

```mermaid
flowchart TD
    User["Student / User (Browser)"]
    
    subgraph Frontend["React 18 Frontend (Vite on Port 3000)"]
        UI["User Interface (SPA)"]
        State["React State (useState / useEffect)"]
        FetchService["Native Fetch API Client (services/graphql.js)"]
        UI <--> State
        State <--> FetchService
    end

    subgraph Backend["Express Backend (Node.js on Port 5000)"]
        ViteProxy["Vite Reverse Proxy (/graphql -> :5000)"]
        Apollo["Apollo GraphQL Server"]
        Schema["GraphQL Schema (TypeDefs)"]
        Resolvers["GraphQL Resolvers (Business & Scoring Logic)"]
        ViteProxy --> Apollo
        Apollo --> Schema
        Apollo --> Resolvers
    end

    subgraph Database["MongoDB Database (Port 27017 / Atlas)"]
        Mongoose["Mongoose ODM Models"]
        ColQuiz[("quizzes Collection")]
        ColResult[("quizresults Collection")]
        Resolvers <--> Mongoose
        Mongoose <--> ColQuiz
        Mongoose <--> ColResult
    end

    User <--> Frontend
    FetchService <-->|POST /graphql (JSON payload)| ViteProxy
```

---

## 8. REACT COMPONENT STRUCTURE & HIERARCHY

```text
App.jsx (Root Router & View Orchestrator)
│
├── Navbar.jsx (Stateless: Logo, Navigation links)
│
├── QuizDashboard.jsx (Stateful: Quizzes state, useEffect fetch, refresh)
│   └── QuizList.jsx (Stateless: Grid container)
│       └── QuizCard.jsx (Stateless: Title, description, question count, Start Quiz button)
│
├── QuizAttempt.jsx (Stateful: Current question index, answer selections, timer/progress)
│   ├── QuestionCard.jsx (Stateless: Question text, 4 radio options, active highlights)
│   └── ConfirmationModal.jsx (Stateless: Submission confirmation dialog)
│
├── QuizForm.jsx (Stateful: Form inputs, dynamic questions array, validation, onSubmit)
│
└── ResultPage.jsx (Stateless/Presentational: Score badge, metrics, question review)
```

---

## 9. STATEFUL AND STATELESS COMPONENTS

### A. Stateful Components
Stateful components declare and control mutable state using the `useState` hook and handle lifecycle side effects with `useEffect`.

#### 1. `QuizDashboard.jsx` (`frontend/src/pages/QuizDashboard.jsx`)
- **State Managed:**
  - `quizzes` (Array): List of quizzes loaded from the database.
  - `loading` (Boolean): Controls spinner during GraphQL query resolution.
  - `error` (String | null): Displays error alerts if network/server fails.
- **Lifecycle:** Invokes `useEffect(() => { loadQuizzes(); }, [])` on mount.

#### 2. `QuizAttempt.jsx` (`frontend/src/pages/QuizAttempt.jsx`)
- **State Managed:**
  - `quiz` (Object): Active quiz data retrieved via `getQuiz(id)` query.
  - `currentIndex` (Number): 0-based pointer displaying **one question at a time**.
  - `userAnswers` (Object): Map storing `{ [questionIndex]: selectedOptionIndex }`.
  - `submitting` (Boolean): Controls button disabled states during evaluation.
  - `showConfirmModal` (Boolean): Controls visibility of the confirmation popup.

#### 3. `QuizForm.jsx` (`frontend/src/pages/QuizForm.jsx`)
- **State Managed:**
  - `title` (String): Quiz title.
  - `description` (String): Quiz overview.
  - `questions` (Array): Dynamic list of question objects `[{ questionText, options: ['', '', '', ''], correctAnswer: 0 }]`.
  - `loading`, `error`, `success` (Status states).

---

### B. Stateless Components
Stateless components do not maintain independent state; they receive data and action callbacks exclusively through **`props`**.

#### 1. `QuizCard.jsx` (`frontend/src/components/QuizCard.jsx`)
- **Props Received:** `{ quiz, onStartQuiz }`
- **Responsibility:** Displays quiz card layout and triggers `onStartQuiz(quiz._id)` when clicked.

#### 2. `QuizList.jsx` (`frontend/src/components/QuizList.jsx`)
- **Props Received:** `{ quizzes, onStartQuiz }`
- **Responsibility:** Maps through the array and renders `QuizCard` elements or an empty state alert.

#### 3. `QuestionCard.jsx` (`frontend/src/components/QuestionCard.jsx`)
- **Props Received:** `{ question, currentIndex, totalQuestions, selectedOption, onSelectOption }`
- **Responsibility:** Renders the active question statement, 4 radio inputs with labels, and executes `onSelectOption(currentIndex, optIdx)`.

#### 4. `ConfirmationModal.jsx` (`frontend/src/components/ConfirmationModal.jsx`)
- **Props Received:** `{ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText }`
- **Responsibility:** Controlled modal preventing accidental submissions.

#### 5. `ResultPage.jsx` (`frontend/src/pages/ResultPage.jsx`)
- **Props Received:** `{ result, onBackToDashboard, onRetakeQuiz }`
- **Responsibility:** Renders the score badge, statistics grid (Total, Correct, Incorrect, Percentage), and detailed answer breakdown.

---

## 10. PROPS IMPLEMENTATION & DATA FLOW

React enforces **unidirectional top-down data flow**. The parent stateful component passes values down to children via attributes, and receives user interactions back up via callback functions passed as props.

### Code Demonstration: Passing Question Data and Callbacks
```jsx
// QuizAttempt.jsx (Stateful Parent)
<QuestionCard
  question={quiz.questions[currentIndex]}
  currentIndex={currentIndex}
  totalQuestions={quiz.questions.length}
  selectedOption={userAnswers[currentIndex]}
  onSelectOption={(qIdx, optIdx) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }}
/>

// QuestionCard.jsx (Stateless Child)
const QuestionCard = ({ question, currentIndex, totalQuestions, selectedOption, onSelectOption }) => {
  return (
    <div className="question-card">
      <div className="question-number">Question {currentIndex + 1} of {totalQuestions}</div>
      <h3 className="question-text">{question.questionText}</h3>
      <div className="options-list">
        {question.options.map((option, optIdx) => (
          <div
            key={optIdx}
            className={`option-item ${selectedOption === optIdx ? 'selected' : ''}`}
            onClick={() => onSelectOption(currentIndex, optIdx)}
          >
            <input
              type="radio"
              checked={selectedOption === optIdx}
              onChange={() => onSelectOption(currentIndex, optIdx)}
            />
            <label className="option-label">{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 11. EVENT HANDLING (onClick, onChange, onSubmit)

All three mandatory React event handlers are implemented across the application:

### A. `onClick` Event Handlers
1. **Start Quiz (`QuizCard.jsx`):**
   ```jsx
   <button type="button" className="btn btn-primary" onClick={() => onStartQuiz(quiz._id)}>
     Start Quiz &rarr;
   </button>
   ```
2. **Sequential Question Navigation (`QuizAttempt.jsx`):**
   ```jsx
   <button type="button" className="btn btn-secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
     &larr; Previous
   </button>
   <button type="button" className="btn btn-primary" onClick={handleNext}>
     Next &rarr;
   </button>
   ```
3. **Submit Quiz Confirmation (`QuizAttempt.jsx`):**
   ```jsx
   <button type="button" className="btn btn-success" onClick={handleOpenSubmitModal}>
     ✓ Submit Quiz
   </button>
   ```
4. **Dynamic Form Question Management (`QuizForm.jsx`):**
   ```jsx
   <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
     ➕ Add Question
   </button>
   <button type="button" className="btn-remove-q" onClick={() => handleRemoveQuestion(qIdx)}>
     Remove
   </button>
   ```

### B. `onChange` Event Handlers
1. **Text Inputs (`QuizForm.jsx`):**
   ```jsx
   <input
     type="text"
     value={title}
     onChange={(e) => setTitle(e.target.value)}
     required
   />
   ```
2. **Dynamic Question Options (`QuizForm.jsx`):**
   ```jsx
   <input
     type="text"
     value={opt}
     onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
     required
   />
   ```
3. **Radio Button Answer Selection (`QuestionCard.jsx`):**
   ```jsx
   <input
     type="radio"
     checked={selectedOption === optIdx}
     onChange={() => onSelectOption(currentIndex, optIdx)}
   />
   ```

### C. `onSubmit` Event Handler
Form submission in `QuizForm.jsx` intercepts the event, prevents default page reloading, executes comprehensive field validation, and triggers the `addQuiz` GraphQL mutation:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevents browser reload
  setError(null);
  
  if (!title.trim()) return setError('Quiz Title is required.');
  if (!description.trim()) return setError('Quiz Description is required.');
  
  setLoading(true);
  try {
    await addQuizAPI(title.trim(), description.trim(), questions);
    onQuizCreated();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
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

### 1. `getQuizzes` (Query Resolver)
Retrieves all quizzes from MongoDB, calculates question counts, and masks answers:
```javascript
getQuizzes: async () => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  return quizzes.map(quiz => ({
    _id: quiz._id.toString(),
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    createdAt: quiz.createdAt?.toISOString(),
    questions: quiz.questions.map(q => ({
      _id: q._id?.toString(),
      questionText: q.questionText,
      options: q.options,
      correctAnswer: null // Masked
    }))
  }));
}
```

### 2. `getQuiz(id)` (Query Resolver)
Retrieves a specific quiz for an active test session, securely setting `correctAnswer: null` to prevent client-side inspection:
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
      correctAnswer: null // Anti-cheating mask
    }))
  };
}
```

### 3. `submitQuiz(quizId, answers)` (Mutation Resolver)
Performs server-side grading, generates a question review, and persists the result document to MongoDB:
```javascript
submitQuiz: async (_, { quizId, answers }) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error('Quiz not found');

  const totalQuestions = quiz.questions.length;
  let correctAnswers = 0;
  const detailedResults = [];

  const answerMap = new Map();
  answers.forEach(a => answerMap.set(a.questionIndex, a.selectedOption));

  quiz.questions.forEach((question, index) => {
    const selected = answerMap.has(index) ? answerMap.get(index) : -1;
    const isCorrect = selected === question.correctAnswer;
    if (isCorrect) correctAnswers++;

    detailedResults.push({
      questionText: question.questionText,
      options: question.options,
      selectedOption: selected,
      correctAnswer: question.correctAnswer,
      isCorrect
    });
  });

  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = correctAnswers; // 1 mark per question
  const percentage = totalQuestions > 0 ? parseFloat(((correctAnswers / totalQuestions) * 100).toFixed(2)) : 0;

  const quizResult = new QuizResult({
    quizId: quiz._id,
    quizTitle: quiz.title,
    answers,
    score,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    detailedResults,
    attemptedAt: new Date()
  });

  return await quizResult.save();
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

### Query 2: Retrieve Quiz by ID for Student Session (`getQuiz`)
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

### Query 3: Retrieve Saved Result (`getQuizResult`)
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

### Mutation 1: Create a New Quiz (`addQuiz`)
```graphql
mutation AddQuiz($title: String!, $description: String!, $questions: [QuestionInput!]!) {
  addQuiz(title: $title, description: $description, questions: $questions) {
    _id
    title
    questionCount
    createdAt
  }
}
```

### Mutation 2: Submit Student Answers (`submitQuiz`)
```graphql
mutation SubmitQuiz($quizId: ID!, $answers: [AnswerInput!]!) {
  submitQuiz(quizId: $quizId, answers: $answers) {
    _id
    quizTitle
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

## 16. NATIVE FETCH API INTEGRATION

Implemented in `frontend/src/services/graphql.js` without Apollo Client or Axios:

```javascript
// Native Fetch API GraphQL Client (Requirement 6)
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URI || '/graphql';

export const fetchGraphQL = async (query, variables = {}) => {
  try {
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
      const errorMsg = json.errors.map(err => err.message).join(' | ');
      throw new Error(errorMsg);
    }

    return json.data;
  } catch (error) {
    console.error('[GraphQL Service Error]:', error.message);
    throw error;
  }
};
```

---

## 17. DATABASE DESIGN & MONGOOSE SCHEMAS

### A. Quiz Model (`backend/models/Quiz.js`)
Uses an **embedded document design** where question objects reside inside the quiz document for efficient single-query reads:
```javascript
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    validate: [val => val.length === 4, 'Must have exactly 4 options'],
    required: true
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  questions: { type: [questionSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### B. QuizResult Model (`backend/models/QuizResult.js`)
Stores submission history, performance metrics, and a historical review snapshot:
```javascript
const quizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  quizTitle: { type: String, required: true },
  answers: [{ questionIndex: Number, selectedOption: Number }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  percentage: { type: Number, required: true },
  detailedResults: [{
    questionText: String,
    options: [String],
    selectedOption: Number,
    correctAnswer: Number,
    isCorrect: Boolean
  }],
  attemptedAt: { type: Date, default: Date.now }
});
```

---

## 18. SCREENSHOTS OF APPLICATION OUTPUT

> *Note: Below are the official placeholders for application output screenshots.*

### Screenshot 1: Quiz Dashboard (`http://localhost:3000`)
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 1 ]                                     |
|                                       QUIZ DASHBOARD                                               |
|  - Full-screen header with QuizMaster logo on the left and Quizzes / Create Quiz navigation        |
|  - Responsive 3-column grid displaying Python, DBMS, and Web Development quiz cards                |
|  - Badges, descriptions, question counts, and "Start Quiz ->" action buttons                       |
+----------------------------------------------------------------------------------------------------+
```

### Screenshot 2: Interactive Quiz Attempt Page
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 2 ]                                     |
|                                     QUIZ ATTEMPT SESSION                                           |
|  - Header showing quiz title, answered ratio (e.g., 2 of 5), and question pill badge               |
|  - Full-width blue progress bar reflecting current progress                                        |
|  - Question card with statement and 4 radio button choices with hover / selection highlighting     |
|  - Previous, Next, and Submit Quiz action buttons                                                  |
+----------------------------------------------------------------------------------------------------+
```

### Screenshot 3: Quiz Submission Confirmation Modal
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 3 ]                                     |
|                                    CONFIRMATION MODAL                                              |
|  - Blurred background overlay with centered confirmation dialog                                    |
|  - Clear notification: "You have answered X of Y questions. Are you sure you want to submit?"      |
|  - "Cancel / Review Answers" and "Yes, Submit" buttons                                              |
+----------------------------------------------------------------------------------------------------+
```

### Screenshot 4: Evaluated Quiz Result & Detailed Review
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 4 ]                                     |
|                                         RESULT PAGE                                                |
|  - Circular score badge displaying marks obtained (e.g. 4 out of 5)                                |
|  - 4-column statistic grid (Total Questions, Correct, Incorrect, Percentage)                       |
|  - Question-by-question review highlighting student selection vs verified correct answer in green |
|  - "Retake Quiz" and "Back to Dashboard" buttons                                                   |
+----------------------------------------------------------------------------------------------------+
```

### Screenshot 5: Create Quiz Form
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 5 ]                                     |
|                                      CREATE QUIZ FORM                                              |
|  - Form inputs for Quiz Title and Description                                                      |
|  - Dynamic question blocks with statement input and 4 multiple-choice options                      |
|  - Radio buttons to designate the correct answer                                                   |
|  - "Add Question" button and "Save Quiz" mutation submit button                                    |
+----------------------------------------------------------------------------------------------------+
```

### Screenshot 6: Apollo Sandbox / GraphQL Playground (`http://localhost:3000/graphql`)
```
+----------------------------------------------------------------------------------------------------+
|                                  [ PLACEHOLDER: SCREENSHOT 6 ]                                     |
|                                   APOLLO GRAPHQL SANDBOX                                           |
|  - Embedded Apollo Sandbox interface running live on the /graphql endpoint                         |
|  - Execution of getQuizzes query showing real-time JSON response from MongoDB                      |
+----------------------------------------------------------------------------------------------------+
```

---

## 19. TESTING & VERIFICATION RESULTS

An automated verification test script (`backend/test-endpoint.js`) was executed to validate the entire full-stack architecture:

| Test Case | Description | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Database Connectivity | Connect to MongoDB Atlas / Local | Connected successfully to MongoDB host | **PASSED** |
| **TC-02** | Automatic Seeding | Populate 3 default quizzes (Python, DBMS, Web Dev) | 3 Quizzes verified in database collection | **PASSED** |
| **TC-03** | Embedded GraphQL IDE | `GET /graphql` with `Accept: text/html` | HTTP 200 OK returning embedded Apollo Sandbox | **PASSED** |
| **TC-04** | `getQuizzes` Query | Retrieve catalog of quizzes | Returned 3 quizzes with accurate question counts | **PASSED** |
| **TC-05** | Security Verification | Query `getQuiz(id)` during attempt | `correctAnswer` masked as `null` in payload | **PASSED** |
| **TC-06** | `submitQuiz` Scoring | Submit answer array for grading | Evaluated on backend: 2/2 = 100% | **PASSED** |
| **TC-07** | Persistence Test | Check `QuizResult` collection | Submission record stored with review snapshot | **PASSED** |
| **TC-08** | `addQuiz` Mutation | Create custom technical quiz | Stored in MongoDB; question count verified | **PASSED** |
| **TC-09** | Production Build | Vite build compilation check | 37 JSX modules transformed with 0 errors | **PASSED** |

---

## 20. CONCLUSION & FUTURE ENHANCEMENTS

### Conclusion
The **QuizMaster Online Quiz Application** fulfills all functional, architectural, and evaluation criteria specified by the Department of MCA for the Task 2 Micro Project. The project demonstrates:
- Clean functional React component engineering (Stateful vs. Stateless).
- Real-time React event handling (`onClick`, `onChange`, `onSubmit`).
- A production-grade GraphQL API with queries, mutations, and resolver logic.
- Pure Fetch API integration without third-party API dependencies.
- Secure server-side grading and persistent NoSQL document storage in MongoDB.

### Future Scope
1. **User Authentication:** Integrating JWT-based student profiles and authentication.
2. **Category Filters:** Enabling topic/tag filtering across technical domains.
3. **Timed Assessments:** Adding real-time countdown timers per question.
4. **Certificate Generation:** Automated PDF certificate generation upon scoring ≥ 80%.

---

## APPENDIX A: VIVA VOCE QUESTIONS & ANSWERS

**Q1: What is the primary difference between Stateful and Stateless components in your project?**  
*Answer:* Stateful components (`QuizDashboard`, `QuizAttempt`, `QuizForm`) use the `useState` hook to maintain and mutate private local state (like current question index and selected answers). Stateless components (`QuizCard`, `QuestionCard`, `QuizList`) hold no state; they receive data and action callbacks strictly via `props` and focus purely on presentation.

**Q2: Why use GraphQL instead of REST APIs?**  
*Answer:* REST endpoints often suffer from over-fetching or require multiple network calls. GraphQL allows the client to fetch exactly the data it requires in a single declarative POST request with a strongly-typed schema and strict contract validation.

**Q3: How do you connect React to GraphQL without Apollo Client or Axios?**  
*Answer:* Using the browser's native `fetch()` API in `frontend/src/services/graphql.js`. It sends an HTTP `POST` request to `/graphql` with `Content-Type: application/json` and a JSON body containing `{ query, variables }`.

**Q4: How did you ensure students cannot inspect the network tab to cheat?**  
*Answer:* In the `getQuiz` query resolver on the server, `correctAnswer` is explicitly masked and returned as `null`. Grading takes place strictly on the backend inside the `submitQuiz` mutation resolver.

---

## APPENDIX B: PROJECT SETUP & EXECUTION GUIDE

1. **Start the application (One-Click):**
   Double-click `run-app.bat` in the project root.
2. **Or start manually in two terminals:**
   - **Terminal 1 (Backend):**
     ```bash
     cd online-quiz-application/backend
     npm start
     ```
   - **Terminal 2 (Frontend):**
     ```bash
     cd online-quiz-application/frontend
     npm run dev
     ```
3. **Access URLs:**
   - **Web Application:** `http://localhost:3000`
   - **GraphQL Interactive IDE:** `http://localhost:3000/graphql` or `http://localhost:5000/graphql`
