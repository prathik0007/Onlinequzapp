# 🎓 Online Quiz Application (MCA Individual Micro Project)

A complete, beginner-friendly, and fully functional **Online Quiz Application** built for the **Master of Computer Applications (MCA)** Micro Project curriculum. 

The application demonstrates core full-stack competencies using the **MERN** stack architecture combined with a **GraphQL API** and modern **React (Vite)** frontend driven by the **native JavaScript Fetch API**.

---

## 🌟 Key Highlights

- **100% GraphQL API:** No REST endpoints used. Implements custom GraphQL schema, queries (`getQuizzes`, `getQuiz`, `getQuizResult`), and mutations (`addQuiz`, `submitQuiz`).
- **Native Fetch API:** No Axios, No Apollo Client on the frontend. A clean, reusable service function handles GraphQL POST requests, variables, headers, and errors.
- **Stateful & Stateless React Components:** Clearly separated components using React functional paradigms, `useState`, and `useEffect`.
- **Three Event Handlers Demonstrated:**
  - `onClick`: Start Quiz, Next, Previous, Submit Quiz, Add/Remove Question.
  - `onChange`: Quiz metadata, question statements, option inputs, radio buttons.
  - `onSubmit`: Create Quiz form submission with comprehensive validation.
- **Cheating-Proof Backend Score Calculation:** Correct answers are hidden from the client during quiz attempts. Scores, percentages, and breakdowns are calculated server-side in MongoDB.
- **Pre-Seeded Academic Quizzes:** 3 built-in quizzes (Python Programming, DBMS, Web Development) with 5 MCQs each.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript (ES6+), HTML5, Modern CSS3 |
| **Backend** | Node.js, Express.js, Apollo Server (`@apollo/server`), GraphQL |
| **Database** | MongoDB, Mongoose ODM |
| **API Client** | Native JavaScript Fetch API |

---

## 📁 Project Directory Structure

```text
online-quiz-application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation header (Stateless)
│   │   │   ├── QuizCard.jsx            # Quiz display card (Stateless)
│   │   │   ├── QuizList.jsx            # Grid of quizzes (Stateless)
│   │   │   ├── QuestionCard.jsx        # Question & options presentation (Stateless)
│   │   │   └── ConfirmationModal.jsx   # Submission confirmation popup (Stateless)
│   │   ├── pages/
│   │   │   ├── QuizDashboard.jsx       # Catalog of quizzes (Stateful)
│   │   │   ├── QuizForm.jsx            # Create custom quiz form (Stateful)
│   │   │   ├── QuizAttempt.jsx         # Question-by-question quiz session (Stateful)
│   │   │   └── ResultPage.jsx          # Score summary & answer review
│   │   ├── services/
│   │   │   └── graphql.js              # Reusable Fetch API GraphQL client
│   │   ├── styles/
│   │   │   └── index.css               # Clean modern educational theme
│   │   ├── App.jsx                     # Root router component
│   │   └── main.jsx                    # Vite React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js                       # Mongoose MongoDB connection & fallback
│   ├── graphql/
│   │   ├── schema.js                   # GraphQL TypeDefs (Queries, Mutations, Types)
│   │   └── resolvers.js                # GraphQL Resolvers (Database queries & score logic)
│   ├── models/
│   │   ├── Quiz.js                     # Quiz Mongoose Schema
│   │   └── QuizResult.js               # Quiz Result Mongoose Schema
│   ├── seed.js                         # Sample quizzes (Python, DBMS, Web Dev)
│   ├── server.js                       # Express + Apollo Server entry point
│   ├── test-api.js                     # Automated verification test script
│   ├── .env                            # Environment variables (PORT, MONGODB_URI)
│   ├── .env.example
│   └── package.json
│
├── package.json                        # Monorepo root helper scripts
├── PROJECT_REPORT.md                   # 20-Point Academic Project Report
└── README.md                           # Documentation & Viva Guide
```

---

