const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String
  },
  { timestamps: true }
);

module.exports = model('Message', MessageSchema);
