const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_KEY, JWT_LIFETIME } = require('../config/constants');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'password field is required']
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (passwordInput) {
  const isMatch = await bcrypt.compare(passwordInput, this.password);
  return isMatch;
};

UserSchema.methods.createJWT = function (type = null) {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      username: this.username
    },
    JWT_KEY,
    {
      expiresIn: type === 'loginToken' ? '1d' : JWT_LIFETIME
    }
  );
};

module.exports = model('User', UserSchema);
