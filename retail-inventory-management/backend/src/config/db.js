const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Configure the database before starting the API.');
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
  }
}

module.exports = { connectDB };
