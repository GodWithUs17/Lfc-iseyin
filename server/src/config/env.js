const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5001,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'lfc-iseyin-dev-secret',
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'admin@lfciseyin.org').toLowerCase(),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'winners2026',
};
