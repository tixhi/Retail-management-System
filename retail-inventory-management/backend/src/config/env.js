const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || '',
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DNS_SERVERS: (process.env.MONGODB_DNS_SERVERS || '').split(',').map((server) => server.trim()).filter(Boolean),
  ADMIN_SIGNUP_CODE: process.env.ADMIN_SIGNUP_CODE || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
