const bcrypt = require('bcrypt');
const prisma = require('./src/prisma/client');
const crypto = require('crypto');

const seedApiKeys = async () => {
  const apiKey = crypto.randomUUID();
  const secret = crypto.randomBytes(32).toString('hex');

  await prisma.apiKey.create({
    data: {
      apiKey,
      secret,
    },
  });

  console.log(`API Key: ${apiKey}`);
  console.log(`Secret: ${secret}`);
};
const seedUser = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  console.log('User seeded');
};

seedUser();
seedApiKeys();