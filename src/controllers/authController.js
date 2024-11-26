const authService = require('../services/authService');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const token = await authService.authenticateUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
