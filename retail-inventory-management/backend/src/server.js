const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT, JWT_SECRET } = require('./config/env');

async function startServer() {
  if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET.startsWith('replace-with')) {
    throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters in the root .env file.');
  }

  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.log('Running in demo mode with in-memory data.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
