const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = require('express').Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);

  let hashedPw = await bcrypt.hash(password, salt);

  if (hashedPw) {
    const user = await User.create({ username, email, password: hashedPw });
    if (user) res.status(201).json(user);
  }
});

module.exports = router;
