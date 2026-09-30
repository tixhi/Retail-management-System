const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { JWT_SECRET } = require('./config/env');
const { User } = require('./models');

async function seedAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters in the root .env file.');
  }
  if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET.startsWith('replace-with')) {
    throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters in the root .env file.');
  }

  const connected = await connectDB();
  if (!connected) {
    throw new Error('Could not connect to MongoDB; the bootstrap administrator was not created.');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error(`A user already exists for ${email}; bootstrap did not change its password or role.`);
  }

  await User.create({
    name: 'System Administrator',
    email,
    password: await bcrypt.hash(password, 12),
    role: 'Admin',
    status: 'Active',
  });
  console.log(`Administrator account created for ${email}.`);
}

seedAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
