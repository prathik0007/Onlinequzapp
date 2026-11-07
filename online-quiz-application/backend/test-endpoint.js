import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import connectDB from './config/db.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import Quiz from './models/Quiz.js';
import QuizResult from './models/QuizResult.js';
import { sampleQuizzes } from './seed.js';

dotenv.config();

const PORT = 5005; // Use test port to avoid collision

const runEndpointVerification = async () => {
  console.log('====================================================');
  console.log('🧪 VERIFYING GRAPHQL ENDPOINT, SCHEMA, AND MONGO DB');
  console.log('====================================================');

  // 1. Connect to MongoDB
  console.log('\n[Step 1] Connecting to MongoDB...');
  const conn = await connectDB();
  if (!conn) {
    throw new Error('MongoDB connection failed');
  }
  console.log('✅ MongoDB connected successfully.');

  // 2. Seed database
  console.log('\n[Step 2] Seeding initial sample quizzes into MongoDB...');
  await Quiz.deleteMany({});
  await QuizResult.deleteMany({});
  await Quiz.insertMany(sampleQuizzes);
  const quizCount = await Quiz.countDocuments();
  console.log(`✅ MongoDB contains ${quizCount} sample quizzes.`);

  // 3. Initialize Express + ApolloServer
  console.log('\n[Step 3] Initializing Express & Apollo Server on port ' + PORT + '...');
  const app = express();
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ]
  });

  await server.start();
  app.use('/graphql', expressMiddleware(server));

  const httpServer = await new Promise((resolve) => {
    const s = app.listen(PORT, () => resolve(s));
  });
  console.log(`✅ Server running at http://localhost:${PORT}/graphql`);

  // 4. Test GET /graphql (Browser visit to GraphQL endpoint)
  console.log('\n[Step 4] Testing GET /graphql with Accept: text/html (Browser access)...');
  const browserRes = await fetch(`http://localhost:${PORT}/graphql`, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  console.log(`GET /graphql status: ${browserRes.status}`);
  console.log(`Content-Type: ${browserRes.headers.get('content-type')}`);
  const htmlText = await browserRes.text();
  const hasSandbox = htmlText.includes('Apollo') || htmlText.includes('sandbox') || htmlText.includes('<!DOCTYPE html>');
  if (!hasSandbox || browserRes.status !== 200) {
    throw new Error('GET /graphql did not return the embedded GraphQL interface!');
  }
  console.log('✅ Browser access to /graphql returns embedded GraphQL testing interface (200 OK)!');

  // 5. Test POST /graphql (getQuizzes query)
  console.log('\n[Step 5] Testing POST /graphql: "getQuizzes" Query...');
  const getQuizzesQuery = `
    query GetQuizzes {
      getQuizzes {
        _id
        title
        description
        questionCount
      }
    }
  `;

  const getQuizzesRes = await fetch(`http://localhost:${PORT}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: getQuizzesQuery })
  });

  const getQuizzesData = await getQuizzesRes.json();
  if (getQuizzesData.errors) {
    throw new Error(`getQuizzes error: ${JSON.stringify(getQuizzesData.errors)}`);
  }
  const quizzes = getQuizzesData.data.getQuizzes;
  console.log(`Retrieved ${quizzes.length} quizzes from MongoDB:`);
  quizzes.forEach((q, i) => console.log(`   ${i + 1}. ${q.title} (${q.questionCount} questions)`));
  if (quizzes.length !== 3) {
    throw new Error(`Expected 3 quizzes, got ${quizzes.length}`);
  }
  console.log('✅ "getQuizzes" Query verified.');

  // 6. Test POST /graphql (addQuiz mutation)
  console.log('\n[Step 6] Testing POST /graphql: "addQuiz" Mutation...');
  const addQuizMutation = `
    mutation AddQuiz($title: String!, $description: String!, $questions: [QuestionInput!]!) {
      addQuiz(title: $title, description: $description, questions: $questions) {
        _id
        title
        questionCount
      }
    }
  `;

  const newQuizVariables = {
    title: 'Computer Networks & Security',
    description: 'OSI Model, TCP/IP protocols, subnetting, and encryption concepts.',
    questions: [
      {
        questionText: 'Which layer of the OSI model is responsible for routing packets?',
        options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        correctAnswer: 2
      },
      {
        questionText: 'What is the default port used by HTTPS protocol?',
        options: ['80', '443', '8080', '21'],
        correctAnswer: 1
      }
    ]
  };

  const addQuizRes = await fetch(`http://localhost:${PORT}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: addQuizMutation,
      variables: newQuizVariables
    })
  });

  const addQuizData = await addQuizRes.json();
  if (addQuizData.errors) {
    throw new Error(`addQuiz error: ${JSON.stringify(addQuizData.errors)}`);
  }
  const addedQuiz = addQuizData.data.addQuiz;
  console.log(`Created new quiz: "${addedQuiz.title}" (ID: ${addedQuiz._id}, Questions: ${addedQuiz.questionCount})`);
  console.log('✅ "addQuiz" Mutation verified.');

  // 7. Test POST /graphql (getQuiz query)
  console.log('\n[Step 7] Testing POST /graphql: "getQuiz" Query...');
  const getQuizQuery = `
    query GetQuiz($id: ID!) {
      getQuiz(id: $id) {
        _id
        title
        questions {
          questionText
          options
          correctAnswer
        }
      }
    }
  `;

  const getQuizRes = await fetch(`http://localhost:${PORT}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: getQuizQuery,
      variables: { id: addedQuiz._id }
    })
  });

  const getQuizData = await getQuizRes.json();
  const singleQuiz = getQuizData.data.getQuiz;
  console.log(`Retrieved single quiz: ${singleQuiz.title}`);
  if (singleQuiz.questions[0].correctAnswer !== null) {
    throw new Error('Security check failed: correctAnswer was not masked!');
  }
  console.log('✅ "getQuiz" Query verified (correctAnswer masked during attempt).');

  // 8. Test POST /graphql (submitQuiz mutation)
  console.log('\n[Step 8] Testing POST /graphql: "submitQuiz" Mutation...');
  const submitQuizMutation = `
    mutation SubmitQuiz($quizId: ID!, $answers: [AnswerInput!]!) {
      submitQuiz(quizId: $quizId, answers: $answers) {
        _id
        score
        totalQuestions
        percentage
        correctAnswers
        incorrectAnswers
      }
    }
  `;

  // Answer Q0 correctly (idx 2) and Q1 correctly (idx 1)
  const submitRes = await fetch(`http://localhost:${PORT}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: submitQuizMutation,
      variables: {
        quizId: addedQuiz._id,
        answers: [
          { questionIndex: 0, selectedOption: 2 },
          { questionIndex: 1, selectedOption: 1 }
        ]
      }
    })
  });

  const submitData = await submitRes.json();
  const result = submitData.data.submitQuiz;
  console.log(`Score: ${result.score}/${result.totalQuestions} (${result.percentage}%)`);
  if (result.score !== 2 || result.percentage !== 100) {
    throw new Error(`Score calculation error: ${JSON.stringify(result)}`);
  }
  console.log('✅ "submitQuiz" Mutation verified (Server-side score calculation & MongoDB storage).');

  // Close test server
  await new Promise((resolve) => httpServer.close(resolve));
  console.log('\n====================================================');
  console.log('🎉 ALL 8 GRAPHQL ENDPOINT & DATABASE CHECKS PASSED!');
  console.log('====================================================');
  process.exit(0);
};

runEndpointVerification().catch((err) => {
  console.error('\n❌ Endpoint verification failed:', err);
  process.exit(1);
});
