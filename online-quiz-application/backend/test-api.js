import connectDB from './config/db.js';
import Quiz from './models/Quiz.js';
import QuizResult from './models/QuizResult.js';
import resolvers from './graphql/resolvers.js';
import { sampleQuizzes } from './seed.js';

const runVerificationTests = async () => {
  console.log('--- STARTING COMPREHENSIVE END-TO-END VERIFICATION ---');

  // 1. Connect to DB
  console.log('[Test 1] Testing Database Connection...');
  const conn = await connectDB();
  if (!conn) {
    throw new Error('Database connection failed.');
  }
  console.log('✅ Database connected.');

  // Reset and seed
  console.log('[Test 2] Seeding initial sample quizzes...');
  await Quiz.deleteMany({});
  await QuizResult.deleteMany({});
  await Quiz.insertMany(sampleQuizzes);
  const initialCount = await Quiz.countDocuments();
  console.log(`✅ Seeded ${initialCount} quizzes.`);

  // 2. Test getQuizzes resolver
  console.log('[Test 3] Testing "getQuizzes" Query Resolver...');
  const quizzes = await resolvers.Query.getQuizzes();
  console.log(`Retrieved ${quizzes.length} quizzes.`);
  if (quizzes.length !== 3) {
    throw new Error(`Expected 3 quizzes, got ${quizzes.length}`);
  }
  console.log(`Titles: ${quizzes.map((q) => q.title).join(', ')}`);
  console.log('✅ "getQuizzes" Query verified.');

  // 3. Test getQuiz(id) resolver
  console.log('[Test 4] Testing "getQuiz(id)" Query Resolver...');
  const pythonQuiz = quizzes.find((q) => q.title === 'Python Programming');
  const singleQuiz = await resolvers.Query.getQuiz(null, { id: pythonQuiz._id });
  if (!singleQuiz || singleQuiz.questions.length !== 5) {
    throw new Error('Failed to retrieve single quiz with 5 questions');
  }
  // Verify correct answers are hidden before submission
  if (singleQuiz.questions[0].correctAnswer !== null) {
    throw new Error('Security violation: correctAnswer was exposed before submission!');
  }
  console.log(`✅ "getQuiz" Query verified (5 questions, answers securely masked: ${singleQuiz.questions[0].correctAnswer === null}).`);

  // 4. Test submitQuiz resolver (Backend score calculation)
  console.log('[Test 5] Testing "submitQuiz" Mutation Resolver...');
  // Let's submit 4 correct answers and 1 wrong answer for Python Programming:
  // Q0: Tuple (idx 2) - Correct
  // Q1: list (idx 1) - Correct
  // Q2: def (idx 2) - Correct
  // Q3: 8 (idx 1) - Correct
  // Q4: count() (idx 0) - Wrong (correct is len(), idx 3)
  const answers = [
    { questionIndex: 0, selectedOption: 2 },
    { questionIndex: 1, selectedOption: 1 },
    { questionIndex: 2, selectedOption: 2 },
    { questionIndex: 3, selectedOption: 1 },
    { questionIndex: 4, selectedOption: 0 }
  ];

  const submissionResult = await resolvers.Mutation.submitQuiz(null, {
    quizId: pythonQuiz._id,
    answers
  });

  console.log('Submission Result Metrics:');
  console.log(`- Score: ${submissionResult.score} / ${submissionResult.totalQuestions}`);
  console.log(`- Correct: ${submissionResult.correctAnswers}`);
  console.log(`- Incorrect: ${submissionResult.incorrectAnswers}`);
  console.log(`- Percentage: ${submissionResult.percentage}%`);

  if (submissionResult.score !== 4 || submissionResult.correctAnswers !== 4 || submissionResult.incorrectAnswers !== 1 || submissionResult.percentage !== 80) {
    throw new Error(`Score calculation mismatch: ${JSON.stringify(submissionResult)}`);
  }
  console.log('✅ "submitQuiz" Mutation verified (Server-side score calculation accurate: 4/5 = 80%).');

  // 5. Test getQuizResult query resolver
  console.log('[Test 6] Testing "getQuizResult(id)" Query Resolver...');
  const fetchedResult = await resolvers.Query.getQuizResult(null, { id: submissionResult._id });
  if (!fetchedResult || fetchedResult.score !== 4) {
    throw new Error('Failed to fetch saved quiz result from MongoDB');
  }
  console.log(`✅ "getQuizResult" Query verified (Result fetched from MongoDB, Detailed review items: ${fetchedResult.detailedResults.length}).`);

  // 6. Test addQuiz mutation resolver
  console.log('[Test 7] Testing "addQuiz" Mutation Resolver...');
  const newQuizInput = {
    title: 'Cloud Computing & DevOps',
    description: 'Basics of virtualization, cloud service models, and containers.',
    questions: [
      {
        questionText: 'What does IaaS stand for in Cloud Computing?',
        options: [
          'Infrastructure as a Service',
          'Internet as a Service',
          'Integration as a Software',
          'Interface as a Solution'
        ],
        correctAnswer: 0
      },
      {
        questionText: 'Which tool is primarily used for containerization?',
        options: ['Git', 'Docker', 'Apache HTTPD', 'Nginx'],
        correctAnswer: 1
      }
    ]
  };

  const createdQuiz = await resolvers.Mutation.addQuiz(null, newQuizInput);
  if (!createdQuiz || createdQuiz.title !== 'Cloud Computing & DevOps') {
    throw new Error('Failed to add new quiz');
  }
  console.log(`Created Quiz ID: ${createdQuiz._id}, Question Count: ${createdQuiz.questionCount}`);

  const totalQuizzesNow = await resolvers.Query.getQuizzes();
  if (totalQuizzesNow.length !== 4) {
    throw new Error(`Expected 4 quizzes after adding, got ${totalQuizzesNow.length}`);
  }
  console.log(`✅ "addQuiz" Mutation verified. Total quizzes is now ${totalQuizzesNow.length}.`);

  console.log('--- ALL BACKEND GRAPHQL RESOLVER & MONGOOSE TESTS PASSED! ---');
  process.exit(0);
};

runVerificationTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});

