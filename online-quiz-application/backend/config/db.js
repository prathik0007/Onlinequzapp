import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose.
 * 1. Attempts connection to configured MONGODB_URI (e.g. MongoDB Compass, Community Server, or Atlas).
 * 2. If no external MongoDB daemon is active, smoothly provisions an in-memory MongoDB
 *    instance so the academic demo and viva tests work out-of-the-box without manual DB setup!
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_quiz_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Fast failover if local mongod is not started
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (primaryError) {
    console.warn(`[MongoDB] Local/remote MongoDB at "${mongoURI}" is not reachable (${primaryError.message}).`);
    console.log('[MongoDB] Switching to automatic embedded MongoDB instance for seamless project demo...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Embedded In-Memory MongoDB connected successfully at: ${memoryUri}`);
      return conn;
    } catch (fallbackError) {
      console.error('[MongoDB] Embedded instance error:', fallbackError.message);
      console.warn('[MongoDB] Please ensure MongoDB is running (mongod) or configure MONGODB_URI in backend/.env');
    }
  }
};

export default connectDB;
