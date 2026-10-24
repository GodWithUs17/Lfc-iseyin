const { CLIENT_URL } = require('./env');

module.exports = {
  origin: [CLIENT_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
