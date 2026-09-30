const mongoose = require('mongoose');
const dns = require('dns');
const { MONGODB_URI, MONGODB_DNS_SERVERS } = require('./env');

const dnsServers = MONGODB_DNS_SERVERS.length
  ? MONGODB_DNS_SERVERS
  : process.platform === 'win32' ? ['10.91.20.113'] : dns.getServers();

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not set. Starting app in demo mode without a database.');
    return false;
  }

  try {
    dns.setServers(dnsServers);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}. Falling back to demo mode.`);
    return false;
  }
}

module.exports = { connectDB };
