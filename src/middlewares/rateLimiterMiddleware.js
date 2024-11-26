const rateLimit = require('express-rate-limit');

// Middleware to apply rate limiting
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each API key to 100 requests per minute
  keyGenerator: (req) => req.header('X-API-KEY'), // Use API key as the identifier
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later' });
  },
});

module.exports = rateLimiter;
