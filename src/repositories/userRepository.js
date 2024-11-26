const prisma = require('../prisma/client');

const findAll = async () => {
  return await prisma.user.findMany();
};

const findByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

module.exports = { findAll, findByEmail };
