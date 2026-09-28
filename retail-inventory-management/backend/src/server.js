const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT } = require('./config/env');

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
