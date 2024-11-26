const app = require('../../src/app'); // Your app.js file
const request = require('supertest');
const { generateSignature } = require('../../src/utils/tokenUtils');
const prisma = require('../../src/prisma/client'); // For seeding

jest.mock('../../src/cache/cacheManager', () => ({
  getCachedSecret: jest.fn(() => null),
  setCachedSecret: jest.fn(),
}));

beforeAll(async () => {
  await prisma.apiKey.create({
    data: {
      apiKey: 'test_api_key',
      secret: 'test_secret',
    },
  });
});

afterAll(async () => {
  // Delete only test-specific API keys
  await prisma.apiKey.deleteMany({
    where: {
      apiKey: {
        startsWith: 'test_', // Assumes test API keys start with 'test_'
      },
    },
  });
  await prisma.$disconnect();
});

describe('User Routes', () => {
  it('should return 401 if no API key or signature is provided', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Missing API key or signature');
  });

  it('should return 200 and user data with valid API key and signature', async () => {
    const secret = 'test_secret';
const apiKey = 'test_api_key';
    const signature = generateSignature(secret);

    const res = await request(app)
      .get('/api/users')
      .set('X-API-KEY', apiKey)
      .set('X-API-SIGNATURE', signature);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Assuming the endpoint returns user data
  });
});
