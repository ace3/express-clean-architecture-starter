const prisma = require('../prisma/client');

const getApiKeyDetails = async (apiKey) => {
  return await prisma.apiKey.findUnique({
    where: { apiKey },
  });
};

module.exports = { getApiKeyDetails };
