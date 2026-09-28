const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { User } = require('./models');

async function seedAdmin() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Set BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters in the root .env file.');
  }

  await connectDB();
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
