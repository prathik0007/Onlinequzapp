import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import connectDB from './config/db.js';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Apollo Server with embedded GraphQL IDE Sandbox
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
  ],
  formatError: (formattedError) => {
    console.error('[GraphQL Error]:', formattedError.message);
    return {
      message: formattedError.message,
      path: formattedError.path
    };
  }
});

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Auto-seed sample quizzes if database is empty
    await seedDatabase();

    // 3. Start Apollo Server
    await server.start();

    // 4. Attach GraphQL middleware to /graphql endpoint
    app.use('/graphql', expressMiddleware(server));

    // Health check endpoint
    app.get('/', (req, res) => {
      res.json({
        status: 'online',
        message: 'Online Quiz Application GraphQL API is running smoothly',
        graphqlEndpoint: `http://localhost:${PORT}/graphql`
      });
    });

    // 5. Start listening for requests
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Online Quiz API Server running on port ${PORT}`);
      console.log(`📊 GraphQL Endpoint: http://localhost:${PORT}/graphql`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

