const { verifyToken } = require('../utils/jwtUtils');

const crypto = require('crypto');
const { generateSignature } = require('../utils/tokenUtils');
const { getApiKeyDetails } = require('../repositories/apiKeyRepository');
const { getCachedSecret, setCachedSecret } = require('../cache/cacheManager');
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyToken(token);
    req.user = user; // Add user data to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authenticateRequest = async (req, res, next) => {
  const apiKey = req.header('X-API-KEY');
  const providedSignature = req.header('X-API-SIGNATURE');

  if (!apiKey || !providedSignature) {
    return res.status(401).json({ message: 'Missing API key or signature' });
  }

  // Check cache for secret
  let secret = getCachedSecret(apiKey);

  if (!secret) {
    // Fetch from database if not in cache
    const apiKeyDetails = await getApiKeyDetails(apiKey);
    if (!apiKeyDetails) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    secret = apiKeyDetails.secret;
    setCachedSecret(apiKey, secret); // Cache the secret
  }

  // Validate signature
  const expectedSignature = generateSignature(secret);
  if (expectedSignature !== providedSignature) {
    return res.status(401).json({ message: 'Invalid signature' });
  }

  next(); // Authentication passed
};
module.exports = { authenticate,authenticateRequest };