## 🚀 How to Run the Project (Step-by-Step)

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local MongoDB Community Server, MongoDB Compass, or a free MongoDB Atlas connection string)

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd online-quiz-application/backend
   ```
2. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env` (default is provided):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/online_quiz_db
   ```
   *(Note: You can also paste your MongoDB Atlas URI here! If no local MongoDB is running, the server automatically starts an embedded in-memory MongoDB instance for quick testing).*

4. Start the server:
   ```bash
   npm start
   ```
   Or for auto-reloading during development:
   ```bash
   npm run dev
   ```
5. You will see:
   ```text
   🚀 Online Quiz API Server running on port 5000
   📊 GraphQL Endpoint: http://localhost:5000/graphql
   ```

---

### Step 2: Start the Frontend Application

1. Open a **second terminal** and navigate to the frontend directory:
   ```bash
   cd online-quiz-application/frontend
   ```
2. Install frontend dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

### Optional: Run Both from Root Directory
From the `online-quiz-application/` root directory:
- To run backend: `npm run server`
- To run frontend: `npm run client`
- To re-seed sample quizzes: `npm run seed`

---

## 🧩 React Component Architecture

### 1. Stateful Components (`useState`, `useEffect`)
- **`QuizDashboard.jsx`**:
  - Uses `useState` for `quizzes`, `loading`, and `error`.
  - Uses `useEffect` on component mount to retrieve quiz catalog from GraphQL.
- **`QuizAttempt.jsx`**:
  - Uses `useState` for tracking `currentIndex` (one question at a time), `userAnswers` map, `submitting` status, and `showConfirmModal`.
  - Uses `useEffect` to fetch questions securely.
- **`QuizForm.jsx`**:
  - Uses `useState` to manage `title`, `description`, dynamic array of `questions` (with text, 4 options, and correct answer index), `error`, and `success`.

### 2. Stateless Components (Props-Driven)
- **`QuizCard.jsx`**: Receives quiz metadata and `onStartQuiz` callback via props.
- **`QuizList.jsx`**: Receives `quizzes` array and passes individual items to `QuizCard`.
- **`QuestionCard.jsx`**: Receives current question, index, total count, selected option, and `onSelectOption` callback via props.
- **`ConfirmationModal.jsx`**: Displays a confirm prompt before submission.
- **`ResultPage.jsx`**: Receives calculated scores, percentage, and detailed answers breakdown via props.

---

## 🖱️ Event Handling Demonstrations

### 1. `onClick` Event Handlers
- **Start Quiz:** Clicking "Start Quiz →" in `QuizCard` triggers `onStartQuiz(quiz._id)`.
- **Question Navigation:** "Next →" and "← Previous" in `QuizAttempt` navigate between questions.
- **Quiz Submission:** "✓ Submit Quiz" in `QuizAttempt` triggers confirmation modal.
- **Add / Remove Questions:** "➕ Add Question" and "Remove" in `QuizForm` dynamically modify questions array.

### 2. `onChange` Event Handlers
- **Text Inputs:** Updating Quiz Title, Description, and Question Statements.
- **Option Inputs:** Modifying 4 option strings in `QuizForm`.
- **Radio Selection:** Selecting answers in `QuestionCard` and marking correct answer in `QuizForm`.

### 3. `onSubmit` Event Handlers
- **Create Quiz Submission:** The form in `QuizForm` prevents default reload (`e.preventDefault()`), validates inputs, and triggers the `addQuiz` GraphQL mutation.

---

## ⚡ GraphQL Schema & API Operations

### Schema Definition
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
  addQuiz(title: String!, description: String!, questions: [QuestionInput!]!): Quiz!
  submitQuiz(quizId: ID!, answers: [AnswerInput!]!): QuizResult!
}
```

---

## 🌐 Fetch API Integration (`graphql.js`)

Unlike traditional REST apps or apps using heavy Apollo Client/Axios libraries, this project uses the browser's **native Fetch API**:

```javascript
export const fetchGraphQL = async (query, variables = {}) => {
  const response = await fetch('http://localhost:5000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await response.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map(e => e.message).join(' | '));
  }
  return json.data;
};
```

---

## 🎓 Viva Questions & Answers (College Preparation)

### Q1: What is the difference between Stateful and Stateless components?
**Answer:** A stateful component (e.g. `QuizAttempt`, `QuizForm`, `QuizDashboard`) declares and manages its own mutable state using React hooks like `useState`. A stateless component (e.g. `QuizCard`, `QuestionCard`, `QuizList`) has no internal state; it relies exclusively on props passed down from parent components to render UI.

### Q2: Why did you use GraphQL instead of REST?
**Answer:** GraphQL allows the client to request precisely the data fields it needs in a single request (preventing over-fetching and under-fetching). It uses a strongly-typed schema with explicit queries and mutations, providing clear contracts and easy API maintenance.

### Q3: How do you communicate with GraphQL without Apollo Client or Axios?
**Answer:** We use the native JavaScript `fetch()` API sending a `POST` request to `/graphql` with `Content-Type: application/json`. The request body contains a JSON object with `{ query, variables }`. We parse the JSON response and check `json.errors` before returning `json.data`.

### Q4: How is security ensured during the quiz attempt?
**Answer:** In the `getQuiz` resolver, `correctAnswer` is masked and returned as `null` to the frontend. The scoring logic runs strictly on the backend inside the `submitQuiz` mutation resolver, which looks up the real answers from MongoDB and computes the score.

### Q5: How do props and event callbacks work together?
**Answer:** Props allow unidirectional data flow from parent to child (e.g. passing question data to `QuestionCard`). To pass user events back to the parent, the parent passes callback functions (e.g. `onSelectOption`) through props, which the child invokes when an `onChange` or `onClick` occurs.

---

## 📜 License & Academic Integrity
Developed as an MCA Individual Micro Project (Subject: Full Stack Web Development using MERN). For educational and demonstration purposes.

