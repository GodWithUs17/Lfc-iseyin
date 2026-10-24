const express = require('express');
const cors = require('cors');
const { PORT, CLIENT_URL } = require('./config/env');
const apiRouter = require('./routes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');
const { getHealth } = require('./controllers/healthController');

const app = express();

app.use(
  cors({
    origin: [CLIENT_URL, 'http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', getHealth);
app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`LFC Iseyin API listening on http://localhost:${PORT}`);
});

module.exports = app;
