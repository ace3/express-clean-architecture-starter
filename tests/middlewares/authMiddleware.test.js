jest.mock('../../src/repositories/apiKeyRepository');
jest.mock('../../src/cache/cacheManager');

const { authenticateRequest } = require('../../src/middlewares/authMiddleware');
const { getApiKeyDetails } = require('../../src/repositories/apiKeyRepository');
const { getCachedSecret, setCachedSecret } = require('../../src/cache/cacheManager');
const { generateSignature } = require('../../src/utils/tokenUtils');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if API key or signature is missing', async () => {
    req.header.mockReturnValueOnce(null);
    await authenticateRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing API key or signature' });
  });

  it('should return 401 for an invalid API key', async () => {
    req.header.mockReturnValueOnce('invalid_key').mockReturnValueOnce('test_signature');
    getApiKeyDetails.mockResolvedValueOnce(null);

    await authenticateRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid API key' });
  });

  it('should validate the signature and call next()', async () => {
    const secret = 'test_secret';
    const apiKey = 'test_api_key';
    const signature = generateSignature(secret);

    req.header.mockReturnValueOnce(apiKey).mockReturnValueOnce(signature);
    getApiKeyDetails.mockResolvedValueOnce({ secret });
    getCachedSecret.mockReturnValueOnce(null);
    setCachedSecret.mockImplementation();

    await authenticateRequest(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
