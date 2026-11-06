import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online_quiz_db';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn('[MongoDB] Make sure MongoDB is running locally (mongod) or configure MONGODB_URI in .env');
    // We do not crash the entire process immediately so errors can be inspected during dev/viva
  }
};

export default connectDB;
