const { Schema, model } = require('mongoose');

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
    }
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);
