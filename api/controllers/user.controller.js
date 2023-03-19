const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const sendVerificationEmail = require('../utils/email/verifyEmail');
const { decodeToken } = require('../utils/helper');
const UnauthorizedError = require('../errors/Unauthorized');
const NotFoundError = require('../errors/NotFound');
const UnauthenticatedError = require('../errors/Unauthenticated');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPw = await bcrypt.hash(password, salt);
  const user = await User.create({ username, email, password: hashedPw });

  const token = await user.createJWT();

  await sendVerificationEmail({ name: username, to: email, token });

  if (user) {
    const { password, ...userData } = user._doc;
    res.status(StatusCodes.CREATED).json({
      msg: 'An activation has been sent to your email',
      user: userData
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (password === 'password') console.log('password is password');

  const user = await User.findOne({ username });

  if (!user) throw new UnauthenticatedError('invalid credentials!');

  const isCorrectPassword = await user.comparePassword(password);

  if (!isCorrectPassword)
    throw new UnauthenticatedError('invalid credentials!');

  if (!user.isVerified)
    throw new UnauthorizedError(
      'user is not verified. Please check your email for verification istructions'
    );

  const accessToken = await user.createJWT();

  delete user._doc.password;

  res
    .status(StatusCodes.OK)
    .cookie('token', accessToken, { sameSite: 'none', secure: true })
    .json({ msg: 'login successful', user });
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

module.exports = { register, login, verify };
