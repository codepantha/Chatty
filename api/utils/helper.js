const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/constants');

const decodeToken = (tokenToDecrypt) => {
  return jwt.verify(tokenToDecrypt, JWT_KEY);
};

module.exports = { decodeToken };
