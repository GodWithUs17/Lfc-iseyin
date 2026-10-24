const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/auth');
const sermonsRouter = require('./routes/sermon');
const liveRouter = require('./routes/live');
const eventsRouter = require('./routes/events');
const contactRouter = require('./routes/contact');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'LFC Iseyin backend is running.' });
});

app.use('/api/auth', authRouter);
app.use('/api/sermons', sermonsRouter);
app.use('/api/live', liveRouter);
app.use('/api/events', eventsRouter);
app.use('/api/contact', contactRouter);

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});