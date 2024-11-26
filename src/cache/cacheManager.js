const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
  max: 1000, // Maximum 1000 entries
  ttl: 1000 * 60, // Cache entries expire after 1 minute
});

const getCachedSecret = (apiKey) => {
  return cache.get(apiKey);
};

const setCachedSecret = (apiKey, secret) => {
  cache.set(apiKey, secret);
};

module.exports = { getCachedSecret, setCachedSecret };
