const Message = require('../models/Message');
const { decodeToken } = require('../utils/helper');

const router = require('express').Router();

router.get('/:recipientId', async (req, res) => {
  const { recipientId } = req.params;
  const { token } = req.cookies;
  const { userId: senderId } = decodeToken(token);

  const messages = await Message.find({
    sender: {$in: [senderId, recipientId]},
    recipient: {$in: [senderId, recipientId]}
  }).sort({ createdAt: 1 })

  res.json(messages);
})

module.exports = router;
