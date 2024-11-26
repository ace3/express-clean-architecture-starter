const express = require('express');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { authenticate } = require('./middlewares/authMiddleware');
const { authenticateRequest } = require('./middlewares/authMiddleware');
const rateLimiter = require('./middlewares/rateLimiterMiddleware');
const app = express();

app.use(express.json());

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
// app.use('/api/users', authenticate, userRoutes);

// Apply middleware to specific routes
app.use('/api/users', authenticateRequest,rateLimiter, userRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
