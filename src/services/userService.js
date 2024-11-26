const userRepository = require('../repositories/userRepository');

const getAllUsers = async () => {
  return await userRepository.findAll();
};

module.exports = { getAllUsers };
