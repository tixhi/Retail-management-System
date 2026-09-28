const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32 || JWT_SECRET.startsWith('replace-with')) {
  throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters in the root .env file.');
}

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
