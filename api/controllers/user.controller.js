const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/email/verifyEmail');
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
  const {
    params: { token },
    query: { email }
  } = req;

  if (token) {
    const decoded = decodeToken(token, email, res);
    if (!decoded) return;

    const { userId } = decoded;

    const user = await User.findById(userId);

    if (!user) throw new UnauthorizedError('User does not exist');

    if (user.isVerified) {
      res.send('Email already activated. Please log in.');
      return;
    }

    user.isVerified = true;
    user.save();

    res.send('Email verified successfully!');
  }
};

module.exports = { register, verify };
