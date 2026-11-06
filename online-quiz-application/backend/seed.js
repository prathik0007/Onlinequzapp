import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Quiz from './models/Quiz.js';

dotenv.config();

export const sampleQuizzes = [
  {
    title: 'Python Programming',
    description: 'Test your fundamental knowledge of Python data structures, syntax, and concepts.',
    questions: [
      {
        questionText: 'Which of the following is an immutable data type in Python?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswer: 2
      },
      {
        questionText: 'What will type([]) evaluate to in Python?',
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'set'>", "<class 'array'>"],
        correctAnswer: 1
      },
      {
        questionText: 'Which keyword is used to define a function in Python?',
        options: ['func', 'define', 'def', 'function'],
        correctAnswer: 2
      },
      {
        questionText: 'What is the output of print(2 ** 3) in Python?',
        options: ['6', '8', '9', '5'],
        correctAnswer: 1
      },
      {
        questionText: 'Which built-in function returns the length of a sequence in Python?',
        options: ['count()', 'size()', 'length()', 'len()'],
        correctAnswer: 3
      }
    ]
  },
  {
    title: 'Database Management Systems',
    description: 'Assess your understanding of DBMS, relational models, SQL queries, and ACID properties.',
    questions: [
      {
        questionText: 'What does ACID stand for in the context of DBMS transactions?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Control, Integrity, Data',
          'Access, Concurrency, Indexing, Delivery',
          'Automatic, Concurrent, Isolated, Distributed'
        ],
        correctAnswer: 0
      },
      {
        questionText: 'Which SQL clause is used to filter records after grouping with GROUP BY?',
        options: ['WHERE', 'ORDER BY', 'HAVING', 'LIMIT'],
        correctAnswer: 2
      },
      {
        questionText: 'A primary key constraint in relational databases requires values to be:',
        options: [
          'Unique and Not Null',
          'Unique and Nullable',
          'Not Null only',
          'Nullable only'
        ],
        correctAnswer: 0
      },
      {
        questionText: 'Which normal form deals with the elimination of transitive functional dependencies?',
        options: [
          'First Normal Form (1NF)',
          'Second Normal Form (2NF)',
          'Third Normal Form (3NF)',
          'Boyce-Codd Normal Form (BCNF)'
        ],
        correctAnswer: 2
      },
      {
        questionText: 'What category of database does MongoDB belong to?',
        options: [
          'Relational Database (RDBMS)',
          'Document-oriented NoSQL Database',
          'Graph Database',
          'Key-Value Store'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    title: 'Web Development',
    description: 'Explore core concepts of modern full-stack web development, HTML5, CSS, and React.',
    questions: [
      {
        questionText: 'What is the primary purpose of the useState hook in React?',
        options: [
          'To manage state variables inside functional components',
          'To fetch data from GraphQL APIs directly',
          'To style HTML elements with inline CSS',
          'To create new database schemas in MongoDB'
        ],
        correctAnswer: 0
      },
      {
        questionText: 'In GraphQL, which operation type is used to modify or write data on the server?',
        options: ['Query', 'Mutation', 'Subscription', 'Resolver'],
        correctAnswer: 1
      },
      {
        questionText: 'Which semantic HTML5 element is specifically designed for navigational links?',
        options: ['<section>', '<nav>', '<header>', '<aside>'],
        correctAnswer: 1
      },
      {
        questionText: 'What is the default HTTP method when making requests using the native Fetch API?',
        options: ['POST', 'PUT', 'GET', 'PATCH'],
        correctAnswer: 2
      },
      {
        questionText: 'What is the role of props in React components?',
        options: [
          'To store mutable private internal component state',
          'To pass read-only data from parent to child components',
          'To execute server-side database migrations',
          'To trigger backend server restarts'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Quiz.countDocuments();
    if (count === 0) {
      console.log('[Seed] No quizzes found in database. Seeding 3 default quizzes...');
      await Quiz.insertMany(sampleQuizzes);
      console.log('[Seed] Successfully seeded 3 sample quizzes (Python, DBMS, Web Dev)!');
    } else {
      console.log(`[Seed] Database already contains ${count} quiz(zes). Skipping auto-seed.`);
    }
  } catch (error) {
    console.error('[Seed] Error during seeding:', error.message);
  }
};

// If run directly: node seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    console.log('[Seed Script] Clearing old quizzes and re-seeding...');
    await Quiz.deleteMany({});
    await Quiz.insertMany(sampleQuizzes);
    console.log('[Seed Script] Database seeded successfully with sample quizzes!');
    await mongoose.connection.close();
    process.exit(0);
  })();
}

