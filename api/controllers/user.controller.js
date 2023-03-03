const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/email/verifyEmail');
const UnauthenticatedError = require('../errors/Unauthenticated');
const { decodeToken } = require('../utils/helper');
const UnauthorizedError = require('../errors/Unauthorized');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });

  const token = await user.createJWT();

  await sendVerificationEmail({ name: username, to: email, token });

  if (user) res.status(201).json(user);
};

const verify = async (req, res) => {
  const { token } = req.params;

  if (token) {
    const decoded = decodeToken(token);
    if (!decoded) throw new UnauthenticatedError('invalid token');

    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) throw new UnauthorizedError('User does not exist');

    user.isVerified = true;
    user.save();

    res.status(200).json(user);
  }
}

module.exports = { register, verify };
