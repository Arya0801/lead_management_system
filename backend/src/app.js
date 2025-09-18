const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const errorHandler = require('./middleware/errorHandler');
const { FRONTEND_URL, NODE_ENV } = require('./config/env');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS - allow credentials for httpOnly cookie flows
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
