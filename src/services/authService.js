const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/jwtUtils');

const authenticateUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = generateToken({ id: user.id, email: user.email });
  return token;
};

module.exports = { authenticateUser };
