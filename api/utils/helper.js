const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/constants');
const NotFoundError = require('../errors/NotFound');
const User = require('../models/User');
const sendVerificationEmail = require('./email/verifyEmail');

const decodeToken = (tokenToDecrypt, email = null, res = null) => {
  return jwt.verify(tokenToDecrypt, JWT_KEY, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') resendToken(email, res);
    else return decoded;
  });
};

const resendToken = async (email, res) => {
  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError('User not found');
  const token = user.createJWT();

  await sendVerificationEmail({ name: user.username, to: user.email, token });

  res.send('Token expired. Please check your email for a new activation link.');
};

module.exports = { decodeToken };
