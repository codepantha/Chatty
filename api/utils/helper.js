const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/constants');
const NotFoundError = require('../errors/NotFound');
const UnauthenticatedError = require('../errors/Unauthenticated');
const User = require('../models/User');
const sendVerificationEmail = require('./email/verifyEmail');

const decodeToken = (tokenToDecrypt, email = null, res = null, type=null) => {
  return jwt.verify(tokenToDecrypt, JWT_KEY, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      if (type === 'registration')
        resendToken(email, res);
      else throw new UnauthenticatedError('session expired. Please log in.')
    }
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
